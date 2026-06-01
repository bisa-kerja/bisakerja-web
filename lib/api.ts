/* ─── API Client for Bisakerja Backend ─── */

/**
 * All API calls go through the local Next.js proxy at /api/bisakerja/...
 * which forwards them server-side to the real backend, avoiding CORS.
 * See app/api/bisakerja/[...path]/route.ts
 */
const BASE_URL = "/api/bisakerja";

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

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface EmptySuccessResponse {
  success: boolean;
  message: string;
  data: null;
  meta: unknown;
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
    details?: unknown;
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
  data: unknown;
  meta: unknown;
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

export interface APIBookmark {
  id: string;
  job: APIJob;
  createdAt: string;
}

export interface APIBookmarksResponse {
  success: boolean;
  message: string;
  data: APIBookmark[];
  meta: {
    pagination: APIPagination;
    filters: Record<string, unknown>;
    sort: string;
  };
}

export interface CreateBookmarkResponse {
  success: boolean;
  message: string;
  data: APIBookmark;
  meta: unknown;
}

export interface DeleteBookmarkResponse {
  success: boolean;
  message: string;
  data: null;
  meta: unknown;
}

export type ApplicationStatus =
  | "APPLIED"
  | "SCREENING"
  | "INTERVIEW"
  | "OFFER"
  | "ACCEPTED"
  | "REJECTED"
  | "WITHDRAWN";

export interface APIApplication {
  id: string;
  status: ApplicationStatus | string;
  notes: string | null;
  source: string | null;
  appliedAt: string;
  updatedAt: string;
  job: APIJob;
}

export interface ApplicationsSearchParams {
  page?: number;
  limit?: number;
  keyword?: string;
  status?: string;
  sort?: string;
}

export interface APIApplicationsResponse {
  success: boolean;
  message: string;
  data: APIApplication[];
  meta: {
    pagination: APIPagination;
    filters: Record<string, unknown>;
    sort: string;
  };
}

export interface CreateApplicationPayload {
  jobId: string;
  status?: ApplicationStatus;
  notes?: string;
  source?: string;
}

export interface CreateApplicationResponse {
  success: boolean;
  message: string;
  data: APIApplication;
  meta: unknown;
}

export interface UpdateApplicationStatusPayload {
  status: ApplicationStatus;
  notes?: string;
}

export interface UpdateApplicationStatusResponse {
  success: boolean;
  message: string;
  data: APIApplication;
  meta: unknown;
}

export interface APIErrorResponse {
  success: false;
  message: string;
  data: null;
  error: {
    code: string;
    details?: unknown;
    requestId?: string;
  };
}

// CV Analyzer
export interface ActiveCVFile {
  id: string;
  originalFileName: string;
  mimeType: string;
  sizeBytes: number;
  uploadedAt: string;
  expiresAt: string;
  isActive: boolean;
}

export interface ActiveCVFileResponse {
  success: boolean;
  message: string;
  data: {
    cvFile: ActiveCVFile | null;
  } | null;
  meta: unknown;
}

export interface UploadCVFileResponse {
  success: boolean;
  message: string;
  data: {
    cvFile: ActiveCVFile;
  } | null;
  meta: unknown;
}

export interface CVSectionReview {
  sectionName: string;
  analysis: string;
  actionPoints: string[];
  whyItsImportantForYou: string;
}

export interface CVJobRecommendation {
  jobId: string;
  title: string;
  companyName: string;
  matchScore: number;
  reason: string;
  nextStep: string;
}

export interface CVAnalysisResult {
  id: string;
  schemaVersion: string;
  jobFitAlignment: {
    score: number;
    summary: string;
  };
  atsFriendliness: {
    score: number;
    summary: string;
  };
  overallImpression: string;
  topActionables: string[];
  sectionReviews: CVSectionReview[];
  jobRecommendations: CVJobRecommendation[];
  generatedCv: {
    available: boolean;
    note: string;
  };
  model: {
    name: string;
    version: string;
  };
  analyzedAt: string;
}

export type CVAnalyzerInputMode = "UPLOAD" | string;
export type CVAnalyzerCompareSource = "JOB_SEARCH" | "BOOKMARK" | string;

export interface CVAnalyzerResultHistoryItem {
  id: string;
  schemaVersion: string;
  analyzedAt: string;
  inputMode: CVAnalyzerInputMode;
  compareSource: CVAnalyzerCompareSource;
  jobFitAlignment: {
    score: number;
  };
  atsFriendliness: {
    score: number;
  };
  overallImpressionPreview: string;
  topActionablesPreview: string[];
  model: {
    name: string;
    version: string;
  };
  cvFile: {
    id: string;
    originalFileName: string;
    uploadedAt: string;
  } | null;
}

export interface CVAnalyzerResultsSearchParams {
  page?: number;
  limit?: number;
  sortBy?: "analyzedAt" | string;
  sortOrder?: "asc" | "desc";
  cvFileId?: string;
  schemaVersion?: string;
  inputMode?: CVAnalyzerInputMode;
  compareSource?: CVAnalyzerCompareSource;
}

export interface CVAnalyzerResultsResponse {
  success: boolean;
  message: string;
  data: CVAnalyzerResultHistoryItem[];
  meta: {
    pagination: APIPagination;
    filters: Record<string, unknown>;
    sort: string;
  };
}

export interface CVAnalyzerResultDetailResponse {
  success: boolean;
  message: string;
  data: {
    analysisResult: CVAnalysisResult;
    context: {
      language: string;
      inputMode: CVAnalyzerInputMode;
      compareSource: CVAnalyzerCompareSource;
      cvFile: {
        id: string;
        originalFileName: string;
        uploadedAt: string;
      } | null;
      inputSummary: {
        jobRoles?: string[];
        file?: {
          mimeType: string;
          sizeBytes: number;
        };
      } | null;
    };
  };
  meta: unknown;
}

export interface CVAnalyzerResponse {
  success: boolean;
  message: string;
  data: {
    jobRoles: string[];
    language: string;
    analysisResult: CVAnalysisResult;
  };
  meta: unknown;
}

export interface AnalyzeCVPayload {
  jobRoles: string[];
  cvFile?: File;
  cvFileId?: string | null;
  language?: string;
}

export const CV_ANALYZER_RESULT_STORAGE_KEY = "bisakerja_cv_analyzer_result";

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
  options: RequestInit = {},
): Promise<T> {
  const token = getAccessToken();
  const headers: HeadersInit = {
    Accept: "application/json",
    ...((options.headers as Record<string, string>) || {}),
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
    throw new APIError(
      err.message,
      err.error?.code ?? "UNKNOWN",
      res.status,
      err.error?.details,
    );
  }

  return json as T;
}

