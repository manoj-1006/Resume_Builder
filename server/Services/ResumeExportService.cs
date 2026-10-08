using ResumeAI.Server.Models;

namespace ResumeAI.Server.Services
{
    public interface IResumeExportService
    {
        byte[] GeneratePdf(Resume resume);
        byte[] GenerateDocx(Resume resume);
    }

    /// <summary>
    /// Unified export service coordinating PDF (QuestPDF) and Word (OpenXml) exporters.
    /// </summary>
    public class ResumeExportService : IResumeExportService
    {
        private readonly IPdfExportService _pdfExportService;
        private readonly IWordExportService _wordExportService;

        public ResumeExportService(
            IPdfExportService? pdfExportService = null, 
            IWordExportService? wordExportService = null)
        {
            _pdfExportService = pdfExportService ?? new PdfExportService();
            _wordExportService = wordExportService ?? new WordExportService();
        }

        public byte[] GeneratePdf(Resume resume)
        {
            return _pdfExportService.GeneratePdf(resume);
        }

        public byte[] GenerateDocx(Resume resume)
        {
            return _wordExportService.GenerateDocx(resume);
        }
    }
}
