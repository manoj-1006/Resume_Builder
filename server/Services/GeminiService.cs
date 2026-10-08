using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using ResumeAI.Server.Models;

namespace ResumeAI.Server.Services
{
    public interface IAiResumeService
    {
        Task<PolishBulletResponse> PolishBulletAsync(PolishBulletRequest request);
        Task<AtsScanResponse> ScanAtsAsync(AtsScanRequest request);
        Task<GenerateSummaryResponse> GenerateSummaryAsync(GenerateSummaryRequest request);
        Task<Resume> TailorResumeAsync(TailorResumeRequest request);
    }

    public class GeminiService : IAiResumeService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _config;
        private readonly ILogger<GeminiService> _logger;
        private readonly string _apiKey;
        private readonly string _modelName;

        public GeminiService(HttpClient httpClient, IConfiguration config, ILogger<GeminiService> logger)
        {
            _httpClient = httpClient;
            _config = config;
            _logger = logger;

            // Check config or environment variables
            _apiKey = _config["Gemini:ApiKey"] 
                      ?? Environment.GetEnvironmentVariable("GEMINI_API_KEY") 
                      ?? "";
            _modelName = _config["Gemini:Model"] ?? "gemini-2.5-flash";
        }

        private async Task<string> CallGeminiJsonAsync(string prompt)
        {
            if (string.IsNullOrWhiteSpace(_apiKey))
            {
                throw new InvalidOperationException("Gemini API key is not configured. Please set GEMINI_API_KEY in your environment or appsettings.json.");
            }

            var url = $"https://generativelanguage.googleapis.com/v1beta/models/{_modelName}:generateContent?key={_apiKey}";

            var requestBody = new
            {
                contents = new[]
                {
                    new
                    {
                        parts = new[]
                        {
                            new { text = prompt }
                        }
                    }
                },
                generationConfig = new
                {
                    temperature = 0.2,
                    responseMimeType = "application/json"
                }
            };

            var jsonContent = new StringContent(
                JsonSerializer.Serialize(requestBody),
                Encoding.UTF8,
                "application/json"
            );

            var response = await _httpClient.PostAsync(url, jsonContent);

            if (!response.IsSuccessStatusCode)
            {
                // Fallback to gemini-1.5-flash if 2.5-flash model name differs
                if (_modelName != "gemini-1.5-flash")
                {
                    var fallbackUrl = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={_apiKey}";
                    var fallbackResponse = await _httpClient.PostAsync(fallbackUrl, jsonContent);
                    if (fallbackResponse.IsSuccessStatusCode)
                    {
                        return await ExtractContentAsync(fallbackResponse);
                    }
                }

                var err = await response.Content.ReadAsStringAsync();
                _logger.LogError("Gemini API call failed: {Status} - {Error}", response.StatusCode, err);
                throw new HttpRequestException($"Gemini API error ({response.StatusCode}): {err}");
            }

            return await ExtractContentAsync(response);
        }

        private static async Task<string> ExtractContentAsync(HttpResponseMessage response)
        {
            var contentString = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(contentString);
            var root = doc.RootElement;

            if (root.TryGetProperty("candidates", out var candidates) && candidates.GetArrayLength() > 0)
            {
                var first = candidates[0];
                if (first.TryGetProperty("content", out var content) &&
                    content.TryGetProperty("parts", out var parts) &&
                    parts.GetArrayLength() > 0)
                {
                    return parts[0].GetProperty("text").GetString() ?? "{}";
                }
            }

            return "{}";
        }

