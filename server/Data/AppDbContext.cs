using System.Collections.Generic;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using ResumeAI.Server.Models;

namespace ResumeAI.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Resume> Resumes => Set<Resume>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            var jsonOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = false
            };

            modelBuilder.Entity<Resume>(entity =>
            {
                entity.HasKey(r => r.Id);

                entity.Property(r => r.Title).IsRequired().HasMaxLength(200);
                entity.Property(r => r.FullName).HasMaxLength(150);
                entity.Property(r => r.FormattingJson).HasDefaultValue("");

                entity.Property(r => r.Experiences)
                    .HasConversion(
                        v => JsonSerializer.Serialize(v, jsonOptions),
                        v => JsonSerializer.Deserialize<List<ExperienceItem>>(v, jsonOptions) ?? new List<ExperienceItem>()
                    );

                entity.Property(r => r.Educations)
                    .HasConversion(
                        v => JsonSerializer.Serialize(v, jsonOptions),
                        v => JsonSerializer.Deserialize<List<EducationItem>>(v, jsonOptions) ?? new List<EducationItem>()
                    );

                entity.Property(r => r.SkillCategories)
                    .HasConversion(
                        v => JsonSerializer.Serialize(v, jsonOptions),
                        v => JsonSerializer.Deserialize<List<SkillCategoryItem>>(v, jsonOptions) ?? new List<SkillCategoryItem>()
                    );

                entity.Property(r => r.Projects)
                    .HasConversion(
                        v => JsonSerializer.Serialize(v, jsonOptions),
                        v => JsonSerializer.Deserialize<List<ProjectItem>>(v, jsonOptions) ?? new List<ProjectItem>()
                    );

                entity.Property(r => r.Certifications)
                    .HasConversion(
                        v => JsonSerializer.Serialize(v, jsonOptions),
                        v => JsonSerializer.Deserialize<List<CertificationItem>>(v, jsonOptions) ?? new List<CertificationItem>()
                    );

                entity.Property(r => r.Others)
                    .HasConversion(
                        v => JsonSerializer.Serialize(v, jsonOptions),
                        v => JsonSerializer.Deserialize<List<OtherSectionItem>>(v, jsonOptions) ?? new List<OtherSectionItem>()
                    );
            });
        }
    }
}
