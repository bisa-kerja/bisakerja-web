"use client";

import { type ChangeEvent, type FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  FileText,
  Loader2,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  Upload,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  APIError,
  fetchActiveCVFile,
  fetchProfile,
  updateProfile,
  updateProfileEducation,
  updateProfileExperience,
  updateProfileSkills,
  uploadCVFile,
  type ActiveCVFile,
  type ProfileData,
} from "@/lib/api";
import {
  MailIcon,
  PhoneIcon,
} from "./_components/ProfileIcons";
import { ProfileShell, Skeleton } from "./_components/ProfileShell";

const EMPLOYMENT_TYPE_MAP: Record<string, string> = {
  FULL_TIME: "Full Time",
  PART_TIME: "Part Time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
  FREELANCE: "Freelance",
};

const SKILL_LEVEL_MAP: Record<string, string> = {
  BASIC: "Basic",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
};

const SKILL_LEVEL_STYLES: Record<string, string> = {
  BASIC: "bg-gray-100 text-gray-600",
  INTERMEDIATE: "bg-blue-50 text-blue-600",
  ADVANCED: "bg-green-50 text-green-700",
};

const SKILL_LEVEL_OPTIONS = ["BASIC", "INTERMEDIATE", "ADVANCED"] as const;
const EMPLOYMENT_TYPE_OPTIONS = [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERNSHIP",
  "FREELANCE",
] as const;

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-[14px] text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50 disabled:text-gray-400";
const labelClass = "text-[12px] font-bold uppercase tracking-wider text-gray-500";

type SaveSection = "account" | "skills" | "experience" | "education" | "cv";

interface AccountForm {
  username: string;
  phoneNumber: string;
  displayName: string;
}

interface SkillForm {
  key: string;
  name: string;
  level: string;
}

interface ExperienceForm {
  key: string;
  title: string;
  company: string;
  employmentType: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
}

interface EducationForm {
  key: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: string;
  endYear: string;
}

