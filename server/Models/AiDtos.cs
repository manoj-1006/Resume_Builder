using System.Collections.Generic;

namespace ResumeAI.Server.Models
{
    public class PolishBulletRequest
    {
        public string RawBullet { get; set; } = "";
        public string Role { get; set; } = "";
        public string Company { get; set; } = "";
        public string TargetJobDescription { get; set; } = "";
    }

    public class BulletVariation
    {
        public string Style { get; set; } = ""; // "Impact & Metrics", "Action & Results", "Leadership & Scope"
        public string Text { get; set; } = "";
        public string HighlightedMetrics { get; set; } = "";
        public string ReasonWhyItWorks { get; set; } = "";
    }

    public class PolishBulletResponse
    {
        public string Original { get; set; } = "";
        public List<BulletVariation> Variations { get; set; } = new();
        public string ImpactBreakdown { get; set; } = "";
    }

    public class AtsScanRequest
    {
        public Resume Resume { get; set; } = new();
        public string JobTitle { get; set; } = "";
        public string Company { get; set; } = "";
        public string JobDescription { get; set; } = "";
    }

    public class AtsScanResponse
    {
        public int MatchScore { get; set; } // 0 - 100
        public string Assessment { get; set; } = "";
        public List<string> MatchingKeywords { get; set; } = new();
        public List<string> MissingKeywords { get; set; } = new();
        public List<string> HighPriorityRecommendations { get; set; } = new();
        public string SuggestedTailoredSummary { get; set; } = "";
    }

    public class GenerateSummaryRequest
    {
        public Resume Resume { get; set; } = new();
        public string TargetRole { get; set; } = "";
        public string JobDescription { get; set; } = "";
    }

    public class GenerateSummaryResponse
    {
        public string Summary { get; set; } = "";
        public List<string> KeyThemesUsed { get; set; } = new();
    }

    public class TailorResumeRequest
    {
        public Resume Resume { get; set; } = new();
        public string JobTitle { get; set; } = "";
        public string JobDescription { get; set; } = "";
    }
}
