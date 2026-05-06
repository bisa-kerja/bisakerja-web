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

function VerifiedIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#3B82F6" stroke="white" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── Types ─── */
export interface JobCardData {
  id: number;
  title: string;
  company: string;
  verified: boolean;
  type: string;
  typeColor: string;
  location: string;
  experience: string;
  salary: string;
  logoColor: string;
  logoText: string;
  logoBg: string;
  activeTime: string;
}

/* ─── Component ─── */
export default function JobCard({ job }: { job: JobCardData }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3 relative transition-all duration-200 cursor-pointer hover:shadow-lg hover:-translate-y-0.5">
      {/* Company Row */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-[10px] flex items-center justify-center text-xs font-bold shrink-0"
            style={{ background: job.logoBg, color: job.logoColor }}
          >
            {job.logoText}
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-gray-900 m-0 leading-tight">
              {job.title}
            </h3>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-[13px] text-gray-500">{job.company}</span>
              {job.verified && <VerifiedIcon />}
            </div>
          </div>
        </div>
        <button className="bg-transparent border-none cursor-pointer p-1 shrink-0">
          <BookmarkIcon />
        </button>
      </div>

      {/* Job Type */}
      <div className="flex items-center gap-1.5">
        <BriefcaseIcon />
        <span className="text-[13px] font-medium" style={{ color: job.typeColor }}>
          {job.type}
        </span>
      </div>

      {/* Details */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5">
          <LocationIcon />
          <span className="text-[13px] text-gray-600">{job.location}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <GraduationIcon />
          <span className="text-[13px] text-gray-600">{job.experience}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <MoneyIcon />
          <span className="text-[13px] text-gray-600">{job.salary}</span>
        </div>
      </div>

      {/* Active Time */}
      <p className="text-xs text-gray-400 m-0 mt-auto pt-2 border-t border-gray-100">
        {job.activeTime}
      </p>
    </div>
  );
}
