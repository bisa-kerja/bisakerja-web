"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import JobCard from "@/components/JobCard";
import {
  fetchApplications,
  fetchBookmarks,
  fetchProfile,
  updateApplicationStatus,
  type APIApplication,
  type APIBookmark,
  type APIPagination,
  type ApplicationStatus,
  type ProfileData,
  APIError,
} from "@/lib/api";
import { useAuth } from "@/lib/auth";

/* ─── Helpers ─── */

const CAREER_STATUS_MAP: Record<string, string> = {
  FRESH_GRADUATE: "Fresh Graduate",
  EARLY_CAREER: "Early Career",
  CAREER_SWITCHER: "Career Switcher",
};

const EMPLOYMENT_TYPE_MAP: Record<string, string> = {
  FULL_TIME: "Full Time",
  PART_TIME: "Part Time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
  FREELANCE: "Freelance",
};

const SKILL_LEVEL_STYLES: Record<string, string> = {
  BEGINNER: "bg-gray-100 text-gray-600",
  INTERMEDIATE: "bg-blue-50 text-blue-600",
  ADVANCED: "bg-purple-50 text-purple-600",
  EXPERT: "bg-green-50 text-green-700",
};

const APPLICATION_STATUSES: ApplicationStatus[] = [
  "APPLIED",
  "SCREENING",
  "INTERVIEW",
  "OFFER",
  "ACCEPTED",
  "REJECTED",
  "WITHDRAWN",
];

const APPLICATION_STATUS_LABELS: Record<string, string> = {
  APPLIED: "Applied",
  SCREENING: "Screening",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
};

const APPLICATION_STATUS_STYLES: Record<string, string> = {
  APPLIED: "bg-[#E8F0FE] text-[#0066FF]",
  SCREENING: "bg-purple-50 text-purple-700",
  INTERVIEW: "bg-amber-50 text-amber-700",
  OFFER: "bg-cyan-50 text-cyan-700",
  ACCEPTED: "bg-[#DCFCE7] text-[#16A34A]",
  REJECTED: "bg-[#FEE2E2] text-[#DC2626]",
  WITHDRAWN: "bg-[#F3F4F6] text-gray-600",
};

function formatDateRange(
  startDate: string,
  endDate: string | null,
  isCurrent: boolean,
): string {
  const fmt = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString("id-ID", {
      month: "short",
      year: "numeric",
    });
  };
  return `${fmt(startDate)} – ${isCurrent ? "Sekarang" : endDate ? fmt(endDate) : ""}`;
}

function formatApplicationDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getCompanyInitials(companyName: string): string {
  return companyName
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .substring(0, 3)
    .toUpperCase();
}

/* ─── Icons ─── */

function UserIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function FileTextIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  );
}

function BookmarkIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
    </svg>
  );
}

function CreditCardIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  );
}

function HelpCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" x2="12.01" y1="17" y2="17" />
    </svg>
  );
}

function LogOutIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  );
}

function CameraIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function BriefcaseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="7" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function GraduationCapIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}

/* ─── Skeleton helpers ─── */

function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

