using System;
using System.IO;
using System.Linq;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using ResumeAI.Server.Models;
using WDocument = DocumentFormat.OpenXml.Wordprocessing.Document;
using WColor = DocumentFormat.OpenXml.Wordprocessing.Color;

namespace ResumeAI.Server.Services
{
    public interface IWordExportService
    {
        byte[] GenerateDocx(Resume resume);
    }

    public class WordExportService : IWordExportService
    {
        public byte[] GenerateDocx(Resume resume)
        {
            string docxAccentHex = "5CB338";
            string docxDividerHex = "CBD5E1";
            string docxLinkHex = "2563EB";
            string docxHeadingStyle = "underline";

            if (!string.IsNullOrWhiteSpace(resume.FormattingJson))
            {
                try
                {
                    using var doc = System.Text.Json.JsonDocument.Parse(resume.FormattingJson);
                    var root = doc.RootElement;
                    if (root.TryGetProperty("accentColor", out var acElem))
                    {
                        var ac = acElem.GetString();
                        if (!string.IsNullOrWhiteSpace(ac)) docxAccentHex = ac.TrimStart('#');
                    }
                    if (root.TryGetProperty("dividerColor", out var dcElem))
                    {
                        var dc = dcElem.GetString();
                        if (!string.IsNullOrWhiteSpace(dc)) docxDividerHex = dc.TrimStart('#');
                    }
                    if (root.TryGetProperty("linkColor", out var lcElem))
                    {
                        var lc = lcElem.GetString();
                        if (!string.IsNullOrWhiteSpace(lc) && lc != "match-accent")
                            docxLinkHex = lc.TrimStart('#');
                        else
                            docxLinkHex = docxAccentHex;
                    }
                    else
                    {
                        docxLinkHex = docxAccentHex;
                    }
                    if (root.TryGetProperty("headingStyle", out var hsElem))
                    {
                        docxHeadingStyle = hsElem.GetString()?.ToLowerInvariant() ?? "underline";
                    }
                }
                catch { }
            }

            using var memStream = new MemoryStream();
            using (var wordDoc = WordprocessingDocument.Create(memStream, WordprocessingDocumentType.Document, true))
            {
                var mainPart = wordDoc.AddMainDocumentPart();
                mainPart.Document = new WDocument();
                var body = mainPart.Document.AppendChild(new Body());

                // Title / Full Name
                var nameP = body.AppendChild(new Paragraph());
                var nameR = nameP.AppendChild(new Run());
                nameR.AppendChild(new Text(resume.FullName));
                nameR.RunProperties = new RunProperties(new Bold(), new FontSize { Val = "36" });

                // Target Role
                if (!string.IsNullOrWhiteSpace(resume.TargetRole))
                {
                    var roleP = body.AppendChild(new Paragraph());
                    var roleR = roleP.AppendChild(new Run());
                    roleR.AppendChild(new Text(resume.TargetRole));
                    roleR.RunProperties = new RunProperties(new FontSize { Val = "24" }, new WColor { Val = "555555" });
                }

                // Contact Details with hyperlinks and custom display text
                var docxLinkedinText = !string.IsNullOrWhiteSpace(resume.LinkedInText)
                    ? resume.LinkedInText
                    : (!string.IsNullOrWhiteSpace(resume.LinkedInUrl) ? "LinkedIn" : "");

                var docxGithubText = !string.IsNullOrWhiteSpace(resume.GitHubText)
                    ? resume.GitHubText
                    : (!string.IsNullOrWhiteSpace(resume.GitHubUrl) ? "GitHub" : "");

                var docxPortfolioText = !string.IsNullOrWhiteSpace(resume.PortfolioText)
                    ? resume.PortfolioText
                    : (!string.IsNullOrWhiteSpace(resume.PortfolioUrl) ? "Portfolio" : "");

                var docxContacts = new (string Display, string? Url)[]
                {
                    (resume.Email, !string.IsNullOrWhiteSpace(resume.Email) ? $"mailto:{resume.Email.Trim()}" : null),
                    (resume.Phone, !string.IsNullOrWhiteSpace(resume.Phone) ? $"tel:{resume.Phone.Trim().Replace(" ", "")}" : null),
                    (resume.Location, null),
                    (docxLinkedinText, EnsureAbsoluteUrl(resume.LinkedInUrl)),
                    (docxGithubText, EnsureAbsoluteUrl(resume.GitHubUrl)),
                    (docxPortfolioText, EnsureAbsoluteUrl(resume.PortfolioUrl))
                }.Where(s => !string.IsNullOrWhiteSpace(s.Display)).ToList();

                if (docxContacts.Any())
                {
                    var cp = body.AppendChild(new Paragraph());
                    for (int i = 0; i < docxContacts.Count; i++)
                    {
                        var item = docxContacts[i];
                        if (!string.IsNullOrWhiteSpace(item.Url))
                        {
                            AddDocxHyperlink(mainPart, cp, item.Display, item.Url, docxLinkHex, true);
                        }
                        else
                        {
                            var cr = cp.AppendChild(new Run());
                            cr.AppendChild(new Text(item.Display));
                            cr.RunProperties = new RunProperties(new FontSize { Val = "20" }, new WColor { Val = "666666" });
                        }

                        if (i < docxContacts.Count - 1)
                        {
                            var dotRun = cp.AppendChild(new Run());
                            dotRun.AppendChild(new Text(" | "));
                            dotRun.RunProperties = new RunProperties(new FontSize { Val = "20" }, new WColor { Val = "999999" });
                        }
                    }
                }

                // Professional Summary
                if (!string.IsNullOrWhiteSpace(resume.ProfessionalSummary))
                {
                    AddDocxSectionHeader(body, "PROFESSIONAL SUMMARY", docxAccentHex, docxHeadingStyle);
                    var sp = body.AppendChild(new Paragraph());
                    var sr = sp.AppendChild(new Run());
                    sr.AppendChild(new Text(resume.ProfessionalSummary));
                }

                // Experience
                if (resume.Experiences != null && resume.Experiences.Any())
                {
                    AddDocxSectionHeader(body, "PROFESSIONAL EXPERIENCE", docxAccentHex, docxHeadingStyle);
                    foreach (var exp in resume.Experiences)
                    {
                        var ep = body.AppendChild(new Paragraph());
                        var er1 = ep.AppendChild(new Run());
                        er1.AppendChild(new Text($"{exp.Role} - {exp.Company}"));
                        er1.RunProperties = new RunProperties(new Bold());

                        var er2 = ep.AppendChild(new Run());
                        er2.AppendChild(new Text($" ({exp.StartDate} - {(exp.IsCurrent ? "Present" : exp.EndDate)})"));
                        er2.RunProperties = new RunProperties(new WColor { Val = "666666" });

                        if (exp.Bullets != null)
                        {
                            foreach (var b in exp.Bullets.Where(x => !string.IsNullOrWhiteSpace(x)))
                            {
                                var bp = body.AppendChild(new Paragraph());
                                var br = bp.AppendChild(new Run());
                                br.AppendChild(new Text($"• {b}"));
                            }
                        }
                    }
                }

                // Projects
                if (resume.Projects != null && resume.Projects.Any())
                {
                    AddDocxSectionHeader(body, "PROJECTS", docxAccentHex, docxHeadingStyle);
                    foreach (var proj in resume.Projects)
                    {
                        var pp = body.AppendChild(new Paragraph());
                        if (!string.IsNullOrWhiteSpace(proj.Link))
                        {
                            AddDocxHyperlink(mainPart, pp, proj.Title, EnsureAbsoluteUrl(proj.Link), docxLinkHex, true);
                        }
                        else
                        {
                            var pr1 = pp.AppendChild(new Run());
                            pr1.AppendChild(new Text(proj.Title));
                            pr1.RunProperties = new RunProperties(new Bold());
                        }

                        if (!string.IsNullOrWhiteSpace(proj.TechStack))
                        {
                            var pr2 = pp.AppendChild(new Run());
                            pr2.AppendChild(new Text($" ({proj.TechStack})"));
                            pr2.RunProperties = new RunProperties(new Italic(), new WColor { Val = "666666" });
                        }

                        if (proj.Bullets != null)
                        {
                            foreach (var b in proj.Bullets.Where(x => !string.IsNullOrWhiteSpace(x)))
                            {
                                var bp = body.AppendChild(new Paragraph());
                                var br = bp.AppendChild(new Run());
                                br.AppendChild(new Text($"• {b}"));
                            }
                        }
                    }
                }

                // Skills
                if (resume.SkillCategories != null && resume.SkillCategories.Any())
                {
                    AddDocxSectionHeader(body, "TECHNICAL SKILLS", docxAccentHex, docxHeadingStyle);
                    foreach (var cat in resume.SkillCategories)
                    {
                        if (cat.Skills != null && cat.Skills.Any())
                        {
                            var skp = body.AppendChild(new Paragraph());
                            var skr1 = skp.AppendChild(new Run());
                            skr1.AppendChild(new Text($"{cat.Category}: "));
                            skr1.RunProperties = new RunProperties(new Bold());

                            var skr2 = skp.AppendChild(new Run());
                            skr2.AppendChild(new Text(string.Join(", ", cat.Skills)));
                        }
                    }
                }

                // Education
                if (resume.Educations != null && resume.Educations.Any())
                {
                    AddDocxSectionHeader(body, "EDUCATION", docxAccentHex, docxHeadingStyle);
                    foreach (var edu in resume.Educations)
                    {
                        if (edu.IsSchooling)
                        {
                            var edp = body.AppendChild(new Paragraph());
                            var edr1 = edp.AppendChild(new Run());
                            var title = string.IsNullOrWhiteSpace(edu.Degree) ? "Secondary & Higher Secondary Education" : edu.Degree;
                            edr1.AppendChild(new Text($"{title} - {edu.Institution}"));
                            edr1.RunProperties = new RunProperties(new Bold());

                            var years = !string.IsNullOrWhiteSpace(edu.Grade10Year) && !string.IsNullOrWhiteSpace(edu.Grade12Year)
                                ? $"{edu.Grade10Year} – {edu.Grade12Year}"
                                : (!string.IsNullOrWhiteSpace(edu.GraduationDate) ? edu.GraduationDate : edu.Grade12Year);
                            if (!string.IsNullOrWhiteSpace(years))
                            {
                                var edr2 = edp.AppendChild(new Run());
                                edr2.AppendChild(new Text($" ({years})"));
                                edr2.RunProperties = new RunProperties(new WColor { Val = "666666" });
                            }

                            if (!string.IsNullOrWhiteSpace(edu.Grade12Score) || !string.IsNullOrWhiteSpace(edu.Grade12Stream))
                            {
                                var g12p = body.AppendChild(new Paragraph());
                                var g12r = g12p.AppendChild(new Run());
                                var sTitle = string.IsNullOrWhiteSpace(edu.Grade12Stream) ? "Class XII" : edu.Grade12Stream;
                                var s12 = $"• {sTitle}: {edu.Grade12Score}";
                                if (!string.IsNullOrWhiteSpace(edu.Grade12Year)) s12 += $" ({edu.Grade12Year})";
                                g12r.AppendChild(new Text(s12));
                            }

                            if (!string.IsNullOrWhiteSpace(edu.Grade10Score) || !string.IsNullOrWhiteSpace(edu.Grade10Board))
                            {
                                var g10p = body.AppendChild(new Paragraph());
                                var g10r = g10p.AppendChild(new Run());
                                var sTitle = string.IsNullOrWhiteSpace(edu.Grade10Board) ? "Class X" : edu.Grade10Board;
                                var s10 = $"• {sTitle}: {edu.Grade10Score}";
                                if (!string.IsNullOrWhiteSpace(edu.Grade10Year)) s10 += $" ({edu.Grade10Year})";
                                if (!string.IsNullOrWhiteSpace(edu.Grade10School)) s10 += $" at {edu.Grade10School}";
                                g10r.AppendChild(new Text(s10));
                            }
                        }
                        else
                        {
                            var edp = body.AppendChild(new Paragraph());
                            var edr1 = edp.AppendChild(new Run());
                            var degTitle = !string.IsNullOrWhiteSpace(edu.Degree) && !string.IsNullOrWhiteSpace(edu.FieldOfStudy)
                                ? $"{edu.Degree} in {edu.FieldOfStudy}"
                                : (!string.IsNullOrWhiteSpace(edu.Degree) ? edu.Degree : edu.Institution);
                            var instText = !string.IsNullOrWhiteSpace(edu.Institution) && degTitle != edu.Institution
                                ? $" - {edu.Institution}"
                                : "";
                            edr1.AppendChild(new Text($"{degTitle}{instText}"));
                            edr1.RunProperties = new RunProperties(new Bold());

                            if (!string.IsNullOrWhiteSpace(edu.Gpa))
                            {
                                var scorePfx = edu.Gpa.Contains("%") || edu.Gpa.ToLower().Contains("gpa") || edu.Gpa.ToLower().Contains("cgpa") ? "" : "GPA: ";
                                var edrScore = edp.AppendChild(new Run());
                                edrScore.AppendChild(new Text($" ({scorePfx}{edu.Gpa})"));
                                edrScore.RunProperties = new RunProperties(new WColor { Val = "666666" });
                            }

                            var edr2 = edp.AppendChild(new Run());
                            var locDate = !string.IsNullOrWhiteSpace(edu.Location)
                                ? $" ({edu.Location}, {edu.GraduationDate})"
                                : $" ({edu.GraduationDate})";
                            edr2.AppendChild(new Text(locDate));
                            edr2.RunProperties = new RunProperties(new WColor { Val = "666666" });
                        }
                    }
                }

                // Certifications
                if (resume.Certifications != null && resume.Certifications.Any())
                {
                    AddDocxSectionHeader(body, "CERTIFICATIONS", docxAccentHex, docxHeadingStyle);
                    foreach (var cert in resume.Certifications)
                    {
                        var cp = body.AppendChild(new Paragraph());
                        if (!string.IsNullOrWhiteSpace(cert.CredentialUrl))
                        {
                            AddDocxHyperlink(mainPart, cp, cert.Name, EnsureAbsoluteUrl(cert.CredentialUrl), docxLinkHex, true);
                        }
                        else
                        {
                            var cr1 = cp.AppendChild(new Run());
                            cr1.AppendChild(new Text(cert.Name));
                            cr1.RunProperties = new RunProperties(new Bold());
                        }
                        if (!string.IsNullOrWhiteSpace(cert.Issuer))
                        {
                            var cr2 = cp.AppendChild(new Run());
                            cr2.AppendChild(new Text($" - {cert.Issuer}"));
                        }
                        if (!string.IsNullOrWhiteSpace(cert.IssueDate))
                        {
                            var cr3 = cp.AppendChild(new Run());
                            cr3.AppendChild(new Text($" ({cert.IssueDate})"));
                            cr3.RunProperties = new RunProperties(new WColor { Val = "666666" });
                        }
                    }
                }

                // Others (Awards, Extracurriculars, Leadership, Publications, etc.)
                if (resume.Others != null && resume.Others.Any())
                {
                    var groupedOthers = resume.Others
                        .Where(o => !string.IsNullOrWhiteSpace(o.Title) || !string.IsNullOrWhiteSpace(o.Organization) || !string.IsNullOrWhiteSpace(o.Description))
                        .GroupBy(o => string.IsNullOrWhiteSpace(o.Category) ? "AWARDS & HONORS" : o.Category.Trim().ToUpperInvariant());

                    foreach (var group in groupedOthers)
                    {
                        AddDocxSectionHeader(body, group.Key, docxAccentHex, docxHeadingStyle);
                        foreach (var item in group)
                        {
                            var op = body.AppendChild(new Paragraph());
                            var or1 = op.AppendChild(new Run());
                            or1.AppendChild(new Text(item.Title));
                            or1.RunProperties = new RunProperties(new Bold());
                            if (!string.IsNullOrWhiteSpace(item.Organization))
                            {
                                var or2 = op.AppendChild(new Run());
                                or2.AppendChild(new Text($" | {item.Organization}"));
                            }
                            if (!string.IsNullOrWhiteSpace(item.Date))
                            {
                                var or3 = op.AppendChild(new Run());
                                or3.AppendChild(new Text($" ({item.Date})"));
                                or3.RunProperties = new RunProperties(new WColor { Val = "666666" });
                            }
                            if (!string.IsNullOrWhiteSpace(item.Description))
                            {
                                var odp = body.AppendChild(new Paragraph());
                                var odr = odp.AppendChild(new Run());
                                odr.AppendChild(new Text(item.Description));
                                odr.RunProperties = new RunProperties(new FontSize { Val = "18" });
                            }
                        }
                    }
                }

                mainPart.Document.Save();
            }

            return memStream.ToArray();
        }