function makeKey(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function formatLabel(value: string | null | undefined) {
  if (!value) return "";
  return value
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
}

function formatDateRange(
  startDate: string | null,
  endDate: string | null,
  isCurrent: boolean,
): string {
  if (!startDate) return isCurrent ? "Present" : "-";

  const fmt = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  return `${fmt(startDate)} - ${isCurrent ? "Present" : endDate ? fmt(endDate) : ""}`;
}

function dateInputValue(date: string | null) {
  return date ? date.slice(0, 10) : "";
}

function numberOrNull(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatFileSize(sizeBytes: number | null | undefined) {
  if (!sizeBytes || sizeBytes <= 0) return "-";
  const units = ["B", "KB", "MB", "GB"];
  let size = sizeBytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function formatDateTime(value: string | null | undefined) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function emptySkill(): SkillForm {
  return {
    key: makeKey("skill"),
    name: "",
    level: "BASIC",
  };
}

function emptyExperience(): ExperienceForm {
  return {
    key: makeKey("experience"),
    title: "",
    company: "",
    employmentType: "INTERNSHIP",
    startDate: "",
    endDate: "",
    isCurrent: false,
    description: "",
  };
}

function emptyEducation(): EducationForm {
  return {
    key: makeKey("education"),
    institution: "",
    degree: "",
    fieldOfStudy: "",
    startYear: "",
    endYear: "",
  };
}

function syncAccountForm(profile: ProfileData): AccountForm {
  return {
    username: profile.username ?? "",
    phoneNumber: profile.phoneNumber ?? "",
    displayName: profile.displayName ?? "",
  };
}

function syncSkillForms(profile: ProfileData): SkillForm[] {
  return profile.skills.length > 0
    ? profile.skills.map((skill) => ({
      key: skill.id,
      name: skill.name ?? "",
      level: skill.level ?? "BASIC",
    }))
    : [emptySkill()];
}

function syncExperienceForms(profile: ProfileData): ExperienceForm[] {
  return profile.experience.length > 0
    ? profile.experience.map((experience) => ({
      key: experience.id,
      title: experience.title ?? "",
      company: experience.company ?? "",
      employmentType: experience.employmentType ?? "INTERNSHIP",
      startDate: dateInputValue(experience.startDate),
      endDate: dateInputValue(experience.endDate),
      isCurrent: experience.isCurrent,
      description: experience.description ?? "",
    }))
    : [emptyExperience()];
}

function syncEducationForms(profile: ProfileData): EducationForm[] {
  return profile.education.length > 0
    ? profile.education.map((education) => ({
      key: education.id,
      institution: education.institution ?? "",
      degree: education.degree ?? "",
      fieldOfStudy: education.fieldOfStudy ?? "",
      startYear: education.startYear ? String(education.startYear) : "",
      endYear: education.endYear ? String(education.endYear) : "",
    }))
    : [emptyEducation()];
}

function SectionHeader({
  title,
  saving,
  saved,
  onReset,
}: {
  title: string;
  saving: boolean;
  saved: boolean;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
      <div>
        <h2 className="text-[18px] font-bold text-gray-900">{title}</h2>
        {saved && (
          <p className="mt-1 inline-flex items-center gap-1.5 text-[13px] font-semibold text-green-700">
            <CheckCircle2 className="h-4 w-4" />
            Saved
          </p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onReset}
          disabled={saving}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-60"
          aria-label="Reset section"
          title="Reset section"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0066FF] px-4 py-2.5 text-[14px] font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="space-y-1.5">
      <span className={labelClass}>{label}</span>
      {children}
    </label>
  );
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [activeCVFile, setActiveCVFile] = useState<ActiveCVFile | null>(null);
  const [accountForm, setAccountForm] = useState<AccountForm>({
    username: "",
    phoneNumber: "",
    displayName: "",
  });
  const [skillForms, setSkillForms] = useState<SkillForm[]>([emptySkill()]);
  const [experienceForms, setExperienceForms] = useState<ExperienceForm[]>([
    emptyExperience(),
  ]);
  const [educationForms, setEducationForms] = useState<EducationForm[]>([
    emptyEducation(),
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCVLoading, setIsCVLoading] = useState(true);
  const [savingSection, setSavingSection] = useState<SaveSection | null>(null);
  const [savedSection, setSavedSection] = useState<SaveSection | null>(null);
  const [error, setError] = useState<string | null>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const applyProfile = (nextProfile: ProfileData) => {
    setProfile(nextProfile);
    setAccountForm(syncAccountForm(nextProfile));
    setSkillForms(syncSkillForms(nextProfile));
    setExperienceForms(syncExperienceForms(nextProfile));
    setEducationForms(syncEducationForms(nextProfile));
  };

  useEffect(() => {
    fetchProfile()
      .then((res) => applyProfile(res.data))
      .catch((err: unknown) => {
        if (err instanceof APIError && err.status === 401) {
          router.push("/login");
        } else {
          setError(err instanceof Error ? err.message : "Failed to load profile");
        }
      })
      .finally(() => setIsLoading(false));
  }, [router]);

  useEffect(() => {
    fetchActiveCVFile()
      .then((res) => setActiveCVFile(res.data?.cvFile ?? null))
      .catch((err: unknown) => {
        if (err instanceof APIError && err.status === 401) {
          router.push("/login");
        }
      })
      .finally(() => setIsCVLoading(false));
  }, [router]);

  const handleSaveError = (err: unknown) => {
    if (err instanceof APIError && err.status === 401) {
      router.push("/login");
      return;
    }
    setError(err instanceof Error ? err.message : "Failed to save profile");
  };

  const startSaving = (section: SaveSection) => {
    setSavingSection(section);
    setSavedSection(null);
    setError(null);
  };

  const finishSaving = (section: SaveSection, nextProfile: ProfileData) => {
    applyProfile(nextProfile);
    setSavedSection(section);
  };

  const saveAccount = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startSaving("account");
    try {
      const res = await updateProfile({
        username: accountForm.username.trim(),
        phoneNumber: accountForm.phoneNumber.trim(),
        displayName: accountForm.displayName.trim(),
      });
      finishSaving("account", res.data);
    } catch (err) {
      handleSaveError(err);
    } finally {
      setSavingSection(null);
    }
  };

  const saveSkills = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startSaving("skills");
    try {
      const res = await updateProfileSkills(
        skillForms
          .map((skill) => ({
            name: skill.name.trim(),
            level: skill.level,
          }))
          .filter((skill) => skill.name.length > 0),
      );
      finishSaving("skills", res.data);
    } catch (err) {
      handleSaveError(err);
    } finally {
      setSavingSection(null);
    }
  };

  const saveExperience = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startSaving("experience");
    try {
      const res = await updateProfileExperience(
        experienceForms
          .map((experience) => ({
            title: experience.title.trim(),
            company: experience.company.trim() || null,
            employmentType: experience.employmentType || null,
            startDate: experience.startDate || null,
            endDate: experience.isCurrent ? null : experience.endDate || null,
            isCurrent: experience.isCurrent,
            description: experience.description.trim() || null,
          }))
          .filter((experience) => experience.title.length > 0),
      );
      finishSaving("experience", res.data);
    } catch (err) {
      handleSaveError(err);
    } finally {
      setSavingSection(null);
    }
  };

  const saveEducation = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startSaving("education");
    try {
      const res = await updateProfileEducation(
        educationForms
          .map((education) => ({
            institution: education.institution.trim(),
            degree: education.degree.trim(),
            fieldOfStudy: education.fieldOfStudy.trim(),
            startYear: numberOrNull(education.startYear),
            endYear: numberOrNull(education.endYear),
          }))
          .filter(
            (education) =>
              education.institution.length > 0 &&
              education.degree.length > 0 &&
              education.fieldOfStudy.length > 0,
          ),
      );
      finishSaving("education", res.data);
    } catch (err) {
      handleSaveError(err);
    } finally {
      setSavingSection(null);
    }
  };

  const uploadActiveCV = async (file: File) => {
    if (!file) return;

    startSaving("cv");
    try {
      const res = await uploadCVFile(file, true);
      setActiveCVFile(res.data?.cvFile ?? null);
      setSavedSection("cv");
    } catch (err) {
      if (err instanceof APIError && err.status === 401) {
        router.push("/login");
        return;
      }

      setError(err instanceof Error ? err.message : "Failed to upload CV");
    } finally {
      setSavingSection(null);
      if (cvInputRef.current) cvInputRef.current.value = "";
    }
  };

  const handleCVFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    void uploadActiveCV(file);
  };

  const avatarUrl =
    profile?.profilePhoto?.url ??
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
      profile?.username ?? "user",
    )}&backgroundColor=F0F5FF`;

  return (
    <ProfileShell
      activeSection="profile"
      title="Profile Settings"
      description="Manage your public profile, career preferences, and account security."
    >
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-[14px] text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[340px_1fr]">
        <div className="space-y-6 lg:sticky lg:top-20">
          <div className="rounded-xl border border-gray-100 bg-white p-8 text-center shadow-sm">
            {isLoading ? (
              <div className="flex flex-col items-center">
                <Skeleton className="mb-5 h-24 w-24 rounded-2xl" />
                <Skeleton className="mb-2 h-6 w-40" />
                <Skeleton className="mb-8 h-4 w-32" />
                <div className="w-full space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="mt-8 h-10 w-full" />
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="relative mb-5">
                  <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border border-gray-100 bg-[#F0F5FF]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={avatarUrl}
                      alt={profile?.displayName ?? "Profile photo"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>

                <h2 className="text-[22px] font-bold text-gray-900">
                  {profile?.username ?? "-"}
                </h2>

                <div className="mt-8 w-full space-y-4 text-left">
                  <div className="flex items-start gap-3 text-gray-600">
                    <MailIcon className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" />
                    <div>
                      <p className={labelClass}>Email Address</p>
                      <p className="mt-1 text-[14px] font-medium text-gray-900">
                        {profile?.email ?? "-"}
                        {profile?.emailVerified && (
                          <span className="ml-2 inline-flex items-center rounded bg-green-50 px-1.5 py-0.5 text-[11px] font-semibold text-green-600">
                            Verified
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-gray-600">
                    <PhoneIcon className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" />
                    <div>
                      <p className={labelClass}>Phone Number</p>
                      <p className="mt-1 text-[14px] font-medium text-gray-900">
                        {profile?.phoneNumber ?? "-"}
                      </p>
                    </div>
                  </div>
                </div>

                <button className="mt-8 w-full rounded-lg border border-gray-200 bg-white py-2.5 text-[14px] font-bold text-gray-700 transition-colors hover:bg-gray-50">
                  Change Password
                </button>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-[18px] font-bold text-gray-900">Your CV</h2>
                {savedSection === "cv" && (
                  <p className="mt-1 inline-flex items-center gap-1.5 text-[13px] font-semibold text-green-700">
                    <CheckCircle2 className="h-4 w-4" />
                    Updated
                  </p>
                )}
              </div>
            </div>

            {isCVLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-20 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
                <Link
                  href="/ai-cv-analyzer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-[14px] font-bold text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <FileText className="h-4 w-4" />
                  Open Analyzer
                </Link>
              </div>
            ) : activeCVFile ? (
              <div className="space-y-5">
                <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-bold text-gray-900">
                        {activeCVFile.originalFileName}
                      </p>
                      <p className="mt-1 text-[12px] text-gray-500">
                        {activeCVFile.mimeType} - {formatFileSize(activeCVFile.sizeBytes)}
                      </p>
                    </div>
                  </div>
                  <dl className="mt-4 grid grid-cols-2 gap-3 text-left">
                    <div>
                      <dt className={labelClass}>Uploaded</dt>
                      <dd className="mt-1 text-[13px] font-semibold text-gray-800">
                        {formatDateTime(activeCVFile.uploadedAt)}
                      </dd>
                    </div>
                    <div>
                      <dt className={labelClass}>Expires</dt>
                      <dd className="mt-1 text-[13px] font-semibold text-gray-800">
                        {formatDateTime(activeCVFile.expiresAt)}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="grid gap-2">
                  <button
                    type="button"
                    onClick={() => cvInputRef.current?.click()}
                    disabled={savingSection === "cv"}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-[14px] font-bold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {savingSection === "cv" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    Replace CV
                  </button>
                  <Link
                    href="/ai-cv-analyzer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0066FF] px-4 py-2.5 text-[14px] font-bold text-white transition-colors hover:bg-blue-700"
                  >
                    <FileText className="h-4 w-4" />
                    Analyze CV
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-5 text-center">
                  <FileText className="mx-auto h-8 w-8 text-gray-300" />
                  <p className="mt-3 text-[14px] font-bold text-gray-800">
                    No active CV yet
                  </p>
                  <p className="mt-1 text-[13px] leading-relaxed text-gray-500">
                    Upload a CV to keep it ready for analysis and applications.
                  </p>
                </div>
                <div className="grid gap-2">
                  <button
                    type="button"
                    onClick={() => cvInputRef.current?.click()}
                    disabled={savingSection === "cv"}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0066FF] px-4 py-2.5 text-[14px] font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {savingSection === "cv" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    Upload CV
                  </button>
                  <Link
                    href="/ai-cv-analyzer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-[14px] font-bold text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <FileText className="h-4 w-4" />
                    Open Analyzer
                  </Link>
                </div>
              </div>
            )}

            <input
              ref={cvInputRef}
              type="file"
              className="hidden"
              accept=".pdf"
              onChange={handleCVFileChange}
            />
          </div>
        </div>

        <div className="space-y-6">
          {isLoading ? (
            <>
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm"
                >
                  <Skeleton className="mb-6 h-5 w-48" />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Skeleton className="h-11 w-full" />
                    <Skeleton className="h-11 w-full" />
                    <Skeleton className="h-11 w-full sm:col-span-2" />
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              <form
                onSubmit={saveAccount}
                className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm"
              >
                <SectionHeader
                  title="Account Details"
                  saving={savingSection === "account"}
                  saved={savedSection === "account"}
                  onReset={() => profile && setAccountForm(syncAccountForm(profile))}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Display Name">
                    <input
                      className={inputClass}
                      value={accountForm.displayName}
                      onChange={(event) =>
                        setAccountForm((form) => ({
                          ...form,
                          displayName: event.target.value,
                        }))
                      }
                      maxLength={80}
                      required
                    />
                  </Field>
                  <Field label="Username">
                    <input
                      className={inputClass}
                      value={accountForm.username}
                      onChange={(event) =>
                        setAccountForm((form) => ({
                          ...form,
                          username: event.target.value.toLowerCase(),
                        }))
                      }
                      minLength={3}
                      maxLength={30}
                      pattern="^[a-z0-9_]+$"
                      required
                    />
                  </Field>
                  <Field label="Phone Number">
                    <input
                      className={inputClass}
                      value={accountForm.phoneNumber}
                      onChange={(event) =>
                        setAccountForm((form) => ({
                          ...form,
                          phoneNumber: event.target.value,
                        }))
                      }
                      minLength={8}
                      maxLength={20}
                      pattern="^\+?62[0-9]{7,16}$"
                      required
                    />
                  </Field>
                  <Field label="Email">
                    <input
                      className={inputClass}
                      value={profile?.email ?? ""}
                      disabled
                    />
                  </Field>
                </div>
              </form>

              <form
                onSubmit={saveSkills}
                className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm"
              >
                <SectionHeader
                  title="Top Skills"
                  saving={savingSection === "skills"}
                  saved={savedSection === "skills"}
                  onReset={() => profile && setSkillForms(syncSkillForms(profile))}
                />
                <div className="mb-5 flex flex-wrap gap-2.5">
                  {profile?.skills && profile.skills.length > 0 ? (
                    profile.skills.map((skill) => {
                      const skillLevel = skill.level ?? "";

                      return (
                        <span
                          key={skill.id}
                          className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-medium ${SKILL_LEVEL_STYLES[skillLevel] ??
                            "bg-gray-100 text-gray-600"
                            }`}
                        >
                          {skill.name}
                          {skillLevel && (
                            <span className="text-[11px] font-semibold uppercase tracking-wide opacity-70">
                              {SKILL_LEVEL_MAP[skillLevel] ??
                                formatLabel(skillLevel)}
                            </span>
                          )}
                        </span>
                      );
                    })
                  ) : (
                    <p className="text-[14px] text-gray-400">No skills added yet.</p>
                  )}
                </div>
                <div className="space-y-3">
                  {skillForms.map((skill, index) => (
                    <div
                      key={skill.key}
                      className="grid gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3 sm:grid-cols-[1fr_180px_auto]"
                    >
                      <input
                        className={inputClass}
                        value={skill.name}
                        onChange={(event) =>
                          setSkillForms((forms) =>
                            forms.map((item, itemIndex) =>
                              itemIndex === index
                                ? { ...item, name: event.target.value }
                                : item,
                            ),
                          )
                        }
                        placeholder="Skill name"
                      />
                      <select
                        className={inputClass}
                        value={skill.level}
                        onChange={(event) =>
                          setSkillForms((forms) =>
                            forms.map((item, itemIndex) =>
                              itemIndex === index
                                ? { ...item, level: event.target.value }
                                : item,
                            ),
                          )
                        }
                      >
                        {SKILL_LEVEL_OPTIONS.map((level) => (
                          <option key={level} value={level}>
                            {SKILL_LEVEL_MAP[level]}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() =>
                          setSkillForms((forms) =>
                            forms.length > 1
                              ? forms.filter((_, itemIndex) => itemIndex !== index)
                              : [emptySkill()],
                          )
                        }
                        className="flex h-11 w-11 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                        aria-label="Remove skill"
                        title="Remove skill"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setSkillForms((forms) => [...forms, emptySkill()])}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-[13px] font-bold text-gray-700 hover:bg-gray-50"
                >
                  <Plus className="h-4 w-4" />
                  Add skill
                </button>
              </form>

              <form
                onSubmit={saveExperience}
                className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm"
              >
                <SectionHeader
                  title="Experience"
                  saving={savingSection === "experience"}
                  saved={savedSection === "experience"}
                  onReset={() =>
                    profile && setExperienceForms(syncExperienceForms(profile))
                  }
                />
                <div className="mb-6 space-y-6">
                  {profile?.experience && profile.experience.length > 0 ? (
                    profile.experience.map((experience, index) => (
                      <div
                        key={experience.id}
                        className={index !== 0 ? "border-t border-gray-100 pt-6" : ""}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-[15px] font-bold text-gray-900">
                              {experience.title}
                            </p>
                            <p className="mt-0.5 text-[14px] text-gray-600">
                              {experience.company ?? "-"}
                              {experience.employmentType && (
                                <span className="ml-2 text-[12px] text-gray-400">
                                  - {EMPLOYMENT_TYPE_MAP[experience.employmentType] ??
                                    formatLabel(experience.employmentType)}
                                </span>
                              )}
                            </p>
                          </div>
                          <p className="whitespace-nowrap text-[12px] text-gray-400">
                            {formatDateRange(
                              experience.startDate,
                              experience.endDate,
                              experience.isCurrent,
                            )}
                          </p>
                        </div>
                        {experience.description && (
                          <p className="mt-2 text-[13px] leading-relaxed text-gray-500">
                            {experience.description}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-[14px] text-gray-400">
                      No experience added yet.
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  {experienceForms.map((experience, index) => (
                    <div
                      key={experience.key}
                      className="rounded-lg border border-gray-100 bg-gray-50 p-4"
                    >
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <p className="text-[14px] font-bold text-gray-700">
                          Experience {index + 1}
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            setExperienceForms((forms) =>
                              forms.length > 1
                                ? forms.filter((_, itemIndex) => itemIndex !== index)
                                : [emptyExperience()],
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                          aria-label="Remove experience"
                          title="Remove experience"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Title">
                          <input
                            className={inputClass}
                            value={experience.title}
                            onChange={(event) =>
                              setExperienceForms((forms) =>
                                forms.map((item, itemIndex) =>
                                  itemIndex === index
                                    ? { ...item, title: event.target.value }
                                    : item,
                                ),
                              )
                            }
                            maxLength={120}
                            placeholder="Backend Developer Intern"
                          />
                        </Field>
                        <Field label="Company">
                          <input
                            className={inputClass}
                            value={experience.company}
                            onChange={(event) =>
                              setExperienceForms((forms) =>
                                forms.map((item, itemIndex) =>
                                  itemIndex === index
                                    ? { ...item, company: event.target.value }
                                    : item,
                                ),
                              )
                            }
                            maxLength={120}
                            placeholder="Example Tech"
                          />
                        </Field>
                        <Field label="Employment Type">
                          <select
                            className={inputClass}
                            value={experience.employmentType}
                            onChange={(event) =>
                              setExperienceForms((forms) =>
                                forms.map((item, itemIndex) =>
                                  itemIndex === index
                                    ? { ...item, employmentType: event.target.value }
                                    : item,
                                ),
                              )
                            }
                          >
                            {EMPLOYMENT_TYPE_OPTIONS.map((type) => (
                              <option key={type} value={type}>
                                {EMPLOYMENT_TYPE_MAP[type]}
                              </option>
                            ))}
                          </select>
                        </Field>
                        <Field label="Start Date">
                          <input
                            className={inputClass}
                            type="date"
                            value={experience.startDate}
                            onChange={(event) =>
                              setExperienceForms((forms) =>
                                forms.map((item, itemIndex) =>
                                  itemIndex === index
                                    ? { ...item, startDate: event.target.value }
                                    : item,
                                ),
                              )
                            }
                          />
                        </Field>
                        <Field label="End Date">
                          <input
                            className={inputClass}
                            type="date"
                            value={experience.endDate}
                            disabled={experience.isCurrent}
                            onChange={(event) =>
                              setExperienceForms((forms) =>
                                forms.map((item, itemIndex) =>
                                  itemIndex === index
                                    ? { ...item, endDate: event.target.value }
                                    : item,
                                ),
                              )
                            }
                          />
                        </Field>
                        <label className="flex items-center gap-2 pt-7 text-[14px] font-semibold text-gray-700">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-blue-600"
                            checked={experience.isCurrent}
                            onChange={(event) =>
                              setExperienceForms((forms) =>
                                forms.map((item, itemIndex) =>
                                  itemIndex === index
                                    ? {
                                      ...item,
                                      isCurrent: event.target.checked,
                                      endDate: event.target.checked
                                        ? ""
                                        : item.endDate,
                                    }
                                    : item,
                                ),
                              )
                            }
                          />
                          Current role
                        </label>
                        <Field label="Description">
                          <textarea
                            className={`${inputClass} min-h-24 resize-y sm:col-span-2`}
                            value={experience.description}
                            onChange={(event) =>
                              setExperienceForms((forms) =>
                                forms.map((item, itemIndex) =>
                                  itemIndex === index
                                    ? { ...item, description: event.target.value }
                                    : item,
                                ),
                              )
                            }
                            maxLength={2000}
                            placeholder="Built REST APIs with TypeScript."
                          />
                        </Field>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setExperienceForms((forms) => [...forms, emptyExperience()])
                  }
                  className="mt-4 inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-[13px] font-bold text-gray-700 hover:bg-gray-50"
                >
                  <Plus className="h-4 w-4" />
                  Add experience
                </button>
              </form>

              <form
                onSubmit={saveEducation}
                className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm"
              >
                <SectionHeader
                  title="Education"
                  saving={savingSection === "education"}
                  saved={savedSection === "education"}
                  onReset={() =>
                    profile && setEducationForms(syncEducationForms(profile))
                  }
                />
                <div className="mb-6 space-y-6">
                  {profile?.education && profile.education.length > 0 ? (
                    profile.education.map((education, index) => (
                      <div
                        key={education.id}
                        className={index !== 0 ? "border-t border-gray-100 pt-6" : ""}
                      >
                        <p className="text-[15px] font-bold text-gray-900">
                          {education.institution}
                        </p>
                        <p className="mt-0.5 text-[14px] text-gray-600">
                          {education.degree ?? "-"}
                          {education.fieldOfStudy
                            ? `, ${education.fieldOfStudy}`
                            : ""}
                        </p>
                        <p className="mt-0.5 text-[12px] text-gray-400">
                          {education.startYear ?? "-"} -{" "}
                          {education.endYear ?? "Sekarang"}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-[14px] text-gray-400">No education added yet.</p>
                  )}
                </div>

                <div className="space-y-4">
                  {educationForms.map((education, index) => (
                    <div
                      key={education.key}
                      className="rounded-lg border border-gray-100 bg-gray-50 p-4"
                    >
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <p className="text-[14px] font-bold text-gray-700">
                          Education {index + 1}
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            setEducationForms((forms) =>
                              forms.length > 1
                                ? forms.filter((_, itemIndex) => itemIndex !== index)
                                : [emptyEducation()],
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                          aria-label="Remove education"
                          title="Remove education"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Institution">
                          <input
                            className={inputClass}
                            value={education.institution}
                            onChange={(event) =>
                              setEducationForms((forms) =>
                                forms.map((item, itemIndex) =>
                                  itemIndex === index
                                    ? { ...item, institution: event.target.value }
                                    : item,
                                ),
                              )
                            }
                            maxLength={160}
                            placeholder="Universitas Contoh"
                          />
                        </Field>
                        <Field label="Degree">
                          <input
                            className={inputClass}
                            value={education.degree}
                            onChange={(event) =>
                              setEducationForms((forms) =>
                                forms.map((item, itemIndex) =>
                                  itemIndex === index
                                    ? { ...item, degree: event.target.value }
                                    : item,
                                ),
                              )
                            }
                            maxLength={120}
                            placeholder="Bachelor"
                          />
                        </Field>
                        <Field label="Field of Study">
                          <input
                            className={inputClass}
                            value={education.fieldOfStudy}
                            onChange={(event) =>
                              setEducationForms((forms) =>
                                forms.map((item, itemIndex) =>
                                  itemIndex === index
                                    ? { ...item, fieldOfStudy: event.target.value }
                                    : item,
                                ),
                              )
                            }
                            maxLength={160}
                            placeholder="Informatics"
                          />
                        </Field>
                        <div className="grid grid-cols-2 gap-3">
                          <Field label="Start Year">
                            <input
                              className={inputClass}
                              type="number"
                              min={1900}
                              max={2100}
                              value={education.startYear}
                              onChange={(event) =>
                                setEducationForms((forms) =>
                                  forms.map((item, itemIndex) =>
                                    itemIndex === index
                                      ? { ...item, startYear: event.target.value }
                                      : item,
                                  ),
                                )
                              }
                              placeholder="2021"
                            />
                          </Field>
                          <Field label="End Year">
                            <input
                              className={inputClass}
                              type="number"
                              min={1900}
                              max={2100}
                              value={education.endYear}
                              onChange={(event) =>
                                setEducationForms((forms) =>
                                  forms.map((item, itemIndex) =>
                                    itemIndex === index
                                      ? { ...item, endYear: event.target.value }
                                      : item,
                                  ),
                                )
                              }
                              placeholder="2025"
                            />
                          </Field>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setEducationForms((forms) => [...forms, emptyEducation()])
                  }
                  className="mt-4 inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-[13px] font-bold text-gray-700 hover:bg-gray-50"
                >
                  <Plus className="h-4 w-4" />
                  Add education
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </ProfileShell>
  );
}
