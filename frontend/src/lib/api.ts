const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

let currentEmployerId: string | null = null;

export function setEmployerId(id: string | null) {
  currentEmployerId = id;
}

export function getEmployerId(): string | null {
  return currentEmployerId;
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (currentEmployerId) {
    headers["X-Employer-Id"] = currentEmployerId;
  }

  const res = await fetch(`${API_URL}/api${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    let message = body.detail || res.statusText;
    if (body.non_field_errors) {
      message = body.non_field_errors.join(", ");
    } else if (typeof body === "object" && !body.detail) {
      const fieldErrors = Object.entries(body)
        .filter(([k]) => k !== "detail")
        .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
        .join("; ");
      if (fieldErrors) message = fieldErrors;
    }
    throw new ApiError(res.status, message, body);
  }

  return res.json();
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public body?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// --- Types ---

export interface Employer {
  id: number;
  name: string;
  slug: string;
  created_at: string;
}

export interface Job {
  id: number;
  employer: number;
  employer_name: string;
  title: string;
  description: string;
  requirements: string[];
  location: string;
  is_active: boolean;
  application_count: number;
  created_at: string;
  updated_at: string;
}

export interface Candidate {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  resume_text: string;
  skills: string[];
  experience_years: number;
  created_at: string;
}

export interface Application {
  id: number;
  candidate: number;
  candidate_name: string;
  job: number;
  job_title: string;
  employer_name: string;
  status: string;
  cover_letter: string;
  screening_score: string | null;
  screening_result: Record<string, unknown> | null;
  applied_at: string;
  screened_at: string | null;
}

export interface ScreeningTrace {
  id: number;
  node_name: string;
  input_data: Record<string, unknown> | null;
  output_data: Record<string, unknown> | null;
  started_at: string | null;
  completed_at: string | null;
  tokens_used: number | null;
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// --- API Functions ---

export async function getEmployers(): Promise<Employer[]> {
  const data = await apiFetch<PaginatedResponse<Employer>>("/employers/");
  return data.results;
}

export async function getJobs(): Promise<Job[]> {
  const data = await apiFetch<PaginatedResponse<Job>>("/jobs/");
  return data.results;
}

export async function getJob(id: number): Promise<Job> {
  return apiFetch<Job>(`/jobs/${id}/`);
}

export async function getCandidates(): Promise<Candidate[]> {
  const data = await apiFetch<PaginatedResponse<Candidate>>("/candidates/");
  return data.results;
}

export async function getApplications(
  filters: Record<string, string> = {},
): Promise<Application[]> {
  const params = new URLSearchParams(filters);
  const query = params.toString();
  const path = query ? `/applications/?${query}` : "/applications/";
  const data = await apiFetch<PaginatedResponse<Application>>(path);
  return data.results;
}

export async function getApplication(id: number): Promise<Application> {
  return apiFetch<Application>(`/applications/${id}/`);
}

export async function getApplicationTrace(
  id: number,
): Promise<ScreeningTrace[]> {
  return apiFetch<ScreeningTrace[]>(`/applications/${id}/trace/`);
}

export async function submitApplication(data: {
  candidate: number;
  job: number;
  cover_letter: string;
}): Promise<Application> {
  return apiFetch<Application>("/applications/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function overrideDecision(
  id: number,
  data: { decision: string; reason: string },
): Promise<unknown> {
  return apiFetch(`/applications/${id}/override/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
