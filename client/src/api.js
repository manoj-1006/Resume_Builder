const API_BASE = '/api';

export async function fetchResumes() {
  const res = await fetch(`${API_BASE}/resumes`);
  if (!res.ok) throw new Error('Failed to load resumes');
  return res.json();
}

export async function fetchResume(id) {
  const res = await fetch(`${API_BASE}/resumes/${id}`);
  if (!res.ok) throw new Error(`Failed to load resume ${id}`);
  return res.json();
}

export async function createResume(data) {
  const res = await fetch(`${API_BASE}/resumes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create resume');
  return res.json();
}

export async function updateResume(id, data) {
  const res = await fetch(`${API_BASE}/resumes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to save resume');
  return res.json();
}

export async function deleteResume(id) {
  const res = await fetch(`${API_BASE}/resumes/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete resume');
  return true;
}

export async function duplicateResume(id) {
  const res = await fetch(`${API_BASE}/resumes/${id}/duplicate`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to duplicate resume');
  return res.json();
}

// AI Services
export async function polishBullet(rawBullet, role = '', company = '', targetJobDescription = '') {
  const res = await fetch(`${API_BASE}/ai/polish-bullet`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rawBullet, role, company, targetJobDescription }),
  });
  if (!res.ok) throw new Error('Failed to polish bullet point');
  return res.json();
}

export async function scanAts(resume, jobTitle, company, jobDescription) {
  const res = await fetch(`${API_BASE}/ai/scan-ats`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resume, jobTitle, company, jobDescription }),
  });
  if (!res.ok) throw new Error('Failed to run ATS scan');
  return res.json();
}

export async function generateSummary(resume, targetRole, jobDescription) {
  const res = await fetch(`${API_BASE}/ai/generate-summary`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resume, targetRole, jobDescription }),
  });
  if (!res.ok) throw new Error('Failed to generate summary');
  return res.json();
}

export async function tailorResume(resume, jobTitle, jobDescription) {
  const res = await fetch(`${API_BASE}/ai/tailor-resume`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resume, jobTitle, jobDescription }),
  });
  if (!res.ok) throw new Error('Failed to tailor resume');
  return res.json();
}

export function getExportPdfUrl(id) {
  return `${API_BASE}/resumes/${id}/export/pdf`;
}

export function getExportDocxUrl(id) {
  return `${API_BASE}/resumes/${id}/export/docx`;
}
