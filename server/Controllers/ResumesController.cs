using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResumeAI.Server.Data;
using ResumeAI.Server.Models;
using ResumeAI.Server.Services;

namespace ResumeAI.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ResumesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IResumeExportService _exportService;

        public ResumesController(AppDbContext context, IResumeExportService exportService)
        {
            _context = context;
            _exportService = exportService;
        }

        // GET: api/resumes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetResumes()
        {
            var resumes = await _context.Resumes
                .OrderByDescending(r => r.UpdatedAt)
                .ToListAsync();

            var summary = resumes.Select(r => new
            {
                r.Id,
                r.Title,
                r.TargetRole,
                r.FullName,
                r.CreatedAt,
                r.UpdatedAt,
                ExperienceCount = r.Experiences?.Count ?? 0,
                SkillCount = r.SkillCategories?.Sum(s => s.Skills?.Count ?? 0) ?? 0
            });

            return Ok(summary);
        }

        // GET: api/resumes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Resume>> GetResume(int id)
        {
            var resume = await _context.Resumes.FindAsync(id);
            if (resume == null)
            {
                return NotFound(new { message = $"Resume with ID {id} not found." });
            }

            return Ok(resume);
        }

        // POST: api/resumes
        [HttpPost]
        public async Task<ActionResult<Resume>> CreateResume(Resume resume)
        {
            if (string.IsNullOrWhiteSpace(resume.Title))
            {
                var existingTitles = await _context.Resumes
                    .Select(r => r.Title.ToLower())
                    .ToListAsync();
                if (!existingTitles.Contains("resume"))
                {
                    resume.Title = "Resume";
                }
                else
                {
                    int i = 1;
                    while (existingTitles.Contains($"resume {i}"))
                    {
                        i++;
                    }
                    resume.Title = $"Resume {i}";
                }
            }

            resume.CreatedAt = DateTime.UtcNow;
            resume.UpdatedAt = DateTime.UtcNow;

            _context.Resumes.Add(resume);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetResume), new { id = resume.Id }, resume);
        }

        // PUT: api/resumes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateResume(int id, Resume resume)
        {
            if (id != resume.Id)
            {
                return BadRequest("ID mismatch.");
            }

            var existing = await _context.Resumes.FindAsync(id);
            if (existing == null)
            {
                return NotFound();
            }

            if (!string.IsNullOrWhiteSpace(resume.Title))
            {
                existing.Title = resume.Title.Trim();
            }
            existing.TargetRole = resume.TargetRole;
            existing.FullName = resume.FullName;
            existing.Email = resume.Email;
            existing.Phone = resume.Phone;
            existing.Location = resume.Location;
            existing.LinkedInUrl = resume.LinkedInUrl;
            existing.LinkedInText = resume.LinkedInText;
            existing.GitHubUrl = resume.GitHubUrl;
            existing.GitHubText = resume.GitHubText;
            existing.PortfolioUrl = resume.PortfolioUrl;
            existing.PortfolioText = resume.PortfolioText;
            existing.ProfessionalSummary = resume.ProfessionalSummary;
            existing.Experiences = resume.Experiences ?? new();
            existing.Educations = resume.Educations ?? new();
            existing.SkillCategories = resume.SkillCategories ?? new();
            existing.Projects = resume.Projects ?? new();
            existing.Certifications = resume.Certifications ?? new();
            existing.Others = resume.Others ?? new();
            existing.FormattingJson = resume.FormattingJson ?? "";
            existing.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(existing);
        }

        // DELETE: api/resumes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteResume(int id)
        {
            if (id == 1 || id == 2 || id == 3)
            {
                return BadRequest(new { message = "The initial base resumes (IDs 1, 2, 3) are protected and cannot be deleted." });
            }

            var resume = await _context.Resumes.FindAsync(id);
            if (resume == null)
            {
                return NotFound();
            }

            _context.Resumes.Remove(resume);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/resumes/5/duplicate
        [HttpPost("{id}/duplicate")]
        public async Task<ActionResult<Resume>> DuplicateResume(int id)
        {
            var original = await _context.Resumes.FindAsync(id);
            if (original == null)
            {
                return NotFound();
            }

            var duplicate = new Resume
            {
                Title = $"{original.Title} (Copy)",
                TargetRole = original.TargetRole,
                FullName = original.FullName,
                Email = original.Email,
                Phone = original.Phone,
                Location = original.Location,
                LinkedInUrl = original.LinkedInUrl,
                LinkedInText = original.LinkedInText,
                GitHubUrl = original.GitHubUrl,
                GitHubText = original.GitHubText,
                PortfolioUrl = original.PortfolioUrl,
                PortfolioText = original.PortfolioText,
                ProfessionalSummary = original.ProfessionalSummary,
                FormattingJson = original.FormattingJson ?? "",
                Experiences = original.Experiences.Select(e => new ExperienceItem
                {
                    Company = e.Company,
                    Role = e.Role,
                    Location = e.Location,
                    StartDate = e.StartDate,
                    EndDate = e.EndDate,
                    IsCurrent = e.IsCurrent,
                    Bullets = new List<string>(e.Bullets)
                }).ToList(),
                Educations = original.Educations.Select(ed => new EducationItem
                {
                    Institution = ed.Institution,
                    Degree = ed.Degree,
                    FieldOfStudy = ed.FieldOfStudy,
                    Location = ed.Location,
                    GraduationDate = ed.GraduationDate,
                    Gpa = ed.Gpa,
                    IsSchooling = ed.IsSchooling,
                    Grade12Stream = ed.Grade12Stream,
                    Grade12Score = ed.Grade12Score,
                    Grade12Year = ed.Grade12Year,
                    Grade10Board = ed.Grade10Board,
                    Grade10Score = ed.Grade10Score,
                    Grade10Year = ed.Grade10Year,
                    Grade10School = ed.Grade10School
                }).ToList(),
                SkillCategories = original.SkillCategories.Select(s => new SkillCategoryItem
                {
                    Category = s.Category,
                    Skills = new List<string>(s.Skills)
                }).ToList(),
                Projects = original.Projects.Select(p => new ProjectItem
                {
                    Title = p.Title,
                    Role = p.Role,
                    TechStack = p.TechStack,
                    Link = p.Link,
                    Bullets = new List<string>(p.Bullets)
                }).ToList(),
                Certifications = original.Certifications.Select(c => new CertificationItem
                {
                    Name = c.Name,
                    Issuer = c.Issuer,
                    IssueDate = c.IssueDate,
                    CredentialUrl = c.CredentialUrl
                }).ToList(),
                Others = (original.Others ?? new()).Select(o => new OtherSectionItem
                {
                    Category = o.Category,
                    Title = o.Title,
                    Organization = o.Organization,
                    Date = o.Date,
                    Description = o.Description
                }).ToList(),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Resumes.Add(duplicate);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetResume), new { id = duplicate.Id }, duplicate);
        }

        // GET: api/resumes/5/export/pdf
        [HttpGet("{id}/export/pdf")]
        public async Task<IActionResult> ExportPdf(int id)
        {
            var resume = await _context.Resumes.FindAsync(id);
            if (resume == null)
            {
                return NotFound();
            }

            var pdfBytes = _exportService.GeneratePdf(resume);
            var baseTitle = !string.IsNullOrWhiteSpace(resume.Title)
                ? resume.Title.Trim()
                : (!string.IsNullOrWhiteSpace(resume.FullName) ? $"{resume.FullName.Trim()}_Resume" : "Resume");
            var invalidChars = System.IO.Path.GetInvalidFileNameChars();
            var cleaned = string.Join("_", baseTitle.Split(invalidChars, StringSplitOptions.RemoveEmptyEntries))
                                .Replace(" ", "_");
            var safeName = System.Text.RegularExpressions.Regex.Replace(cleaned, "_+", "_").Trim('_');
            if (string.IsNullOrWhiteSpace(safeName)) safeName = "Resume";
            return File(pdfBytes, "application/pdf", $"{safeName}.pdf");
        }

        // GET: api/resumes/5/export/docx
        [HttpGet("{id}/export/docx")]
        public async Task<IActionResult> ExportDocx(int id)
        {
            var resume = await _context.Resumes.FindAsync(id);
            if (resume == null)
            {
                return NotFound();
            }

            var docxBytes = _exportService.GenerateDocx(resume);
            var baseTitle = !string.IsNullOrWhiteSpace(resume.Title)
                ? resume.Title.Trim()
                : (!string.IsNullOrWhiteSpace(resume.FullName) ? $"{resume.FullName.Trim()}_Resume" : "Resume");
            var invalidChars = System.IO.Path.GetInvalidFileNameChars();
            var cleaned = string.Join("_", baseTitle.Split(invalidChars, StringSplitOptions.RemoveEmptyEntries))
                                .Replace(" ", "_");
            var safeName = System.Text.RegularExpressions.Regex.Replace(cleaned, "_+", "_").Trim('_');
            if (string.IsNullOrWhiteSpace(safeName)) safeName = "Resume";
            return File(docxBytes, "application/vnd.openxmlformats-officedocument.wordprocessingml.document", $"{safeName}.docx");
        }
    }
}
