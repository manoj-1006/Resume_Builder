using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ResumeAI.Server.Models;
using ResumeAI.Server.Services;

namespace ResumeAI.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AiController : ControllerBase
    {
        private readonly IAiResumeService _aiService;

        public AiController(IAiResumeService aiService)
        {
            _aiService = aiService;
        }

        [HttpPost("polish-bullet")]
        public async Task<ActionResult<PolishBulletResponse>> PolishBullet([FromBody] PolishBulletRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.RawBullet))
            {
                return BadRequest(new { message = "Bullet text cannot be empty." });
            }

            var result = await _aiService.PolishBulletAsync(request);
            return Ok(result);
        }

        [HttpPost("scan-ats")]
        public async Task<ActionResult<AtsScanResponse>> ScanAts([FromBody] AtsScanRequest request)
        {
            if (request.Resume == null)
            {
                return BadRequest(new { message = "Resume data is required." });
            }

            if (string.IsNullOrWhiteSpace(request.JobDescription))
            {
                return BadRequest(new { message = "Target job description is required." });
            }

            var result = await _aiService.ScanAtsAsync(request);
            return Ok(result);
        }

        [HttpPost("generate-summary")]
        public async Task<ActionResult<GenerateSummaryResponse>> GenerateSummary([FromBody] GenerateSummaryRequest request)
        {
            var result = await _aiService.GenerateSummaryAsync(request);
            return Ok(result);
        }

        [HttpPost("tailor-resume")]
        public async Task<ActionResult<Resume>> TailorResume([FromBody] TailorResumeRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.JobDescription))
            {
                return BadRequest(new { message = "Job description is required for tailoring." });
            }

            var result = await _aiService.TailorResumeAsync(request);
            return Ok(result);
        }
    }
}