export class APIError extends Error {
  code: string;
  status: number;
  details?: unknown;

  constructor(message: string, code: string, status: number, details?: unknown) {
    super(message);
    this.name = "APIError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

/* ─── Auth API ─── */

export async function registerUser(
  payload: RegisterPayload,
): Promise<AuthResponse> {
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
      password: payload.password,
    }),
  });
}

export async function forgotPassword(
  payload: ForgotPasswordPayload,
): Promise<EmptySuccessResponse> {
  return apiFetch<EmptySuccessResponse>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function resetPassword(
  payload: ResetPasswordPayload,
): Promise<EmptySuccessResponse> {
  return apiFetch<EmptySuccessResponse>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function logoutUser(): Promise<{
  success: boolean;
  message: string;
}> {
  return apiFetch("/auth/logout", {
    method: "POST",
  });
}

export async function refreshToken(): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/refresh", {
    method: "POST",
  });
}

/* ─── Verify Email ─── */

export interface VerifyEmailPayload {
  email: string;
  otp: string;
}

export interface VerifyEmailResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      username: string;
      email: string;
      emailVerified: boolean;
      onboardingStatus: string;
      createdAt: string;
    };
  } | null;
  meta: unknown;
}

export async function verifyEmail(
  payload: VerifyEmailPayload,
): Promise<VerifyEmailResponse> {
  return apiFetch<VerifyEmailResponse>("/auth/verify-email", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/* ─── Profile / Me API ─── */

export interface ProfilePhoto {
  storageKey?: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
}

export interface ProfileSkill {
  id: string;
  name: string;
  level: "BASIC" | "INTERMEDIATE" | "ADVANCED" | string | null;
}

export interface ProfileExperience {
  id: string;
  title: string;
  company: string | null;
  employmentType: string | null;
  startDate: string | null;
  endDate: string | null;
  isCurrent: boolean;
  description: string | null;
}

export interface ProfileEducation {
  id: string;
  institution: string;
  degree: string | null;
  fieldOfStudy: string | null;
  startYear: number | null;
  endYear: number | null;
}

export interface ProfileData {
  id: string;
  username: string;
  email: string;
  emailVerified: boolean;
  phoneNumber: string | null;
  displayName: string | null;
  profilePhoto: ProfilePhoto | null;
  onboardingStatus: string;
  profile: {
    careerStatus: string | null;
    latestRole: string | null;
    summary: string | null;
  } | null;
  skills: ProfileSkill[];
  experience: ProfileExperience[];
  education: ProfileEducation[];
  createdAt: string;
  updatedAt: string;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  data: ProfileData;
  meta: null;
}

export interface UpdateProfilePayload {
  username?: string;
  phoneNumber?: string;
  displayName?: string;
}

export interface ProfilePhotoUpsertPayload {
  storageKey: string;
  url?: string | null;
  mimeType: "image/jpeg" | "image/png" | "image/webp" | string;
  sizeBytes: number;
}

export interface ReplaceSkillPayload {
  name: string;
  level?: "BASIC" | "INTERMEDIATE" | "ADVANCED" | string;
}

export interface ReplaceExperiencePayload {
  title: string;
  company?: string | null;
  employmentType?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  isCurrent?: boolean;
  description?: string | null;
}

export interface ReplaceEducationPayload {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear?: number | null;
  endYear?: number | null;
}

export async function fetchProfile(): Promise<ProfileResponse> {
  return apiFetch<ProfileResponse>("/me");
}

export async function updateProfile(
  payload: UpdateProfilePayload,
): Promise<ProfileResponse> {
  return apiFetch<ProfileResponse>("/me", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function updateProfilePhoto(
  payload: ProfilePhotoUpsertPayload,
): Promise<ProfileResponse> {
  return apiFetch<ProfileResponse>("/me/profile-photo", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function updateProfileSkills(
  skills: ReplaceSkillPayload[],
): Promise<ProfileResponse> {
  return apiFetch<ProfileResponse>("/me/skills", {
    method: "PUT",
    body: JSON.stringify({ skills }),
  });
}

export async function updateProfileExperience(
  experience: ReplaceExperiencePayload[],
): Promise<ProfileResponse> {
  return apiFetch<ProfileResponse>("/me/experience", {
    method: "PUT",
    body: JSON.stringify({ experience }),
  });
}

export async function updateProfileEducation(
  education: ReplaceEducationPayload[],
): Promise<ProfileResponse> {
  return apiFetch<ProfileResponse>("/me/education", {
    method: "PUT",
    body: JSON.stringify({ education }),
  });
}

export async function fetchActiveCVFile(): Promise<ActiveCVFileResponse> {
  return apiFetch<ActiveCVFileResponse>("/me/cv-files/active");
}

export async function uploadCVFile(
  cvFile: File,
  setAsActive = true,
): Promise<UploadCVFileResponse> {
  const formData = new FormData();
  formData.append("setAsActive", String(setAsActive));
  formData.append("cvFile", cvFile);

  return apiFetch<UploadCVFileResponse>("/me/cv-files", {
    method: "POST",
    body: formData,
  });
}

export async function analyzeCV(
  payload: AnalyzeCVPayload,
): Promise<CVAnalyzerResponse> {
  const formData = new FormData();

  if (payload.jobRoles.length === 0) {
    formData.append("jobRoles", "");
  } else {
    payload.jobRoles.forEach((role) => {
      formData.append("jobRoles", role);
    });
  }

  formData.append("language", payload.language ?? "id");
  formData.append("inputMode", "UPLOAD");
  formData.append("compareSource", "JOB_SEARCH");
  formData.append("persistResult", "false");

  if (payload.cvFileId) {
    formData.append("cvFileId", payload.cvFileId);
  }

  if (payload.cvFile) {
    formData.append("cvFile", payload.cvFile);
  }

  return apiFetch<CVAnalyzerResponse>("/ai/cv-analyzer", {
    method: "POST",
    body: formData,
  });
}

export async function fetchCVAnalyzerResults(
  params: CVAnalyzerResultsSearchParams = {},
): Promise<CVAnalyzerResultsResponse> {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      query.set(key, String(value));
    }
  });

  if (!query.has("page")) query.set("page", "1");
  if (!query.has("limit")) query.set("limit", "10");
  if (!query.has("sortBy")) query.set("sortBy", "analyzedAt");
  if (!query.has("sortOrder")) query.set("sortOrder", "desc");

  return apiFetch<CVAnalyzerResultsResponse>(
    `/ai/cv-analyzer/results?${query.toString()}`,
  );
}

export async function fetchCVAnalyzerResultDetail(
  resultId: string,
): Promise<CVAnalyzerResultDetailResponse> {
  return apiFetch<CVAnalyzerResultDetailResponse>(
    `/ai/cv-analyzer/results/${resultId}`,
  );
}

/* ─── User API ─── */
export async function updatePreferences(
  payload: PreferencesUpsertRequest,
): Promise<PreferencesResponse> {
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

export interface BookmarkSearchParams {
  page?: number;
  limit?: number;
  keyword?: string;
  sort?: string;
}

export async function fetchJobs(
  params: JobSearchParams = {},
): Promise<APIJobsResponse> {
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

export async function fetchJobDetail(
  jobId: string,
): Promise<APIJobDetailResponse> {
  return apiFetch<APIJobDetailResponse>(`/jobs/${jobId}`);
}

/* ─── Bookmarks API ─── */

export async function fetchBookmarks(
  params: BookmarkSearchParams = {},
): Promise<APIBookmarksResponse> {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  });

  if (!query.has("page")) query.set("page", "1");
  if (!query.has("limit")) query.set("limit", "20");
  if (!query.has("sort")) query.set("sort", "created_desc");

  return apiFetch<APIBookmarksResponse>(`/me/bookmarks?${query.toString()}`);
}

export async function createBookmark(
  jobId: string,
): Promise<CreateBookmarkResponse> {
  return apiFetch<CreateBookmarkResponse>("/me/bookmarks", {
    method: "POST",
    body: JSON.stringify({ jobId }),
  });
}

export async function deleteBookmark(
  jobId: string,
): Promise<DeleteBookmarkResponse> {
  return apiFetch<DeleteBookmarkResponse>(`/me/bookmarks/${jobId}`, {
    method: "DELETE",
  });
}

/* ─── Applications API ─── */

export async function fetchApplications(
  params: ApplicationsSearchParams = {},
): Promise<APIApplicationsResponse> {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  });

  if (!query.has("page")) query.set("page", "1");
  if (!query.has("limit")) query.set("limit", "20");
  if (!query.has("sort")) query.set("sort", "updated_desc");

  return apiFetch<APIApplicationsResponse>(
    `/me/applications?${query.toString()}`,
  );
}

export async function createApplication(
  payload: CreateApplicationPayload,
): Promise<CreateApplicationResponse> {
  return apiFetch<CreateApplicationResponse>("/me/applications", {
    method: "POST",
    body: JSON.stringify({
      status: "APPLIED",
      source: "EXTERNAL_APPLY_CLICK",
      ...payload,
    }),
  });
}

export async function updateApplicationStatus(
  applicationId: string,
  payload: UpdateApplicationStatusPayload,
): Promise<UpdateApplicationStatusResponse> {
  return apiFetch<UpdateApplicationStatusResponse>(
    `/me/applications/${applicationId}/status`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
}
