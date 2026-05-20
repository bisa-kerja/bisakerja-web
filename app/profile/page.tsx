"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  APIError,
  fetchProfile,
  type ProfileData,
} from "@/lib/api";
import {
  BriefcaseIcon,
  CameraIcon,
  GraduationCapIcon,
  MailIcon,
  PhoneIcon,
} from "./_components/ProfileIcons";
import { ProfileShell, Skeleton } from "./_components/ProfileShell";

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

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  const avatarUrl =
    profile?.profilePhoto?.url ??
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profile?.username ?? "user")}&backgroundColor=F0F5FF`;

  const displayRole =
    profile?.profile?.latestRole ?? profile?.profile?.careerStatus
      ? (CAREER_STATUS_MAP[profile?.profile?.careerStatus ?? ""] ??
        profile?.profile?.careerStatus)
      : "—";

  return (
    <ProfileShell
      activeSection="profile"
      title="Profile Settings"
      description="Manage your public profile, career preferences, and account security."
    >
      {error && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-5 py-4 text-[14px] text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 items-start">
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

        <div className="space-y-6">
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
                      {skill.level.charAt(0) + skill.level.slice(1).toLowerCase()}
                    </span>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-[14px] text-gray-400">No skills added yet.</p>
            )}
          </div>

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
                    className={idx !== 0 ? "pt-6 border-t border-gray-100" : ""}
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
                        {formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}
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
              <p className="text-[14px] text-gray-400">No experience added yet.</p>
            )}
          </div>

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
                    className={idx !== 0 ? "pt-6 border-t border-gray-100" : ""}
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
              <p className="text-[14px] text-gray-400">No education added yet.</p>
            )}
          </div>
        </div>
      </div>
    </ProfileShell>
  );
}
