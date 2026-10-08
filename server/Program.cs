using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using ResumeAI.Server.Data;
using ResumeAI.Server.Models;
using ResumeAI.Server.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddOpenApi();

// SQLite Database
var dbPath = builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=resumes.db";
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(dbPath));

// HTTP Client for Gemini API
builder.Services.AddHttpClient<IAiResumeService, GeminiService>();

// Export Services
builder.Services.AddSingleton<IPdfExportService, PdfExportService>();
builder.Services.AddSingleton<IWordExportService, WordExportService>();
builder.Services.AddSingleton<IResumeExportService, ResumeExportService>();

// CORS configuration (allow React dev server + production)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Auto-migrate / Ensure database is created and seed initial resume if empty
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();

    try
    {
        db.Database.ExecuteSqlRaw("ALTER TABLE Resumes ADD COLUMN FormattingJson TEXT DEFAULT ''");
    }
    catch
    {
        // Column already exists
    }

    try
    {
        db.Database.ExecuteSqlRaw("ALTER TABLE Resumes ADD COLUMN Others TEXT DEFAULT '[]'");
    }
    catch
    {
        // Column already exists
    }

    try
    {
        db.Database.ExecuteSqlRaw("ALTER TABLE Resumes ADD COLUMN LinkedInText TEXT DEFAULT ''");
    }
    catch { }

    try
    {
        db.Database.ExecuteSqlRaw("ALTER TABLE Resumes ADD COLUMN GitHubText TEXT DEFAULT ''");
    }
    catch { }

    try
    {
        db.Database.ExecuteSqlRaw("ALTER TABLE Resumes ADD COLUMN PortfolioText TEXT DEFAULT ''");
    }
    catch { }

    if (!db.Resumes.Any())
    {
        db.Resumes.Add(new Resume
        {
            Title = "Senior Full-Stack Engineer (Sample)",
            TargetRole = "Senior Full-Stack Software Engineer",
            FullName = "Alex Rivera",
            Email = "alex.rivera@example.com",
            Phone = "+1 (555) 349-2041",
            Location = "San Francisco, CA (Open to Remote)",
            LinkedInUrl = "linkedin.com/in/alexrivera-dev",
            GitHubUrl = "github.com/alexrivera",
            PortfolioUrl = "alexrivera.dev",
            ProfessionalSummary = "Impact-focused Senior Full-Stack Engineer with 6+ years of experience architecting high-scale distributed systems and responsive web applications. Proven track record of improving system throughput by 45% and leading cross-functional teams to deliver enterprise SaaS products.",
            Experiences = new List<ExperienceItem>
            {
                new ExperienceItem
                {
                    Company = "Apex Cloud Technologies",
                    Role = "Senior Software Engineer",
                    Location = "San Francisco, CA",
                    StartDate = "Jan 2023",
                    EndDate = "Present",
                    IsCurrent = true,
                    Bullets = new List<string>
                    {
                        "Architected an event-driven microservices pipeline processing 12M+ daily events, reducing message latency by 42% using .NET and Kafka.",
                        "Spearheaded the redesign of the customer analytics portal in React and TypeScript, boosting user engagement by 35% across 250 enterprise clients.",
                        "Mentored 5 junior engineers and established automated CI/CD deployment gates, cutting production defect rates by 28%."
                    }
                },
                new ExperienceItem
                {
                    Company = "Nexus Digital Solutions",
                    Role = "Full-Stack Developer",
                    Location = "Austin, TX",
                    StartDate = "Jun 2020",
                    EndDate = "Dec 2022",
                    IsCurrent = false,
                    Bullets = new List<string>
                    {
                        "Developed scalable RESTful APIs in ASP.NET Core and Entity Framework Core supporting 500K+ monthly active users.",
                        "Optimized complex PostgreSQL query execution plans and caching strategies, slashing p99 response times from 850ms to 140ms.",
                        "Collaborated with UX designers and product managers to deliver 14 core features within aggressive agile sprint deadlines."
                    }
                }
            },
            Educations = new List<EducationItem>
            {
                new EducationItem
                {
                    Institution = "University of Texas at Austin",
                    Degree = "Bachelor of Science",
                    FieldOfStudy = "Computer Science",
                    Location = "Austin, TX",
                    GraduationDate = "May 2020",
                    Gpa = "3.85 / 4.0"
                }
            },
            SkillCategories = new List<SkillCategoryItem>
            {
                new SkillCategoryItem
                {
                    Category = "Languages & Runtimes",
                    Skills = new List<string> { "C#", ".NET Core", "TypeScript", "JavaScript", "Python", "SQL" }
                },
                new SkillCategoryItem
                {
                    Category = "Frontend & Frameworks",
                    Skills = new List<string> { "React", "Next.js", "Tailwind CSS", "Redux Toolkit", "HTML5/CSS3" }
                },
                new SkillCategoryItem
                {
                    Category = "Cloud, DevOps & Data",
                    Skills = new List<string> { "Docker", "Kubernetes", "AWS (ECS, S3, RDS)", "PostgreSQL", "Redis", "Git", "GitHub Actions" }
                }
            },
            Projects = new List<ProjectItem>
            {
                new ProjectItem
                {
                    Title = "OpenTelemetry Distributed Trace Visualizer",
                    Role = "Creator & Lead Maintainer",
                    TechStack = ".NET 9, React, Go, OpenTelemetry",
                    Link = "github.com/alexrivera/trace-viz",
                    Bullets = new List<string>
                    {
                        "Built an open-source distributed tracing visualizer with 1.2K+ GitHub stars used by 80+ engineering teams to diagnose microservice latency bottlenecks.",
                        "Engineered zero-copy streaming parser yielding 4x throughput improvement over legacy diagnostic tools."
                    }
                }
            },
            Certifications = new List<CertificationItem>
            {
                new CertificationItem
                {
                    Name = "AWS Certified Solutions Architect – Associate",
                    Issuer = "Amazon Web Services",
                    IssueDate = "2024"
                }
            },
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        });

        db.SaveChanges();
    }
}

// HTTP Pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowAll");

// Serve static frontend files if built into wwwroot (for production single-container deployment)
app.UseDefaultFiles();
app.UseStaticFiles();

app.UseRouting();

app.MapControllers();

// Fallback to index.html for SPA client-side routing
app.MapFallbackToFile("index.html");

app.Run();