        private static void AddDocxSectionHeader(Body body, string title, string accentHex = "1E293B", string headingStyle = "underline")
        {
            var p = body.AppendChild(new Paragraph());
            var r = p.AppendChild(new Run());
            r.AppendChild(new Text(title));
            var colorHex = (headingStyle == "bar" || headingStyle == "pill") ? accentHex : "1E293B";
            r.RunProperties = new RunProperties(new Bold(), new FontSize { Val = "24" }, new WColor { Val = colorHex });
        }

        private static string EnsureAbsoluteUrl(string url, string defaultScheme = "https")
        {
            if (string.IsNullOrWhiteSpace(url)) return "";
            var trimmed = url.Trim();
            if (trimmed.StartsWith("http://", StringComparison.OrdinalIgnoreCase) ||
                trimmed.StartsWith("https://", StringComparison.OrdinalIgnoreCase) ||
                trimmed.StartsWith("mailto:", StringComparison.OrdinalIgnoreCase) ||
                trimmed.StartsWith("tel:", StringComparison.OrdinalIgnoreCase))
            {
                return trimmed;
            }
            if (trimmed.Contains("@") && !trimmed.Contains("/"))
            {
                return "mailto:" + trimmed;
            }
            return $"{defaultScheme}://{trimmed}";
        }

        private static void AddDocxHyperlink(MainDocumentPart mainPart, Paragraph paragraph, string displayText, string url, string colorHex = "333333", bool underline = false)
        {
            if (string.IsNullOrWhiteSpace(url))
            {
                var run = paragraph.AppendChild(new Run());
                run.AppendChild(new Text(displayText));
                run.RunProperties = new RunProperties(new WColor { Val = colorHex });
                return;
            }

            try
            {
                var rel = mainPart.AddHyperlinkRelationship(new Uri(url, UriKind.Absolute), true);
                var hyper = paragraph.AppendChild(new DocumentFormat.OpenXml.Wordprocessing.Hyperlink { Id = rel.Id });
                var run = hyper.AppendChild(new Run());
                run.AppendChild(new Text(displayText));
                var runProps = new RunProperties(new WColor { Val = colorHex });
                if (underline)
                {
                    runProps.AppendChild(new Underline { Val = UnderlineValues.Single });
                }
                run.RunProperties = runProps;
            }
            catch
            {
                var run = paragraph.AppendChild(new Run());
                run.AppendChild(new Text(displayText));
                run.RunProperties = new RunProperties(new WColor { Val = colorHex });
            }
        }
    }
}