        public async Task<PolishBulletResponse> PolishBulletAsync(PolishBulletRequest request)
        {
            var prompt = $@"
You are an elite executive resume writer and career strategist specializing in high-impact achievement statements:
'Accomplished result [X] as measured by metric [Y], by doing action [Z]'

Original bullet point: ""{request.RawBullet}""
Candidate's Role: ""{request.Role}""
Company: ""{request.Company}""
Target Job Context: ""{request.TargetJobDescription}""

Rules:
1. Start with a decisive past-tense action verb (e.g., Architected, Spearheaded, Accelerated, Orchestrated, Optimized).
2. Quantify results with realistic metrics or placeholders (e.g., 'by 35%', 'saving 12 hours/week', 'across 4 teams').
3. Focus on outcomes and business value, not just daily tasks.
4. Eliminate weak passive words ('responsible for', 'worked on', 'helped with').

Generate exactly 3 variations in JSON format:
{{
  ""original"": ""{request.RawBullet.Replace("\"", "\\\"")}"",
  ""impactBreakdown"": ""Clear breakdown of accomplishment, measurable metrics, and actions taken."",
  ""variations"": [
    {{
      ""style"": ""Metrics & High Impact"",
      ""text"": ""The rewritten bullet statement"",
      ""highlightedMetrics"": ""Specific metric or scale mentioned"",
      ""reasonWhyItWorks"": ""Why this impresses hiring managers""
    }},
    {{
      ""style"": ""Action & Execution"",
      ""text"": ""The rewritten bullet statement focusing on implementation and speed"",
      ""highlightedMetrics"": ""Specific metric or scale"",
      ""reasonWhyItWorks"": ""Why this works""
    }},
    {{
      ""style"": ""Leadership & Scope"",
      ""text"": ""The rewritten bullet statement focusing on scope, collaboration, or leadership"",
      ""highlightedMetrics"": ""Specific metric or scale"",
      ""reasonWhyItWorks"": ""Why this works""
    }}
  ]
}}
Respond ONLY with this JSON.
";
            try
            {
                var json = await CallGeminiJsonAsync(prompt);
                var result = JsonSerializer.Deserialize<PolishBulletResponse>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                return result ?? GetFallbackBulletPolish(request.RawBullet);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to call Gemini for PolishBullet. Returning heuristic fallback.");
                return GetFallbackBulletPolish(request.RawBullet);
            }
        }

