/* ─── API Client for Bisakerja Backend ─── */

const BASE_URL = "https://bisakerja-api.salmanabdurrahman.my.id/api/v1";

/* ─── Types ─── */

// Auth
export interface RegisterPayload {
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      username: string;
      email: string;
      phoneNumber?: string;
      isEmailVerified?: boolean;
    };
    session: {
      accessToken: string;
      expiresIn: number;
      tokenType: string;
    };
  } | null;
  error?: {
    code: string;
    details?: any;
    requestId?: string;
  };
  meta: unknown;
}

// User / Preferences
export interface PreferencesUpsertRequest {
  careerStatus: "FRESH_GRADUATE" | "EARLY_CAREER" | "CAREER_SWITCHER";
  jobSeekingStatus: "IMMEDIATE" | "ONE_MONTH" | "THREE_MONTHS";
  targetRoles: string[];
  locations: { province: string; city: string }[];
  workTypes: ("REMOTE" | "HYBRID" | "ONSITE")[];
  salaryExpectation?: {
    min: number;
    max: number;
    currency: string;
    period: "MONTHLY" | "YEARLY";
  };
  emailNotificationsEnabled?: boolean;
}

export interface PreferencesResponse {
  success: boolean;
  message: string;
  data: any;
  meta: any;
}

// Jobs
export interface APICompany {
  id: string;
  name: string;
  logoUrl: string | null;
  websiteUrl?: string | null;
}

export interface APISourcePlatform {
  id: string;
  name: string;
  slug: string;
}

export interface APILocation {
  display: string;
  province: string | null;
  city: string | null;
}

export interface APISalary {
  min: number | null;
  max: number | null;
  currency: string;
  period: string;
  display: string;
}

export interface APIRequirement {
  type: string;
  value: string;
  priority: string;
}

export interface APIJob {
  id: string;
  title: string;
  company: APICompany;
  sourcePlatform: APISourcePlatform;
  workType: string;
  employmentType: string;
  experienceLevel: string;
  location: APILocation;
  salary: APISalary;
  postedAt: string;
  lastSeenAt: string;
  isStale: boolean;
}

export interface APIJobDetail extends APIJob {
  description: string;
  requirements: APIRequirement[];
  skills: string[];
  externalApplyUrl: string | null;
  sourceUrl: string | null;
  sourceUpdatedAt: string | null;
  expiredAt: string | null;
}

export interface APIPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface APIJobsResponse {
  success: boolean;
  message: string;
  data: APIJob[];
  meta: {
    pagination: APIPagination;
    filters: Record<string, unknown>;
    sort: string;
  };
}

export interface APIJobDetailResponse {
  success: boolean;
  message: string;
  data: APIJobDetail;
  meta: unknown;
}

export interface APIErrorResponse {
  success: false;
  message: string;
  data: null;
  error: {
    code: string;
    details?: any;
    requestId?: string;
  };
}

/* ─── Token helpers ─── */

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("bisakerja_access_token");
}

export function setAccessToken(token: string) {
  localStorage.setItem("bisakerja_access_token", token);
}

export function clearAccessToken() {
  localStorage.removeItem("bisakerja_access_token");
}

export function getStoredUser(): AuthResponse["data"] | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("bisakerja_user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setStoredUser(user: AuthResponse["data"]) {
  localStorage.setItem("bisakerja_user", JSON.stringify(user));
}

export function clearStoredUser() {
  localStorage.removeItem("bisakerja_user");
}

/* ─── Generic fetch wrapper ─── */

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAccessToken();
  const headers: HeadersInit = {
    Accept: "application/json",
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  // Only set Content-Type for JSON body requests
  if (options.body && typeof options.body === "string") {
    (headers as Record<string, string>)["Content-Type"] = "application/json";
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: "include", // for cookie-based refresh
  });

  const json = await res.json();

  if (!res.ok) {
    const err = json as APIErrorResponse;
    throw new APIError(err.message, err.error?.code ?? "UNKNOWN", res.status, err.error?.details);
  }

  return json as T;
}

export class APIError extends Error {
  code: string;
  status: number;
  details?: any;

  constructor(message: string, code: string, status: number, details?: any) {
    super(message);
    this.name = "APIError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

/* ─── Auth API ─── */

export async function registerUser(payload: RegisterPayload): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      identifier: payload.email,
      password: payload.password
    }),
  });
}

export async function logoutUser(): Promise<{ success: boolean; message: string }> {
  return apiFetch("/auth/logout", {
    method: "POST",
  });
}

export async function refreshToken(): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/refresh", {
    method: "POST",
  });
}

/* ─── User API ─── */
export async function updatePreferences(payload: PreferencesUpsertRequest): Promise<PreferencesResponse> {
  return apiFetch<PreferencesResponse>("/me/preferences", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/* ─── Jobs API ─── */

export interface JobSearchParams {
  page?: number;
  limit?: number;
  keyword?: string;
  location?: string;
  province?: string;
  city?: string;
  workType?: string;
  employmentType?: string;
  experienceLevel?: string;
  salaryMin?: number;
  salaryMax?: number;
  sourcePlatform?: string;
  skill?: string;
  category?: string;
  sort?: string;
}

export async function fetchJobs(params: JobSearchParams = {}): Promise<APIJobsResponse> {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  });

  // Defaults
  if (!query.has("page")) query.set("page", "1");
  if (!query.has("limit")) query.set("limit", "20");

  return apiFetch<APIJobsResponse>(`/jobs?${query.toString()}`);
}

export async function fetchJobDetail(jobId: string): Promise<APIJobDetailResponse> {
  return apiFetch<APIJobDetailResponse>(`/jobs/${jobId}`);
}