/* ─── Main Component ─── */

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookmarks, setBookmarks] = useState<APIBookmark[]>([]);
  const [bookmarkPagination, setBookmarkPagination] =
    useState<APIPagination | null>(null);
  const [isBookmarksLoading, setIsBookmarksLoading] = useState(true);
  const [bookmarkError, setBookmarkError] = useState<string | null>(null);
  const [bookmarkSearchInput, setBookmarkSearchInput] = useState("");
  const [bookmarkKeyword, setBookmarkKeyword] = useState("");
  const [bookmarkPage, setBookmarkPage] = useState(1);
  const [applications, setApplications] = useState<APIApplication[]>([]);
  const [applicationPagination, setApplicationPagination] =
    useState<APIPagination | null>(null);
  const [isApplicationsLoading, setIsApplicationsLoading] = useState(true);
  const [applicationError, setApplicationError] = useState<string | null>(null);
  const [applicationSearchInput, setApplicationSearchInput] = useState("");
  const [applicationKeyword, setApplicationKeyword] = useState("");
  const [applicationPage, setApplicationPage] = useState(1);
  const [updatingApplicationId, setUpdatingApplicationId] = useState<
    string | null
  >(null);

  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchProfile()
      .then((res) => setProfile(res.data))
      .catch((err: unknown) => {
        if (err instanceof APIError && err.status === 401) {
          router.push("/login");
        } else {
          setError(err instanceof Error ? err.message : "Gagal memuat profil");
        }
      })
      .finally(() => setIsLoading(false));
  }, [router]);

  const loadBookmarks = useCallback(async () => {
    await Promise.resolve();
    setIsBookmarksLoading(true);
    setBookmarkError(null);

    try {
      const res = await fetchBookmarks({
        page: bookmarkPage,
        limit: 20,
        keyword: bookmarkKeyword,
        sort: "created_desc",
      });
      setBookmarks(res.data);
      setBookmarkPagination(res.meta.pagination);
    } catch (err: unknown) {
      if (err instanceof APIError && err.status === 401) {
        router.push("/login");
      } else {
        setBookmarkError(
          err instanceof Error ? err.message : "Gagal memuat bookmark",
        );
      }
    } finally {
      setIsBookmarksLoading(false);
    }
  }, [bookmarkKeyword, bookmarkPage, router]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadBookmarks();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadBookmarks]);

  const loadApplications = useCallback(async () => {
    await Promise.resolve();
    setIsApplicationsLoading(true);
    setApplicationError(null);

    try {
      const res = await fetchApplications({
        page: applicationPage,
        limit: 20,
        keyword: applicationKeyword,
        sort: "updated_desc",
      });
      setApplications(res.data);
      setApplicationPagination(res.meta.pagination);
    } catch (err: unknown) {
      if (err instanceof APIError && err.status === 401) {
        router.push("/login");
      } else {
        setApplicationError(
          err instanceof Error ? err.message : "Gagal memuat lamaran",
        );
      }
    } finally {
      setIsApplicationsLoading(false);
    }
  }, [applicationKeyword, applicationPage, router]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadApplications();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadApplications]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const handleBookmarkSearch = () => {
    setBookmarkKeyword(bookmarkSearchInput.trim());
    setBookmarkPage(1);
  };

  const handleApplicationSearch = () => {
    setApplicationKeyword(applicationSearchInput.trim());
    setApplicationPage(1);
  };

  const handleApplicationStatusChange = async (
    application: APIApplication,
    status: ApplicationStatus,
  ) => {
    if (updatingApplicationId) return;

    const previousApplications = applications;
    setUpdatingApplicationId(application.id);
    setApplicationError(null);
    setApplications((current) =>
      current.map((item) =>
        item.id === application.id
          ? { ...item, status, updatedAt: new Date().toISOString() }
          : item,
      ),
    );

    try {
      const response = await updateApplicationStatus(application.id, {
        status,
        notes: application.notes ?? undefined,
      });
      setApplications((current) =>
        current.map((item) =>
          item.id === application.id ? response.data : item,
        ),
      );
    } catch (err: unknown) {
      setApplications(previousApplications);
      if (err instanceof APIError && err.status === 401) {
        router.push("/login");
      } else {
        setApplicationError(
          err instanceof Error ? err.message : "Gagal memperbarui status",
        );
      }
    } finally {
      setUpdatingApplicationId(null);
    }
  };

  const avatarUrl =
    profile?.profilePhoto?.url ??
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profile?.username ?? "user")}&backgroundColor=F0F5FF`;

  const displayRole =
    (profile?.profile?.latestRole ?? profile?.profile?.careerStatus)
      ? (CAREER_STATUS_MAP[profile?.profile?.careerStatus ?? ""] ??
        profile?.profile?.careerStatus)
      : "—";

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <div className="flex flex-1 border-t border-gray-100">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0 bg-[#F9FAFB] border-r border-gray-100 flex flex-col hidden lg:flex">

          <nav className="flex-1 px-4 py-4 space-y-1">
            <Link
              href="/profile"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-50 text-blue-600 font-medium text-[14px]"
            >
              <UserIcon className="w-5 h-5" />
              Profile Settings
            </Link>
            <Link
              href="#applications"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 font-medium text-[14px]"
            >
              <FileTextIcon className="w-5 h-5" />
              My Applications
            </Link>
            <Link
              href="#saved-jobs"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 font-medium text-[14px]"
            >
              <BookmarkIcon className="w-5 h-5" />
              Saved Jobs
            </Link>
          </nav>

          <div className="p-4 space-y-4">
            <div className="space-y-1">
              <Link
                href="#"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 font-medium text-[14px]"
              >
                <HelpCircleIcon className="w-5 h-5" />
                Help Center
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 font-medium text-[14px]"
              >
                <LogOutIcon className="w-5 h-5" />
                Log out
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-[#F4F5F7] p-6 sm:p-8 lg:p-10 pb-16">
          <div className="max-w-5xl mx-auto">
            <header className="mb-8">
              <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">
                Profile Settings
              </h1>
              <p className="text-gray-500 mt-2 text-[15px]">
                Manage your public profile, career preferences, and account
                security.
              </p>
            </header>

            {/* Error banner */}
            {error && (
              <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-5 py-4 text-[14px] text-red-700">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 items-start">
              {/* Left Column: User Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center">
                {isLoading ? (
                  <>
                    <Skeleton className="w-24 h-24 rounded-2xl mb-5" />
                    <Skeleton className="h-6 w-40 mb-2" />
                    <Skeleton className="h-4 w-32 mb-8" />
                    <div className="w-full space-y-4">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <Skeleton className="h-10 w-full mt-8" />
                  </>
                ) : (
                  <>
                    <div className="relative mb-5">
                      <div className="w-24 h-24 rounded-2xl bg-[#F0F5FF] flex items-center justify-center overflow-hidden border border-gray-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={avatarUrl}
                          alt={profile?.displayName ?? "Profile photo"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button className="absolute -bottom-2 -right-2 w-[34px] h-[34px] bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">
                        <CameraIcon className="w-4 h-4" />
                      </button>
                    </div>

                    <h2 className="text-[22px] font-bold text-gray-900">
                      {profile?.displayName ?? "—"}
                    </h2>
                    <span className="text-[#0066FF] text-[15px] font-medium mt-1">
                      {profile?.profile?.latestRole ?? displayRole}
                    </span>

                    {/* Summary */}
                    {profile?.profile?.summary && (
                      <p className="mt-4 text-[13px] text-gray-500 leading-relaxed text-left">
                        {profile.profile.summary}
                      </p>
                    )}

                    <div className="w-full mt-8 space-y-4 text-left">
                      <div className="flex gap-3 text-gray-600 items-start">
                        <MailIcon className="w-5 h-5 shrink-0 mt-0.5 text-gray-400" />
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                            Email Address
                          </p>
                          <p className="text-[14px] text-gray-900 font-medium mt-1">
                            {profile?.email ?? "—"}
                            {profile?.emailVerified && (
                              <span className="ml-2 inline-flex items-center text-[11px] text-green-600 font-semibold bg-green-50 px-1.5 py-0.5 rounded">
                                Verified
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3 text-gray-600 items-start">
                        <PhoneIcon className="w-5 h-5 shrink-0 mt-0.5 text-gray-400" />
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                            Phone Number
                          </p>
                          <p className="text-[14px] text-gray-900 font-medium mt-1">
                            {profile?.phoneNumber ?? "—"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <button className="w-full mt-8 bg-white border border-gray-200 text-gray-700 font-bold text-[14px] py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                      Change Password
                    </button>
                  </>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Skills Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                  <h2 className="text-[18px] font-bold text-gray-900 mb-6">
                    Top Skills
                  </h2>

                  {isLoading ? (
                    <div className="flex flex-wrap gap-2.5">
                      {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-7 w-24 rounded-full" />
                      ))}
                    </div>
                  ) : profile?.skills && profile.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2.5">
                      {profile.skills.map((skill) => (
                        <span
                          key={skill.id}
                          className={`inline-flex items-center gap-2 text-[13px] font-medium px-3.5 py-1.5 rounded-full ${
                            SKILL_LEVEL_STYLES[skill.level] ??
                            "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {skill.name}
                          <span className="text-[11px] font-semibold opacity-70 uppercase tracking-wide">
                            {skill.level.charAt(0) +
                              skill.level.slice(1).toLowerCase()}
                          </span>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[14px] text-gray-400">
                      No skills added yet.
                    </p>
                  )}
                </div>

                {/* Experience Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                  <h2 className="text-[18px] font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <BriefcaseIcon className="w-5 h-5 text-gray-400" />
                    Experience
                  </h2>

                  {isLoading ? (
                    <div className="space-y-4">
                      {[...Array(2)].map((_, i) => (
                        <div key={i} className="space-y-2">
                          <Skeleton className="h-4 w-48" />
                          <Skeleton className="h-3 w-32" />
                          <Skeleton className="h-3 w-full" />
                        </div>
                      ))}
                    </div>
                  ) : profile?.experience && profile.experience.length > 0 ? (
                    <div className="space-y-6">
                      {profile.experience.map((exp, idx) => (
                        <div
                          key={exp.id}
                          className={
                            idx !== 0 ? "pt-6 border-t border-gray-100" : ""
                          }
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-[15px] font-bold text-gray-900">
                                {exp.title}
                              </p>
                              <p className="text-[14px] text-gray-600 mt-0.5">
                                {exp.company}
                                {exp.employmentType && (
                                  <span className="ml-2 text-[12px] text-gray-400">
                                    ·{" "}
                                    {EMPLOYMENT_TYPE_MAP[exp.employmentType] ??
                                      exp.employmentType}
                                  </span>
                                )}
                              </p>
                            </div>
                            <p className="text-[12px] text-gray-400 whitespace-nowrap">
                              {formatDateRange(
                                exp.startDate,
                                exp.endDate,
                                exp.isCurrent,
                              )}
                            </p>
                          </div>
                          {exp.description && (
                            <p className="mt-2 text-[13px] text-gray-500 leading-relaxed">
                              {exp.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[14px] text-gray-400">
                      No experience added yet.
                    </p>
                  )}
                </div>

                {/* Education Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                  <h2 className="text-[18px] font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <GraduationCapIcon className="w-5 h-5 text-gray-400" />
                    Education
                  </h2>

                  {isLoading ? (
                    <div className="space-y-4">
                      {[...Array(1)].map((_, i) => (
                        <div key={i} className="space-y-2">
                          <Skeleton className="h-4 w-48" />
                          <Skeleton className="h-3 w-32" />
                        </div>
                      ))}
                    </div>
                  ) : profile?.education && profile.education.length > 0 ? (
                    <div className="space-y-6">
                      {profile.education.map((edu, idx) => (
                        <div
                          key={edu.id}
                          className={
                            idx !== 0 ? "pt-6 border-t border-gray-100" : ""
                          }
                        >
                          <p className="text-[15px] font-bold text-gray-900">
                            {edu.institution}
                          </p>
                          <p className="text-[14px] text-gray-600 mt-0.5">
                            {edu.degree}
                            {edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ""}
                          </p>
                          <p className="text-[12px] text-gray-400 mt-0.5">
                            {edu.startYear} – {edu.endYear ?? "Sekarang"}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[14px] text-gray-400">
                      No education added yet.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Saved Jobs */}
            <div
              id="saved-jobs"
              className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-8 scroll-mt-24"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-[18px] font-bold text-gray-900">
                    Saved Jobs
                  </h2>
                  {bookmarkPagination && !isBookmarksLoading && (
                    <p className="mt-1 text-[13px] text-gray-500">
                      {bookmarkPagination.total.toLocaleString("id-ID")} lowongan tersimpan
                    </p>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <SearchIcon />
                  </div>
                  <input
                    type="text"
                    placeholder="Search saved jobs..."
                    value={bookmarkSearchInput}
                    onChange={(event) =>
                      setBookmarkSearchInput(event.target.value)
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") handleBookmarkSearch();
                    }}
                    className="w-full sm:w-[280px] pl-9 pr-4 py-2 bg-[#F8F9FA] border-transparent rounded-lg text-[14px] focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all placeholder:text-gray-500"
                  />
                </div>
              </div>

              {bookmarkError && (
                <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-[13px] text-red-700">
                  {bookmarkError}
                </div>
              )}

              {isBookmarksLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-gray-100 p-5 space-y-4"
                    >
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-11 h-11 rounded-[10px]" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                      </div>
                      <Skeleton className="h-3 w-32" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                  ))}
                </div>
              ) : bookmarks.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {bookmarks.map((bookmark) => (
                      <JobCard
                        key={bookmark.id}
                        job={bookmark.job}
                        defaultBookmarked
                        bookmarkId={bookmark.id}
                        onBookmarkChange={loadBookmarks}
                      />
                    ))}
                  </div>

                  {bookmarkPagination && bookmarkPagination.totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                      <button
                        disabled={!bookmarkPagination.hasPrevPage}
                        onClick={() =>
                          setBookmarkPage((current) => Math.max(1, current - 1))
                        }
                        className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 font-medium cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                      >
                        Sebelumnya
                      </button>
                      <span className="text-[13px] text-gray-500">
                        Halaman {bookmarkPagination.page} dari{" "}
                        {bookmarkPagination.totalPages}
                      </span>
                      <button
                        disabled={!bookmarkPagination.hasNextPage}
                        onClick={() => setBookmarkPage((current) => current + 1)}
                        className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 font-medium cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                      >
                        Selanjutnya
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 mb-3">
                    <BookmarkIcon className="w-6 h-6" />
                  </div>
                  <p className="text-[14px] font-semibold text-gray-700">
                    Belum ada lowongan tersimpan.
                  </p>
                  <p className="mt-1 text-[13px] text-gray-400">
                    Simpan lowongan dari daftar pekerjaan untuk melihatnya di sini.
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Card: Application Tracker */}
            <div
              id="applications"
              className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-8 scroll-mt-24"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-[18px] font-bold text-gray-900">
                    Application Tracker
                  </h2>
                  {applicationPagination && !isApplicationsLoading && (
                    <p className="mt-1 text-[13px] text-gray-500">
                      {applicationPagination.total.toLocaleString("id-ID")} lamaran terlacak
                    </p>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <SearchIcon />
                  </div>
                  <input
                    type="text"
                    placeholder="Search applications..."
                    value={applicationSearchInput}
                    onChange={(event) =>
                      setApplicationSearchInput(event.target.value)
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") handleApplicationSearch();
                    }}
                    className="w-full sm:w-[280px] pl-9 pr-4 py-2 bg-[#F8F9FA] border-transparent rounded-lg text-[14px] focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all placeholder:text-gray-500"
                  />
                </div>
              </div>

              {applicationError && (
                <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-[13px] text-red-700">
                  {applicationError}
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="pb-4 border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-500 w-[35%]">
                        ROLE & COMPANY
                      </th>
                      <th className="pb-4 border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-500 w-[20%]">
                        APPLIED DATE
                      </th>
                      <th className="pb-4 border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-500 w-[25%]">
                        LOCATION
                      </th>
                      <th className="pb-4 border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-500 text-right">
                        STATUS
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {isApplicationsLoading ? (
                      [...Array(4)].map((_, index) => (
                        <tr key={index}>
                          <td className="py-4">
                            <div className="flex items-center gap-3.5">
                              <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
                              <div className="space-y-2">
                                <Skeleton className="h-4 w-44" />
                                <Skeleton className="h-3 w-28" />
                              </div>
                            </div>
                          </td>
                          <td className="py-4">
                            <Skeleton className="h-4 w-24" />
                          </td>
                          <td className="py-4">
                            <Skeleton className="h-4 w-36" />
                          </td>
                          <td className="py-4">
                            <Skeleton className="h-8 w-32 ml-auto rounded-full" />
                          </td>
                        </tr>
                      ))
                    ) : applications.length > 0 ? (
                      applications.map((application) => {
                        const statusStyle =
                          APPLICATION_STATUS_STYLES[application.status] ??
                          "bg-[#F3F4F6] text-gray-600";
                        const isUpdating =
                          updatingApplicationId === application.id;

                        return (
                          <tr key={application.id}>
                            <td className="py-4">
                              <div className="flex items-center gap-3.5">
                                {application.job.company.logoUrl ? (
                                  <div className="w-10 h-10 rounded-lg bg-[#F3F4F6] flex items-center justify-center overflow-hidden shrink-0">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={application.job.company.logoUrl}
                                      alt={application.job.company.name}
                                      className="w-full h-full object-contain"
                                    />
                                  </div>
                                ) : (
                                  <div className="w-10 h-10 rounded-lg bg-[#F3F4F6] flex items-center justify-center font-bold text-gray-700 shrink-0">
                                    {getCompanyInitials(
                                      application.job.company.name,
                                    )}
                                  </div>
                                )}
                                <div>
                                  <Link
                                    href={`/jobs/${application.job.id}`}
                                    className="font-bold text-gray-900 text-[14px] hover:text-blue-600 transition-colors"
                                  >
                                    {application.job.title}
                                  </Link>
                                  <p className="text-[13px] text-gray-500 mt-0.5">
                                    {application.job.company.name}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 text-[14px] text-gray-600">
                              {formatApplicationDate(application.appliedAt)}
                            </td>
                            <td className="py-4 text-[14px] text-gray-600">
                              {application.job.location.display}
                            </td>
                            <td className="py-4 text-right">
                              <select
                                value={application.status}
                                disabled={isUpdating}
                                onChange={(event) =>
                                  handleApplicationStatusChange(
                                    application,
                                    event.target.value as ApplicationStatus,
                                  )
                                }
                                className={`inline-flex min-w-[132px] appearance-none rounded-full border-none px-3 py-1 text-[12px] font-bold outline-none cursor-pointer disabled:cursor-wait disabled:opacity-70 ${statusStyle}`}
                                aria-label={`Status lamaran ${application.job.title}`}
                              >
                                {APPLICATION_STATUSES.map((status) => (
                                  <option key={status} value={status}>
                                    {APPLICATION_STATUS_LABELS[status]}
                                  </option>
                                ))}
                              </select>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-12 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 mb-3">
                              <FileTextIcon className="w-6 h-6" />
                            </div>
                            <p className="text-[14px] font-semibold text-gray-700">
                              Belum ada lamaran terlacak.
                            </p>
                            <p className="mt-1 text-[13px] text-gray-400">
                              Klik Apply di detail lowongan untuk menambahkannya ke tracker.
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {applicationPagination &&
                applicationPagination.totalPages > 1 &&
                !isApplicationsLoading && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      disabled={!applicationPagination.hasPrevPage}
                      onClick={() =>
                        setApplicationPage((current) =>
                          Math.max(1, current - 1),
                        )
                      }
                      className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 font-medium cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      Sebelumnya
                    </button>
                    <span className="text-[13px] text-gray-500">
                      Halaman {applicationPagination.page} dari{" "}
                      {applicationPagination.totalPages}
                    </span>
                    <button
                      disabled={!applicationPagination.hasNextPage}
                      onClick={() => setApplicationPage((current) => current + 1)}
                      className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 font-medium cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      Selanjutnya
                    </button>
                  </div>
                )}
            </div>

            {/* Footer */}
            <footer className="mt-12 flex flex-col md:flex-row items-center justify-between text-[13px] text-gray-400 gap-4">
              <p>© 2024 Bisakerja. Temukan karier impianmu.</p>
              <div className="flex gap-6">
                <a href="#" className="hover:text-gray-600 transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-gray-600 transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="hover:text-gray-600 transition-colors">
                  Cookie Policy
                </a>
                <a href="#" className="hover:text-gray-600 transition-colors">
                  Accessibility
                </a>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
