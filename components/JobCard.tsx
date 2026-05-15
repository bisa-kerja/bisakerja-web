import Link from "next/link";
import Image from "next/image";

/* ─── SVG Icons ─── */
function BookmarkIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function GraduationIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}

function MoneyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <circle cx="12" cy="12" r="4" />
      <path d="M2 8h2M20 8h2M2 16h2M20 16h2" />
    </svg>
  );
}

/* ─── Employment type display mapping ─── */
const employmentTypeMap: Record<string, { label: string; color: string }> = {
  FULL_TIME: { label: "Penuh Waktu", color: "#16A34A" },
  PART_TIME: { label: "Paruh Waktu", color: "#EA580C" },
  CONTRACT: { label: "Kontrak", color: "#3B82F6" },
  INTERNSHIP: { label: "Magang", color: "#8B5CF6" },
  FREELANCE: { label: "Freelance", color: "#D97706" },
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
  if (diffMin < 60) return `${diffMin}m lalu`;
  if (diffHr < 24) return `${diffHr}h lalu`;
  if (diffDay < 30) return `${diffDay}d lalu`;
  return `${Math.floor(diffDay / 30)}mo lalu`;
}

/* ─── Types ─── */
export interface JobCardProps {
  id: string;
  title: string;
  company: {
    name: string;
    logoUrl: string | null;
  };
  workType: string;
  employmentType: string;
  experienceLevel: string;
  location: {
    display: string;
  };
  salary: {
    display: string;
  };
  postedAt: string;
  sourcePlatform?: {
    name: string;
  };
}

/* ─── Component ─── */
export default function JobCard({ job }: { job: JobCardProps }) {
  const empType = employmentTypeMap[job.employmentType] ?? { label: job.employmentType, color: "#6B7280" };
  const expLevel = experienceLevelMap[job.experienceLevel] ?? job.experienceLevel;
  const workType = workTypeMap[job.workType] ?? job.workType;
  const locationText = `${workType} • ${job.location.display}`;

  // Generate initials from company name
  const initials = job.company.name
    .split(/\s+/)
    .map(w => w[0])
    .join("")
    .substring(0, 3)
    .toUpperCase();

  return (
    <Link
      href={`/jobs/${job.id}`}
      className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3 relative transition-all duration-200 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 no-underline text-inherit"
    >
      {/* Company Row */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {job.company.logoUrl ? (
            <div className="w-11 h-11 rounded-[10px] overflow-hidden shrink-0 bg-gray-100 flex items-center justify-center">
              <Image
                src={job.company.logoUrl}
                alt={job.company.name}
                width={44}
                height={44}
                className="object-contain"
                unoptimized
              />
            </div>
          ) : (
            <div className="w-11 h-11 rounded-[10px] flex items-center justify-center text-xs font-bold shrink-0 bg-blue-50 text-blue-700">
              {initials}
            </div>
          )}
          <div>
            <h3 className="text-[15px] font-bold text-gray-900 m-0 leading-tight line-clamp-1">
              {job.title}
            </h3>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-[13px] text-gray-500 line-clamp-1">{job.company.name}</span>
            </div>
          </div>
        </div>
        <button
          className="bg-transparent border-none cursor-pointer p-1 shrink-0"
          onClick={(e) => e.preventDefault()}
        >
          <BookmarkIcon />
        </button>
      </div>

      {/* Job Type */}
      <div className="flex items-center gap-1.5">
        <BriefcaseIcon />
        <span className="text-[13px] font-medium" style={{ color: empType.color }}>
          {empType.label}
        </span>
        {job.sourcePlatform && (
          <span className="text-[11px] text-gray-400 ml-auto bg-gray-50 px-1.5 py-0.5 rounded">
            {job.sourcePlatform.name}
          </span>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5">
          <LocationIcon />
          <span className="text-[13px] text-gray-600 line-clamp-1">{locationText}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <GraduationIcon />
          <span className="text-[13px] text-gray-600">{expLevel}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <MoneyIcon />
          <span className="text-[13px] text-gray-600">{job.salary.display}</span>
        </div>
      </div>

      {/* Active Time */}
      <p className="text-xs text-gray-400 m-0 mt-auto pt-2 border-t border-gray-100">
        Diposting {timeAgo(job.postedAt)}
      </p>
    </Link>
  );
}
