using System;
using System.IO;
using System.Linq;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using ResumeAI.Server.Models;
using QDocument = QuestPDF.Fluent.Document;

namespace ResumeAI.Server.Services
{
    public interface IPdfExportService
    {
        byte[] GeneratePdf(Resume resume);
    }

    public class PdfExportService : IPdfExportService
    {
        public PdfExportService()
        {
            // Set QuestPDF license to Community and configure font discovery
            QuestPDF.Settings.License = LicenseType.Community;
            QuestPDF.Settings.ThrowOnMissingFontFamilies = false;
            QuestPDF.Settings.UseSystemFonts = true;
        }

        public byte[] GeneratePdf(Resume resume)
        {
            string fontFamily = "Arial";
            float margin = 36f;
            float baseFontSize = 10f;
            float nameFontSize = 22f;
            float headingFontSize = 11f;
            float lineThickness = 1f;
            string headerAlignment = "center";
            bool headerDivider = true;
            bool sectionDividers = true;
            string dividerStyle = "solid";
            string headingStyle = "underline";
            string bulletStyle = "disc";
            string accentColorHex = "#5CB338";
            string dividerColorHex = "#cbd5e1";
            string linkColorHex = "#2563eb";

            if (!string.IsNullOrWhiteSpace(resume.FormattingJson))
            {
                try
                {
                    using var doc = System.Text.Json.JsonDocument.Parse(resume.FormattingJson);
                    var root = doc.RootElement;
                    if (root.TryGetProperty("fontFamily", out var fElem))
                    {
                        var fVal = fElem.GetString()?.ToLowerInvariant();
                        if (fVal == "times" || fVal == "serif" || fVal == "merriweather" || fVal == "playfair" || fVal == "georgia" || fVal == "cambria" || fVal == "garamond")
                            fontFamily = "Times New Roman";
                        else if (fVal == "mono" || fVal == "jetbrains" || fVal == "courier" || fVal == "sourcecode")
                            fontFamily = "Courier";
                        else
                            fontFamily = "Arial";
                    }
                    if (root.TryGetProperty("pageMargin", out var mElem))
                    {
                        var mVal = mElem.GetString()?.ToLowerInvariant();
                        if (mVal == "compact") margin = 22f;
                        else if (mVal == "relaxed") margin = 48f;
                        else if (mVal == "spacious") margin = 56f;
                        else margin = 36f;
                    }
                    if (root.TryGetProperty("fontSize", out var sElem))
                    {
                        var sVal = sElem.GetString()?.ToLowerInvariant();
                        if (sVal == "compact-2xs") baseFontSize = 7.5f;
                        else if (sVal == "compact-xs") baseFontSize = 8f;
                        else if (sVal == "compact-sm") baseFontSize = 8.5f;
                        else if (sVal == "compact-md") baseFontSize = 8.75f;
                        else if (sVal == "compact") baseFontSize = 9f;
                        else if (sVal == "normal-sm") baseFontSize = 9.5f;
                        else if (sVal == "normal") baseFontSize = 10f;
                        else if (sVal == "medium-sm") baseFontSize = 10.5f;
                        else if (sVal == "medium") baseFontSize = 11f;
                        else if (sVal == "medium-lg") baseFontSize = 11.25f;
                        else if (sVal == "large-sm") baseFontSize = 11.5f;
                        else if (sVal == "large") baseFontSize = 12f;
                        else if (sVal == "large-xl") baseFontSize = 12.5f;
                        else baseFontSize = 10f;
                    }
                    if (root.TryGetProperty("nameSize", out var nElem))
                    {
                        var nVal = nElem.GetString()?.ToLowerInvariant();
                        if (nVal == "compact-sm") nameFontSize = 16f;
                        else if (nVal == "compact") nameFontSize = 18f;
                        else if (nVal == "normal-sm") nameFontSize = 19f;
                        else if (nVal == "normal") nameFontSize = 20f;
                        else if (nVal == "large-sm") nameFontSize = 21f;
                        else if (nVal == "large") nameFontSize = 22f;
                        else if (nVal == "xl-sm") nameFontSize = 25f;
                        else if (nVal == "xl") nameFontSize = 28f;
                        else if (nVal == "2xl") nameFontSize = 32f;
                        else if (nVal == "3xl") nameFontSize = 36f;
                    }
                    if (root.TryGetProperty("headingSize", out var hElem))
                    {
                        var hVal = hElem.GetString()?.ToLowerInvariant();
                        if (hVal == "compact-xs") headingFontSize = 9f;
                        else if (hVal == "compact-sm") headingFontSize = 9.5f;
                        else if (hVal == "compact" || hVal == "compact-md") headingFontSize = 10f;
                        else if (hVal == "normal-sm") headingFontSize = 10.5f;
                        else if (hVal == "normal") headingFontSize = 11f;
                        else if (hVal == "medium-sm") headingFontSize = 11.5f;
                        else if (hVal == "medium") headingFontSize = 12f;
                        else if (hVal == "large-sm") headingFontSize = 12.5f;
                        else if (hVal == "large") headingFontSize = 13f;
                        else if (hVal == "xl-sm") headingFontSize = 13.5f;
                        else if (hVal == "xl") headingFontSize = 14f;
                    }
                    if (root.TryGetProperty("dividerThickness", out var tElem))
                    {
                        var tVal = tElem.GetString();
                        if (tVal == "2px") lineThickness = 1.5f;
                        else if (tVal == "3px") lineThickness = 2.5f;
                        else if (tVal == "4px") lineThickness = 3.5f;
                        else lineThickness = 1f;
                    }
                    if (root.TryGetProperty("headerAlignment", out var haElem))
                    {
                        var haVal = haElem.GetString()?.ToLowerInvariant();
                        if (haVal == "left" || haVal == "split") headerAlignment = haVal;
                        else headerAlignment = "center";
                    }
                    if (root.TryGetProperty("headerDivider", out var hdElem))
                    {
                        headerDivider = hdElem.GetBoolean();
                    }
                    if (root.TryGetProperty("sectionDividers", out var sdElem))
                    {
                        sectionDividers = sdElem.GetBoolean();
                    }
                    if (root.TryGetProperty("dividerStyle", out var dsElem))
                    {
                        dividerStyle = dsElem.GetString()?.ToLowerInvariant() ?? "solid";
                    }
                    if (root.TryGetProperty("headingStyle", out var hsElem))
                    {
                        headingStyle = hsElem.GetString()?.ToLowerInvariant() ?? "underline";
                    }
                    if (root.TryGetProperty("bulletStyle", out var bsElem))
                    {
                        bulletStyle = bsElem.GetString()?.ToLowerInvariant() ?? "disc";
                    }
                    if (root.TryGetProperty("accentColor", out var acElem))
                    {
                        accentColorHex = acElem.GetString() ?? "#5CB338";
                    }
                    if (root.TryGetProperty("dividerColor", out var dcElem))
                    {
                        dividerColorHex = dcElem.GetString() ?? "#cbd5e1";
                    }
                    if (root.TryGetProperty("linkColor", out var lcElem))
                    {
                        var lc = lcElem.GetString();
                        if (!string.IsNullOrWhiteSpace(lc) && lc != "match-accent")
                            linkColorHex = lc;
                        else
                            linkColorHex = accentColorHex;
                    }
                    else
                    {
                        linkColorHex = accentColorHex;
                    }
                }
                catch { }
            }

            var dividerColor = SafeHexColor(dividerColorHex, Colors.Grey.Lighten1);
            var accentColor = SafeHexColor(accentColorHex, Colors.Grey.Darken4);
            var linkColor = Colors.Grey.Darken4;
            string bulletChar = bulletStyle switch
            {
                "arrow" => "▸",
                "dash" => "–",
                "square" => "▪",
                "dot" => "·",
                _ => "•"
            };

            var document = QDocument.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(margin);
                    page.PageColor(Colors.White);
                    page.DefaultTextStyle(x => x.FontFamily(fontFamily).FontSize(baseFontSize).FontColor(Colors.Grey.Darken4));

                    page.Content().Column(col =>
                    {
                        // Header / Contact info
                        if (headerAlignment == "left" || headerAlignment == "split")
                        {
                            col.Item().AlignLeft().Text(resume.FullName)
                                .FontSize(nameFontSize).Bold().FontColor(Colors.Grey.Darken4);

                            if (!string.IsNullOrWhiteSpace(resume.TargetRole))
                            {
                                col.Item().PaddingTop(2).AlignLeft().Text(resume.TargetRole)
                                    .FontSize(11).SemiBold().FontColor(Colors.Grey.Darken2);
                            }
                        }
                        else
                        {
                            col.Item().AlignCenter().Text(resume.FullName)
                                .FontSize(nameFontSize).Bold().FontColor(Colors.Grey.Darken4);

                            if (!string.IsNullOrWhiteSpace(resume.TargetRole))
                            {
                                col.Item().PaddingTop(2).AlignCenter().Text(resume.TargetRole)
                                    .FontSize(11).SemiBold().FontColor(Colors.Grey.Darken2);
                            }
                        }

                        // Contact links with embedded hyperlinks and custom display text
                        var linkedinText = !string.IsNullOrWhiteSpace(resume.LinkedInText)
                            ? resume.LinkedInText
                            : (!string.IsNullOrWhiteSpace(resume.LinkedInUrl) ? "LinkedIn" : "");

                        var githubText = !string.IsNullOrWhiteSpace(resume.GitHubText)
                            ? resume.GitHubText
                            : (!string.IsNullOrWhiteSpace(resume.GitHubUrl) ? "GitHub" : "");

                        var portfolioText = !string.IsNullOrWhiteSpace(resume.PortfolioText)
                            ? resume.PortfolioText
                            : (!string.IsNullOrWhiteSpace(resume.PortfolioUrl) ? "Portfolio" : "");

                        var contactItems = new (string Display, string? Url)[]
                        {
                            (resume.Email, !string.IsNullOrWhiteSpace(resume.Email) ? $"mailto:{resume.Email.Trim()}" : null),
                            (resume.Phone, !string.IsNullOrWhiteSpace(resume.Phone) ? $"tel:{resume.Phone.Trim().Replace(" ", "")}" : null),
                            (resume.Location, null),
                            (linkedinText, EnsureAbsoluteUrl(resume.LinkedInUrl)),
                            (githubText, EnsureAbsoluteUrl(resume.GitHubUrl)),
                            (portfolioText, EnsureAbsoluteUrl(resume.PortfolioUrl))
                        }.Where(s => !string.IsNullOrWhiteSpace(s.Display)).ToList();

                        if (contactItems.Any())
                        {
                            var contactItem = col.Item().PaddingTop(4).PaddingBottom(10);
                            var alignItem = (headerAlignment == "left" || headerAlignment == "split")
                                ? contactItem.AlignLeft()
                                : contactItem.AlignCenter();

                            alignItem.Text(text =>
                            {
                                for (int i = 0; i < contactItems.Count; i++)
                                {
                                    var item = contactItems[i];
                                    if (!string.IsNullOrWhiteSpace(item.Url))
                                    {
                                        text.Hyperlink(item.Display, item.Url).FontSize(9).FontColor(linkColor);
                                    }
                                    else
                                    {
                                        text.Span(item.Display).FontSize(9).FontColor(Colors.Grey.Darken3);
                                    }

                                    if (i < contactItems.Count - 1)
                                    {
                                        text.Span("  •  ").FontSize(9).FontColor(Colors.Grey.Medium);
                                    }
                                }
                            });
                        }

                        // Header Divider
                        if (headerDivider && dividerStyle != "none")
                        {
                            col.Item().LineHorizontal(lineThickness).LineColor(dividerColor);
                        }

                        // Professional Summary
                        if (!string.IsNullOrWhiteSpace(resume.ProfessionalSummary))
                        {
                            AddPdfSectionHeader(col, "PROFESSIONAL SUMMARY", headingFontSize, headingStyle, sectionDividers, dividerStyle, lineThickness, dividerColor, accentColor);
                            col.Item().PaddingTop(4).Text(text => AppendFormattedText(text, resume.ProfessionalSummary, 1.3f));
                        }

                        // Experience
                        if (resume.Experiences != null && resume.Experiences.Any())
                        {
                            AddPdfSectionHeader(col, "PROFESSIONAL EXPERIENCE", headingFontSize, headingStyle, sectionDividers, dividerStyle, lineThickness, dividerColor, accentColor);

                            foreach (var exp in resume.Experiences)
                            {
                                col.Item().PaddingTop(6).Row(row =>
                                {
                                    row.RelativeItem().Text(text =>
                                    {
                                        text.Span(exp.Role).Bold();
                                        if (!string.IsNullOrWhiteSpace(exp.Company))
                                        {
                                            text.Span(" | " + exp.Company).SemiBold();
                                        }
                                    });

                                    var dateStr = $"{exp.StartDate} - {(exp.IsCurrent ? "Present" : exp.EndDate)}";
                                    if (!string.IsNullOrWhiteSpace(exp.Location))
                                    {
                                        dateStr = $"{dateStr} ({exp.Location})";
                                    }
                                    row.AutoItem().Text(dateStr).FontSize(9).FontColor(Colors.Grey.Darken1);
                                });

                                if (exp.Bullets != null && exp.Bullets.Any())
                                {
                                    foreach (var bullet in exp.Bullets.Where(b => !string.IsNullOrWhiteSpace(b)))
                                    {
                                        col.Item().PaddingLeft(8).PaddingTop(2).Row(bRow =>
                                        {
                                            bRow.ConstantItem(12).Text(bulletChar).Bold();
                                            bRow.RelativeItem().Text(text => AppendFormattedText(text, bullet, 1.25f));
                                        });
                                    }
                                }
                            }
                        }

                        // Projects
                        if (resume.Projects != null && resume.Projects.Any())
                        {
                            AddPdfSectionHeader(col, "PROJECTS", headingFontSize, headingStyle, sectionDividers, dividerStyle, lineThickness, dividerColor, accentColor);

                            foreach (var proj in resume.Projects)
                            {
                                col.Item().PaddingTop(6).Row(row =>
                                {
                                    row.RelativeItem().Text(text =>
                                    {
                                        if (!string.IsNullOrWhiteSpace(proj.Link))
                                        {
                                            text.Hyperlink(proj.Title, EnsureAbsoluteUrl(proj.Link)).Bold().Underline().FontColor(linkColor);
                                        }
                                        else
                                        {
                                            text.Span(proj.Title).Bold();
                                        }

                                        if (!string.IsNullOrWhiteSpace(proj.TechStack))
                                        {
                                            text.Span($" ({proj.TechStack})").Italic().FontSize(9);
                                        }
                                    });
                                });

                                if (proj.Bullets != null && proj.Bullets.Any())
                                {
                                    foreach (var bullet in proj.Bullets.Where(b => !string.IsNullOrWhiteSpace(b)))
                                    {
                                        col.Item().PaddingLeft(8).PaddingTop(2).Row(bRow =>
                                        {
                                            bRow.ConstantItem(12).Text(bulletChar).Bold();
                                            bRow.RelativeItem().Text(text => AppendFormattedText(text, bullet, 1.25f));
                                        });
                                    }
                                }
                            }
                        }

                        // Skills
                        if (resume.SkillCategories != null && resume.SkillCategories.Any())
                        {
                            AddPdfSectionHeader(col, "TECHNICAL & PROFESSIONAL SKILLS", headingFontSize, headingStyle, sectionDividers, dividerStyle, lineThickness, dividerColor, accentColor);

                            foreach (var skillCat in resume.SkillCategories)
                            {
                                if (skillCat.Skills != null && skillCat.Skills.Any())
                                {
                                    col.Item().PaddingTop(4).Text(text =>
                                    {
                                        text.Span($"{skillCat.Category}: ").Bold();
                                        text.Span(string.Join(", ", skillCat.Skills));
                                    });
                                }
                            }
                        }

                        // Education
                        if (resume.Educations != null && resume.Educations.Any())
                        {
                            AddPdfSectionHeader(col, "EDUCATION", headingFontSize, headingStyle, sectionDividers, dividerStyle, lineThickness, dividerColor, accentColor);

                            foreach (var edu in resume.Educations)
                            {
                                if (edu.IsSchooling)
                                {
                                    col.Item().PaddingTop(6).Row(row =>
                                    {
                                        row.RelativeItem().Text(text =>
                                        {
                                            var title = string.IsNullOrWhiteSpace(edu.Degree) ? "Secondary & Higher Secondary Education" : edu.Degree;
                                            text.Span(title).Bold();
                                            if (!string.IsNullOrWhiteSpace(edu.Institution))
                                            {
                                                text.Span(" | " + edu.Institution);
                                            }
                                        });

                                        var years = !string.IsNullOrWhiteSpace(edu.Grade10Year) && !string.IsNullOrWhiteSpace(edu.Grade12Year)
                                            ? $"{edu.Grade10Year} – {edu.Grade12Year}"
                                            : (!string.IsNullOrWhiteSpace(edu.GraduationDate) ? edu.GraduationDate : edu.Grade12Year);
                                        if (!string.IsNullOrWhiteSpace(years))
                                        {
                                            row.AutoItem().Text(years).FontSize(9).FontColor(Colors.Grey.Darken1);
                                        }
                                    });

                                    if (!string.IsNullOrWhiteSpace(edu.Grade12Score) || !string.IsNullOrWhiteSpace(edu.Grade12Stream))
                                    {
                                        col.Item().PaddingLeft(8).PaddingTop(2).Row(bRow =>
                                        {
                                            bRow.ConstantItem(12).Text(bulletChar).Bold();
                                            bRow.RelativeItem().Text(text =>
                                            {
                                                var sTitle = string.IsNullOrWhiteSpace(edu.Grade12Stream) ? "Class XII" : edu.Grade12Stream;
                                                text.Span(sTitle + ": ").Bold();
                                                if (!string.IsNullOrWhiteSpace(edu.Grade12Score)) text.Span(edu.Grade12Score).Bold();
                                                if (!string.IsNullOrWhiteSpace(edu.Grade12Year)) text.Span($" ({edu.Grade12Year})").FontColor(Colors.Grey.Darken1);
                                            });
                                        });
                                    }

                                    if (!string.IsNullOrWhiteSpace(edu.Grade10Score) || !string.IsNullOrWhiteSpace(edu.Grade10Board))
                                    {
                                        col.Item().PaddingLeft(8).PaddingTop(2).Row(bRow =>
                                        {
                                            bRow.ConstantItem(12).Text(bulletChar).Bold();
                                            bRow.RelativeItem().Text(text =>
                                            {
                                                var sTitle = string.IsNullOrWhiteSpace(edu.Grade10Board) ? "Class X" : edu.Grade10Board;
                                                text.Span(sTitle + ": ").Bold();
                                                if (!string.IsNullOrWhiteSpace(edu.Grade10Score)) text.Span(edu.Grade10Score).Bold();
                                                if (!string.IsNullOrWhiteSpace(edu.Grade10Year)) text.Span($" ({edu.Grade10Year})").FontColor(Colors.Grey.Darken1);
                                                if (!string.IsNullOrWhiteSpace(edu.Grade10School)) text.Span($" at {edu.Grade10School}").Italic().FontColor(Colors.Grey.Darken1);
                                            });
                                        });
                                    }
                                }
                                else
                                {
                                    col.Item().PaddingTop(6).Row(row =>
                                    {
                                        row.RelativeItem().Text(text =>
                                        {
                                            var degreeLine = !string.IsNullOrWhiteSpace(edu.Degree) && !string.IsNullOrWhiteSpace(edu.FieldOfStudy)
                                                ? $"{edu.Degree} in {edu.FieldOfStudy}".Trim()
                                                : (!string.IsNullOrWhiteSpace(edu.Degree) ? edu.Degree : edu.Institution);
                                            text.Span(string.IsNullOrWhiteSpace(degreeLine) ? edu.Institution : degreeLine).Bold();
                                            if (!string.IsNullOrWhiteSpace(edu.Institution) && !string.IsNullOrWhiteSpace(degreeLine) && degreeLine != edu.Institution)
                                            {
                                                text.Span(" | " + edu.Institution);
                                            }
                                            if (!string.IsNullOrWhiteSpace(edu.Gpa))
                                            {
                                                var scorePrefix = edu.Gpa.Contains("%") || edu.Gpa.ToLower().Contains("gpa") || edu.Gpa.ToLower().Contains("cgpa") ? "" : "GPA: ";
                                                text.Span($" ({scorePrefix}{edu.Gpa})").FontSize(9).FontColor(Colors.Grey.Darken1);
                                            }
                                        });

                                        var dateStr = edu.GraduationDate;
                                        if (!string.IsNullOrWhiteSpace(edu.Location))
                                        {
                                            dateStr += $" ({edu.Location})";
                                        }
                                        row.AutoItem().Text(dateStr).FontSize(9).FontColor(Colors.Grey.Darken1);
                                    });
                                }
                            }
                        }

                        // Certifications
                        if (resume.Certifications != null && resume.Certifications.Any())
                        {
                            AddPdfSectionHeader(col, "CERTIFICATIONS", headingFontSize, headingStyle, sectionDividers, dividerStyle, lineThickness, dividerColor, accentColor);

                            foreach (var cert in resume.Certifications)
                            {
                                col.Item().PaddingTop(4).Row(row =>
                                {
                                    row.RelativeItem().Text(text =>
                                    {
                                        if (!string.IsNullOrWhiteSpace(cert.CredentialUrl))
                                        {
                                            text.Hyperlink(cert.Name, EnsureAbsoluteUrl(cert.CredentialUrl)).Bold().Underline().FontColor(linkColor);
                                        }
                                        else
                                        {
                                            text.Span(cert.Name).Bold();
                                        }
                                        if (!string.IsNullOrWhiteSpace(cert.Issuer))
                                        {
                                            text.Span(" - " + cert.Issuer);
                                        }
                                    });

                                    if (!string.IsNullOrWhiteSpace(cert.IssueDate))
                                    {
                                        row.AutoItem().Text(cert.IssueDate).FontSize(9).FontColor(Colors.Grey.Darken1);
                                    }
                                });
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
                                AddPdfSectionHeader(col, group.Key, headingFontSize, headingStyle, sectionDividers, dividerStyle, lineThickness, dividerColor, accentColor);

                                foreach (var item in group)
                                {
                                    col.Item().PaddingTop(4).Row(row =>
                                    {
                                        row.RelativeItem().Text(text =>
                                        {
                                            text.Span(item.Title).Bold();
                                            if (!string.IsNullOrWhiteSpace(item.Organization))
                                            {
                                                text.Span(" | " + item.Organization);
                                            }
                                        });

                                        if (!string.IsNullOrWhiteSpace(item.Date))
                                        {
                                            row.AutoItem().Text(item.Date).FontSize(9).FontColor(Colors.Grey.Darken1);
                                        }
                                    });

                                    if (!string.IsNullOrWhiteSpace(item.Description))
                                    {
                                        col.Item().PaddingLeft(8).PaddingTop(1).Text(text => AppendFormattedText(text, item.Description, 1.25f));
                                    }
                                }
                            }
                        }
                    });
                });
            });

            return document.GeneratePdf();
        }

        private static QuestPDF.Infrastructure.Color SafeHexColor(string? hex, QuestPDF.Infrastructure.Color fallback)
        {
            if (string.IsNullOrWhiteSpace(hex)) return fallback;
            try
            {
                return QuestPDF.Infrastructure.Color.FromHex(hex);
            }
            catch
            {
                return fallback;
            }
        }

        private static void AddPdfSectionHeader(
            ColumnDescriptor col,
            string title,
            float headingFontSize,
            string headingStyle,
            bool sectionDividers,
            string dividerStyle,
            float lineThickness,
            QuestPDF.Infrastructure.Color dividerColor,
            QuestPDF.Infrastructure.Color accentColor)
        {
            if (headingStyle == "bar")
            {
                col.Item().PaddingTop(10).BorderLeft(3).BorderColor(accentColor).PaddingLeft(6)
                    .Text(title).FontSize(headingFontSize).Bold().FontColor(Colors.Grey.Darken4);
            }
            else
            {
                col.Item().PaddingTop(10).Text(title).FontSize(headingFontSize).Bold().FontColor(Colors.Grey.Darken4);
                if (sectionDividers && dividerStyle != "none" && headingStyle != "clean")
                {
                    col.Item().PaddingTop(2).LineHorizontal(Math.Max(0.5f, lineThickness * 0.75f)).LineColor(dividerColor);
                }
            }
        }

        private static void AppendFormattedText(TextDescriptor descriptor, string rawText, float lineHeight = 1.25f)
        {
            if (string.IsNullOrWhiteSpace(rawText)) return;
            descriptor.DefaultTextStyle(x => x.LineHeight(lineHeight));
            var parts = System.Text.RegularExpressions.Regex.Split(rawText, @"(\*\*.*?\*\*)");
            foreach (var part in parts)
            {
                if (part.StartsWith("**") && part.EndsWith("**") && part.Length >= 4)
                {
                    descriptor.Span(part.Substring(2, part.Length - 4)).Bold();
                }
                else if (!string.IsNullOrEmpty(part))
                {
                    descriptor.Span(part);
                }
            }
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
    }
}
