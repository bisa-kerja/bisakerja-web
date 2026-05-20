"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  APIError,
  createApplication,
  fetchJobDetail,
  type APIJobDetail,
} from "@/lib/api";

/* ─── Enum label mappings ─── */
const employmentTypeMap: Record<string, string> = {
  FULL_TIME: "Penuh Waktu",
  PART_TIME: "Paruh Waktu",
  CONTRACT: "Kontrak",
  INTERNSHIP: "Magang",
  FREELANCE: "Freelance",
};

const experienceLevelMap: Record<string, string> = {
  ENTRY_LEVEL: "Entry Level",
  MID_LEVEL: "Mid Level",
  SENIOR_LEVEL: "Senior Level",
  LEAD: "Lead",
  MANAGER: "Manager",
  DIRECTOR: "Director",
  EXECUTIVE: "Executive",
  INTERN: "Intern",
};

const workTypeMap: Record<string, string> = {
  REMOTE: "Remote",
  ONSITE: "On-site",
  HYBRID: "Hybrid",
};

/* ─── Relative time helper ─── */
function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return "Baru saja";
  if (diffMin < 60) return `${diffMin} menit lalu`;
  if (diffHr < 24) return `${diffHr} jam lalu`;
  if (diffDay < 30) return `${diffDay} hari lalu`;
  return `${Math.floor(diffDay / 30)} bulan lalu`;
}

/* ─── SVG Icon Components ─── */

function ArrowLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function BookmarkOutlineIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

function LocationPinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function MoneyBagIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <circle cx="12" cy="12" r="4" />
      <path d="M2 8h2M20 8h2M2 16h2M20 16h2" />
    </svg>
  );
}

function TrendingUpIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function CircleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg className="animate-spin" width="32" height="32" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" opacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/* ─── Main Page Component ─── */
export default function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [job, setJob] = useState<APIJobDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [applyMessage, setApplyMessage] = useState<string | null>(null);
  const [applyError, setApplyError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetchJobDetail(id);
        if (!cancelled) {
          setJob(res.data);
        }
      } catch {
        if (!cancelled) {
          setError("Gagal memuat detail lowongan. Silakan coba lagi.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }
    load();
    return () => { cancelled = true; };
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50" style={{ colorScheme: "light" }}>
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <SpinnerIcon />
            <p className="text-sm text-gray-500">Memuat detail lowongan...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50" style={{ colorScheme: "light" }}>
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Lowongan Tidak Ditemukan</h1>
            <p className="text-gray-500 mb-6">{error || "Lowongan yang kamu cari tidak tersedia."}</p>
            <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium no-underline hover:bg-blue-700 transition-colors">
              <ArrowLeftIcon /> Kembali ke Beranda
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Parse requirements into categories
  const qualificationReqs = job.requirements.filter((r) => r.type !== "SKILL");
  const empType = employmentTypeMap[job.employmentType] ?? job.employmentType;
  const expLevel = experienceLevelMap[job.experienceLevel] ?? job.experienceLevel;
  const workType = workTypeMap[job.workType] ?? job.workType;

  // Company initials fallback
  const initials = job.company.name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .substring(0, 3)
    .toUpperCase();

  const handleApply = async () => {
    if (isApplying) return;

    setIsApplying(true);
    setApplyMessage(null);
    setApplyError(null);

    try {
      await createApplication({
        jobId: job.id,
        status: "APPLIED",
        notes: `Applied from ${job.sourcePlatform?.name ?? "job detail"} after clicking apply.`,
        source: "EXTERNAL_APPLY_CLICK",
      });
      setApplyMessage("Lamaran ditambahkan ke Application Tracker.");

      if (job.externalApplyUrl) {
        window.open(job.externalApplyUrl, "_blank", "noopener,noreferrer");
      }
    } catch (error) {
      if (error instanceof APIError && error.status === 401) {
        router.push("/login");
        return;
      }

      setApplyError(
        error instanceof Error
          ? error.message
          : "Gagal menambahkan lamaran ke Application Tracker.",
      );
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50" style={{ colorScheme: "light" }}>
      <Navbar />

      {/* ─── Back to Jobs ─── */}
      <div className="max-w-[1240px] mx-auto px-6 pt-6 w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-blue-600 text-sm font-medium no-underline hover:text-blue-700 transition-colors"
        >
          <ArrowLeftIcon />
          Kembali ke Lowongan
        </Link>
      </div>

      {/* ─── Header Section ─── */}
      <section className="max-w-[1240px] mx-auto px-6 pt-6 pb-8 w-full">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          {/* Left: Logo + Title */}
          <div className="flex items-start gap-4">
            {job.company.logoUrl ? (
              <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-gray-100 flex items-center justify-center shadow-sm">
                <Image
                  src={job.company.logoUrl}
                  alt={job.company.name}
                  width={56}
                  height={56}
                  className="object-contain"
                  unoptimized
                />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 shadow-sm bg-blue-50 text-blue-700">
                {initials}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm text-gray-500 font-medium">{job.company.name}</span>
                {job.sourcePlatform && (
                  <span className="text-[11px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    via {job.sourcePlatform.name}
                  </span>
                )}
              </div>
              <h1 className="text-[26px] font-bold text-gray-900 m-0 leading-tight">{job.title}</h1>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded-md">{workType}</span>
                <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-md">{empType}</span>
                <span className="text-xs font-medium text-purple-700 bg-purple-50 px-2 py-1 rounded-md">{expLevel}</span>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex flex-col items-end gap-3 shrink-0">
            <button
              id="apply-button"
              type="button"
              disabled={isApplying}
              onClick={handleApply}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg border-none text-sm font-semibold cursor-pointer hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md disabled:cursor-wait disabled:opacity-70"
            >
              {isApplying
                ? "Menyimpan..."
                : job.externalApplyUrl
                  ? `Apply on ${job.sourcePlatform?.name || "Platform"}`
                  : "Apply"}
              <ExternalLinkIcon />
            </button>
            {(applyMessage || applyError) && (
              <p
                className={`max-w-[280px] text-right text-xs font-medium ${
                  applyError ? "text-red-600" : "text-green-600"
                }`}
              >
                {applyError ?? applyMessage}
              </p>
            )}
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1.5 bg-transparent border-none cursor-pointer text-gray-500 text-sm font-medium hover:text-gray-700 transition-colors p-0">
                <BookmarkOutlineIcon />
                Save
              </button>
              <button className="flex items-center gap-1.5 bg-transparent border-none cursor-pointer text-gray-500 text-sm font-medium hover:text-gray-700 transition-colors p-0">
                <ShareIcon />
                Share
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Divider ─── */}
      <div className="max-w-[1240px] mx-auto px-6 w-full">
        <hr className="border-0 border-t border-gray-200 m-0" />
      </div>

      {/* ─── Content Area: Main + Sidebar ─── */}
      <section className="max-w-[1240px] mx-auto px-6 pt-8 pb-12 w-full">
        <div className="flex gap-8" style={{ alignItems: "flex-start" }}>
          {/* ─── Main Content ─── */}
          <div className="flex-1 min-w-0">
            {/* Description */}
            {job.description && (
              <div className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Tentang Posisi Ini</h2>
                <div
                  className="text-[15px] text-gray-600 leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: job.description }}
                />
              </div>
            )}

            {/* Requirements */}
            {qualificationReqs.length > 0 && (
              <div className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Persyaratan</h2>
                <ul className="list-none p-0 m-0 flex flex-col gap-3">
                  {qualificationReqs.map((req, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="shrink-0 mt-0.5">
                        <CircleIcon />
                      </span>
                      <span className="text-[15px] text-gray-600 leading-relaxed">{req.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <div className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Skills yang Dibutuhkan</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-sm text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ─── Sidebar ─── */}
          <aside className="w-[320px] shrink-0 flex flex-col gap-5 sticky top-[80px]">
            {/* Job Details Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-base font-bold text-gray-900 m-0 mb-5">Detail Pekerjaan</h3>

              {/* Location & Job Type */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">
                    LOKASI
                  </span>
                  <div className="flex items-start gap-1.5">
                    <span className="shrink-0 mt-0.5"><LocationPinIcon /></span>
                    <div>
                      <span className="text-sm font-semibold text-gray-900 block">
                        {job.location.city || job.location.display}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">
                    TIPE PEKERJAAN
                  </span>
                  <div className="flex items-center gap-1.5">
                    <BriefcaseIcon />
                    <span className="text-sm font-semibold text-gray-900">{empType}</span>
                  </div>
                </div>
              </div>

              {/* Salary & Experience */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">
                    GAJI
                  </span>
                  <div className="flex items-center gap-1.5">
                    <MoneyBagIcon />
                    <span className="text-sm font-semibold text-gray-900">{job.salary.display}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">
                    PENGALAMAN
                  </span>
                  <div className="flex items-center gap-1.5">
                    <TrendingUpIcon />
                    <span className="text-sm font-semibold text-gray-900">{expLevel}</span>
                  </div>
                </div>
              </div>

              {/* Work Type */}
              <div className="mb-4">
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">
                  MODE KERJA
                </span>
                <span className="text-sm font-semibold text-gray-900">{workType}</span>
              </div>

              {/* Source Platform */}
              {job.sourcePlatform && (
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-md font-medium">
                    {job.sourcePlatform.name}
                  </span>
                </div>
              )}
            </div>

            {/* About the Company Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-base font-bold text-gray-900 m-0 mb-3">Tentang Perusahaan</h3>
              <div className="flex items-center gap-3 mb-3">
                {job.company.logoUrl ? (
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
                    <Image
                      src={job.company.logoUrl}
                      alt={job.company.name}
                      width={40}
                      height={40}
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">
                    {initials}
                  </div>
                )}
                <div>
                  <span className="text-sm font-semibold text-gray-900 block">{job.company.name}</span>
                  {job.company.websiteUrl && (
                    <a
                      href={job.company.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 no-underline hover:underline"
                    >
                      Website →
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Posted Info */}
            <div className="flex items-center justify-center gap-1.5 text-gray-400 text-xs py-2">
              <ClockIcon />
              <span>
                Diposting {timeAgo(job.postedAt)}
              </span>
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </div>
  );
}