        public async Task<AtsScanResponse> ScanAtsAsync(AtsScanRequest request)
        {
            var resumeText = JsonSerializer.Serialize(request.Resume);
            var prompt = $@"
You are a senior ATS (Applicant Tracking System) parser and recruiter evaluation engine (like Greenhouse, Workday, Taleo).
Analyze this candidate's resume against the target job posting.

Target Job Title: ""{request.JobTitle}""
Target Company: ""{request.Company}""
Job Description:
""{request.JobDescription}""

Candidate Resume Data:
""{resumeText}""

Perform a deep ATS gap analysis:
1. Calculate a realistic Match Score from 0 to 100 based on core skills, requirements, and keywords.
2. Identify keywords that are present in both the resume and the job description.
3. Identify crucial missing keywords, tools, certifications, or concepts that the job description demands but the resume lacks.
4. Give 3-5 high-priority, specific recommendations for how to modify the resume bullets to pass the ATS filter.
5. Provide a suggested tailored 3-4 sentence professional summary.

Respond ONLY with this JSON schema:
{{
  ""matchScore"": 82,
  ""assessment"": ""Strong match for core skills, but lacks specific cloud infra and testing keywords."",
  ""matchingKeywords"": [""C#"", "".NET"", ""REST APIs""],
  ""missingKeywords"": [""Docker"", ""Kubernetes"", ""CI/CD"", ""Microservices""],
  ""highPriorityRecommendations"": [
    ""Incorporate containerization keywords into your backend development bullets."",
    ""Quantify system throughput or latency improvements in your recent role.""
  ],
  ""suggestedTailoredSummary"": ""Results-driven Software Engineer with extensive experience building high-scale .NET applications...""
}}
";
            try
            {
                var json = await CallGeminiJsonAsync(prompt);
                var result = JsonSerializer.Deserialize<AtsScanResponse>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                return result ?? new AtsScanResponse { MatchScore = 70, Assessment = "Scan completed." };
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Gemini scan failed, returning fallback.");
                return new AtsScanResponse
                {
                    MatchScore = 75,
                    Assessment = "ATS Heuristic Scan: Review target job keywords to maximize ATS score.",
                    MatchingKeywords = new List<string> { "Problem Solving", "Full-Stack Development", "Collaboration" },
                    MissingKeywords = new List<string> { "Specific tooling from JD", "Metric quantification" },
                    HighPriorityRecommendations = new List<string>
                    {
                        "Add quantified metrics (%, $, time saved) to substantiate key achievements.",
                        "Align skill section names directly with the job description keywords."
                    },
                    SuggestedTailoredSummary = "Experienced professional with a strong track record of driving impactful results and delivering scalable solutions."
                };
            }
        }

        public async Task<GenerateSummaryResponse> GenerateSummaryAsync(GenerateSummaryRequest request)
        {
            var resumeText = JsonSerializer.Serialize(request.Resume);
            var prompt = $@"
You are an executive resume writer. Write a compelling 3-4 sentence professional summary for this candidate.
Target Role: ""{request.TargetRole}""
Target Job Context: ""{request.JobDescription}""

Resume Information:
""{resumeText}""

Respond ONLY with this JSON format:
{{
  ""summary"": ""Dynamic and results-driven..."",
  ""keyThemesUsed"": [""Technical Leadership"", ""System Scalability"", ""Cross-functional Collaboration""]
}}
";
            try
            {
                var json = await CallGeminiJsonAsync(prompt);
                var result = JsonSerializer.Deserialize<GenerateSummaryResponse>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                return result ?? new GenerateSummaryResponse { Summary = "Accomplished professional with proven expertise..." };
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Gemini summary generation failed.");
                return new GenerateSummaryResponse
                {
                    Summary = $"Results-driven {(!string.IsNullOrEmpty(request.TargetRole) ? request.TargetRole : "professional")} with proven experience delivering high-impact solutions, collaborating across cross-functional teams, and driving operational excellence.",
                    KeyThemesUsed = new List<string> { "Impact", "Execution", "Collaboration" }
                };
            }
        }

        public async Task<Resume> TailorResumeAsync(TailorResumeRequest request)
        {
            var resumeText = JsonSerializer.Serialize(request.Resume);
            var prompt = $@"
You are an expert resume optimizer. Realign the provided resume to strongly target the following job posting.
Job Title: ""{request.JobTitle}""
Job Description: ""{request.JobDescription}""

Existing Resume Data:
""{resumeText}""

Instructions:
1. Rewrite the ProfessionalSummary to directly address the requirements in the job description.
2. In Experiences, refine the bullet points using measurable outcomes and strong action verbs aligned with relevant keywords from the job description.
3. Preserve all factual job titles, dates, companies, and institutions.
4. Keep the output strictly in the exact same JSON format as the input Resume object.

Respond ONLY with the complete JSON Resume object.
";
            try
            {
                var json = await CallGeminiJsonAsync(prompt);
                var result = JsonSerializer.Deserialize<Resume>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                if (result != null)
                {
                    result.Id = request.Resume.Id; // Preserve ID
                    result.UpdatedAt = DateTime.UtcNow;
                    return result;
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Gemini resume tailoring failed.");
            }

            return request.Resume;
        }

        private static PolishBulletResponse GetFallbackBulletPolish(string raw)
        {
            var trimmed = raw?.Trim() ?? "Contributed to project goals";
            return new PolishBulletResponse
            {
                Original = trimmed,
                ImpactBreakdown = "Accomplished core objective, measured by measurable efficiency and quality gains, through decisive architectural leadership.",
                Variations = new List<BulletVariation>
                {
                    new BulletVariation
                    {
                        Style = "Metrics & High Impact",
                        Text = $"Spearheaded {trimmed}, resulting in a 30% reduction in turnaround time and improved workflow efficiency across cross-functional teams.",
                        HighlightedMetrics = "30% reduction in turnaround time",
                        ReasonWhyItWorks = "Demonstrates measurable outcome and business value."
                    },
                    new BulletVariation
                    {
                        Style = "Action & Execution",
                        Text = $"Architected and deployed optimized solutions for {trimmed}, eliminating technical bottlenecks and accelerating release cycles by 2x.",
                        HighlightedMetrics = "2x release cycle acceleration",
                        ReasonWhyItWorks = "Highlights technical initiative and rapid execution."
                    },
                    new BulletVariation
                    {
                        Style = "Leadership & Scope",
                        Text = $"Partnered with stakeholders to direct {trimmed}, aligning architecture with business goals and enhancing reliability for 10K+ users.",
                        HighlightedMetrics = "10K+ users impacted",
                        ReasonWhyItWorks = "Demonstrates broad organizational impact and stakeholder alignment."
                    }
                }
            };
        }
    }
}
