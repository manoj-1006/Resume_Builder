# 🚀 Multi-Agent Triad Guide: ResumeForge AI

This guide explains how to use the 3-Agent architecture established for your project:
1. 🧠 **Agent 1: Lead Manager & Orchestrator** ([roles/manager_agent.md](roles/manager_agent.md))
2. 🎨 **Agent 2: Frontend Specialist** ([roles/frontend_agent.md](roles/frontend_agent.md))
3. ⚙️ **Agent 3: Backend Specialist** ([roles/backend_agent.md](roles/backend_agent.md))

---

## 🎯 How to Use the Agents

### Option A: Single Chat Panel (Autonomous Orchestration)
In your main chat window with Antigravity:
1. Give your feature request or goal to the **Lead Manager Agent**.
2. The Manager will:
   - Break down the requirements into Frontend vs. Backend tasks.
   - Establish the API contract (routes, JSON schemas).
   - **Ask for your confirmation** before touching any code.
   - Execute the backend implementation, then the frontend implementation, and verify the whole stack.

**Prompt to start as Manager:**
```text
@.agents/roles/manager_agent.md
You are the Lead Manager & Orchestrator for ResumeForge AI. 
Here is what we need to build: [describe your feature here]. 
Please propose the plan, API contract, and ask for my confirmation before proceeding.
```

---

### Option B: Parallel Chat Panels (Dedicated Specialist Windows)
You can open multiple chat tabs/panels side-by-side in Antigravity:

- **Panel 1 — Frontend Specialist**:
  ```text
  @.agents/roles/frontend_agent.md
  You are the Frontend Specialist for ResumeForge AI. 
  Focus exclusively on client/ (React 19, Tailwind CSS, Vite).
  ```

- **Panel 2 — Backend Specialist**:
  ```text
  @.agents/roles/backend_agent.md
  You are the Backend Specialist for ResumeForge AI. 
  Focus exclusively on server/ (.NET 10, SQLite, QuestPDF).
  ```

- **Panel 3 — Project Manager (Optional)**:
  ```text
  @.agents/roles/manager_agent.md
  Coordinate the tasks between the Frontend and Backend specialists and review the code.
  ```

---

## 🛡️ Guardrails Common to All 3 Agents
All three agents strictly honor the rules set in [GEMINI.md](../../GEMINI.md):
- **Confirmation First**: Must explain the plan and wait for your approval before writing code.
- **Base Resume Protection**: Resumes `1`, `2`, and `3` can NEVER be deleted.
- **Title Rules**: Left-to-right alignment, sequential default naming (`Resume`, `Resume 1`, ...), and used as the export filename.
- **Delete Modal**: Must always use `DeleteConfirmationModal.jsx` instead of `window.confirm`.
