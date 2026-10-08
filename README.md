# ResumeForge AI 🚀 (Full-Stack AI Resume Creator)

An open, unlimited AI Resume Creator and ATS Optimizer built with **ASP.NET Core (.NET 10)** and **React + Tailwind CSS**.

### Key Capabilities:
- ♾️ **Unlimited Resumes & Profiles**: Create, duplicate, and store as many tailored resumes as you want.
- ⚡ **AI Bullet Polish & Metrics**: Turns raw tasks into metric-driven, quantified career achievements.
- 🎯 **ATS Scanner & Job Matcher**: Paste any job description to get a match score (0-100%), keyword gap analysis, and recruiter recommendations.
- 🤖 **1-Click Resume Tailor**: Automatically adapts your summary and bullets to target specific job postings.
- 📐 **Interactive Split-Screen Ratios**: Toggle seamlessly between `1/3 Details : 2/3 Resume View` (zoom in on resume) and `2/3 Details : 1/3 Resume View` (zoom in on details).
- 📄 **100% ATS-Compliant Exports**: Export to selectable-text PDF (powered by QuestPDF) and Microsoft Word (`.docx`).

---

## Architecture Overview

- **Backend**: ASP.NET Core Web API (.NET 10, C#)
  - SQLite with EF Core for local, zero-friction storage
  - Google Gemini API integration (`gemini-2.5-flash` / `gemini-1.5-flash`)
  - QuestPDF & DocumentFormat.OpenXml for PDF and Word document generation
- **Frontend**: React 19 + Vite + Tailwind CSS + Lucide Icons
  - Split-screen workspace (Interactive Editor on left, Live ATS Preview on right)
  - Clean light design with high-contrast typography
  - Real-time updates as you type and polish

---

## Quick Start (Run Locally)

### 1. Configure Your Gemini API Key
You can get a free API key from [Google AI Studio](https://aistudio.google.com/).

Set it in your terminal:
```powershell
$env:GEMINI_API_KEY="your_actual_gemini_api_key"
```
Or in `server/appsettings.json`:
```json
"Gemini": {
  "ApiKey": "your_actual_gemini_api_key",
  "Model": "gemini-2.5-flash"
}
```

### 2. Start the Backend API
```powershell
cd server
dotnet run --launch-profile "ResumeAI (Browser)"
```
The server will start at `http://localhost:5097` and open your default browser. On first launch, it automatically initializes the SQLite database and seeds a sample senior full-stack engineer resume.

### 3. Start the Frontend (Development Mode)
In another terminal:
```powershell
cd client
npm run dev
```
Open `http://localhost:5173` in your browser.

*(Alternatively, because the React build is already published to `server/wwwroot`, navigating directly to `http://localhost:5097` serves the full app without needing Node.js running!)*

---

## Deploying Online 🌐

This project includes a multi-stage `Dockerfile` that packages both the React UI and ASP.NET Core Web API into a single self-contained image.

### Option A: Railway or Render (Easiest)
1. Push this repository to GitHub.
2. Link your repository in [Railway](https://railway.app) or [Render](https://render.com).
3. Set Environment Variable: `GEMINI_API_KEY=your_key`.
4. Deploy! The `Dockerfile` handles building the React app and running the .NET server on port 8080 automatically.

### Option B: Azure Container Apps / App Service
1. In Visual Studio or VS Code, right-click the `server` project and select **Publish to Azure**.
2. Or build the Docker container:
   ```bash
   docker build -t your-registry/resume-ai:latest .
   docker run -p 8080:8080 -e GEMINI_API_KEY="your_key" your-registry/resume-ai:latest
   ```

### Option C: VPS / DigitalOcean with Docker Compose
```bash
docker compose up -d --build
```
Your app will be live at `http://your-server-ip:8080`.
