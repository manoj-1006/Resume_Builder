using System;
using System.Collections.Generic;

namespace ResumeAI.Server.Models
{
    public class Resume
    {
        public int Id { get; set; }
        public string Title { get; set; } = "Untitled Resume";
        public string TargetRole { get; set; } = "";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Contact / Header Information
        public string FullName { get; set; } = "";
        public string Email { get; set; } = "";
        public string Phone { get; set; } = "";
        public string Location { get; set; } = "";
        public string LinkedInUrl { get; set; } = "";
        public string LinkedInText { get; set; } = "";
        public string GitHubUrl { get; set; } = "";
        public string GitHubText { get; set; } = "";
        public string PortfolioUrl { get; set; } = "";
        public string PortfolioText { get; set; } = "";

        // Formatting / Advanced Settings
        public string FormattingJson { get; set; } = "";

        // Summary
        public string ProfessionalSummary { get; set; } = "";

        // Sections (stored as rich structured objects)
        public List<ExperienceItem> Experiences { get; set; } = new();
        public List<EducationItem> Educations { get; set; } = new();
        public List<SkillCategoryItem> SkillCategories { get; set; } = new();
        public List<ProjectItem> Projects { get; set; } = new();
        public List<CertificationItem> Certifications { get; set; } = new();
        public List<OtherSectionItem> Others { get; set; } = new();
    }

    public class ExperienceItem
    {
        public string Id { get; set; } = Guid.NewGuid().ToString("N");
        public string Company { get; set; } = "";
        public string Role { get; set; } = "";
        public string Location { get; set; } = "";
        public string StartDate { get; set; } = "";
        public string EndDate { get; set; } = "";
        public bool IsCurrent { get; set; } = false;
        public List<string> Bullets { get; set; } = new();
    }

    public class EducationItem
    {
        public string Id { get; set; } = Guid.NewGuid().ToString("N");
        public string Institution { get; set; } = "";
        public string Degree { get; set; } = "";
        public string FieldOfStudy { get; set; } = "";
        public string Location { get; set; } = "";
        public string GraduationDate { get; set; } = "";
        public string Gpa { get; set; } = "";

        // Schooling / 10th & 12th marks support
        public bool IsSchooling { get; set; } = false;
        public bool IsDiploma { get; set; } = false;
        public string Grade12Stream { get; set; } = "";
        public string Grade12Score { get; set; } = "";
        public string Grade12Year { get; set; } = "";
        public string Grade10Board { get; set; } = "";
        public string Grade10Score { get; set; } = "";
        public string Grade10Year { get; set; } = "";
        public string Grade10School { get; set; } = "";
    }

    public class SkillCategoryItem
    {
        public string Category { get; set; } = "";
        public List<string> Skills { get; set; } = new();
    }

    public class ProjectItem
    {
        public string Id { get; set; } = Guid.NewGuid().ToString("N");
        public string Title { get; set; } = "";
        public string Role { get; set; } = "";
        public string TechStack { get; set; } = "";
        public string Link { get; set; } = "";
        public List<string> Bullets { get; set; } = new();
    }

    public class CertificationItem
    {
        public string Id { get; set; } = Guid.NewGuid().ToString("N");
        public string Name { get; set; } = "";
        public string Issuer { get; set; } = "";
        public string IssueDate { get; set; } = "";
        public string CredentialUrl { get; set; } = "";
    }

    public class OtherSectionItem
    {
        public string Id { get; set; } = Guid.NewGuid().ToString("N");
        public string Category { get; set; } = "Awards & Honors";
        public string Title { get; set; } = "";
        public string Organization { get; set; } = "";
        public string Date { get; set; } = "";
        public string Description { get; set; } = "";
    }
}
