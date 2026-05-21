"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JobCard from "@/components/JobCard";
import {
  APIError,
  fetchBookmarks,
  fetchJobs,
  type APIJob,
  type APIPagination,
  type JobSearchParams,
} from "@/lib/api";

/* ─── Icon Components ─── */
function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function ChevronDownIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" opacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/* ─── Data ─── */
const filterOptions: { label: string; paramKey: keyof JobSearchParams; options: { label: string; value: string }[] }[] = [
  {
    label: "Tipe Kerja",
    paramKey: "workType",
    options: [
      { label: "Semua", value: "" },
      { label: "Remote", value: "REMOTE" },
      { label: "Hybrid", value: "HYBRID" },
      { label: "On-site", value: "ONSITE" },
    ],
  },
  {
    label: "Jenis",
    paramKey: "employmentType",
    options: [
      { label: "Semua", value: "" },
      { label: "Penuh Waktu", value: "FULL_TIME" },
      { label: "Kontrak", value: "CONTRACT" },
      { label: "Paruh Waktu", value: "PART_TIME" },
      { label: "Magang", value: "INTERNSHIP" },
    ],
  },
  {
    label: "Level",
    paramKey: "experienceLevel",
    options: [
      { label: "Semua", value: "" },
      { label: "Entry Level", value: "ENTRY_LEVEL" },
      { label: "Mid Level", value: "MID_LEVEL" },
      { label: "Senior Level", value: "SENIOR_LEVEL" },
    ],
  },
];

const sortOptions = [
  { label: "Terbaru", value: "newest" },
  { label: "Gaji Tertinggi", value: "salary_highest" },
  { label: "Gaji Terendah", value: "salary_lowest" },
];

/* ─── Main Page ─── */
export default function Home() {
  const [jobs, setJobs] = useState<APIJob[]>([]);
  const [pagination, setPagination] = useState<APIPagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookmarkByJobId, setBookmarkByJobId] = useState<Record<string, string>>(
    {},
  );

  // Search & filter state
  const [keyword, setKeyword] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  // Dropdown states
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const loadJobs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params: JobSearchParams = {
        page,
        limit: 20,
        sort,
      };
      if (keyword) params.keyword = keyword;

      // Apply active filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          (params as Record<string, unknown>)[key] = value;
        }
      });

      const res = await fetchJobs(params);
      setJobs(res.data);
      setPagination(res.meta.pagination);
    } catch {
      setError("Gagal memuat lowongan kerja. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }, [page, keyword, filters, sort]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadJobs();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadJobs]);

  const loadBookmarkIndex = useCallback(async () => {
    try {
      let bookmarkPage = 1;
      let hasNextPage = true;
      const nextBookmarkByJobId: Record<string, string> = {};

      while (hasNextPage) {
        const res = await fetchBookmarks({
          page: bookmarkPage,
          limit: 100,
          sort: "created_desc",
        });

        res.data.forEach((bookmark) => {
          nextBookmarkByJobId[bookmark.job.id] = bookmark.id;
        });

        hasNextPage = res.meta.pagination.hasNextPage;
        bookmarkPage += 1;
      }

      setBookmarkByJobId(nextBookmarkByJobId);
    } catch (err: unknown) {
      if (err instanceof APIError && err.status === 401) {
        setBookmarkByJobId({});
      }
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadBookmarkIndex();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadBookmarkIndex]);

  const handleBookmarkChange = (
    jobId: string,
    isBookmarked: boolean,
    bookmarkId?: string,
  ) => {
    setBookmarkByJobId((current) => {
      const next = { ...current };

      if (isBookmarked && bookmarkId) {
        next[jobId] = bookmarkId;
      } else {
        delete next[jobId];
      }

      return next;
    });
  };

  const handleSearch = () => {
    setKeyword(searchInput);
    setPage(1);
  };

  const handleFilterChange = (paramKey: string, value: string) => {
    setFilters((prev) => ({ ...prev, [paramKey]: value }));
    setPage(1);
    setOpenFilter(null);
  };

  const handleSortChange = (value: string) => {
    setSort(value);
    setPage(1);
    setShowSortDropdown(false);
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50" style={{ colorScheme: "light" }}>
      <Navbar />

      {/* ─── Hero Section ─── */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 py-14 px-8 text-center">
        <h1 className="text-[28px] font-bold text-white leading-relaxed max-w-[1240px] mx-auto">
          Cari Lowongan Kerja Pakai BisaKerja{" "}
          <span className="text-yellow-300">#LebihPasti</span>
        </h1>
      </section>

      {/* ─── Search & Filters Section ─── */}
      <section className="max-w-[1240px] mx-auto px-6 -mt-9 relative z-10 w-full">
        {/* Search Card */}
        <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] px-7 pt-6 pb-5">
          {/* Search Bar */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 flex items-center border border-gray-200 rounded-[10px] pl-3.5 h-11 bg-white">
              <input
                type="text"
                placeholder="Search by job title, company, & skills"
                className="flex-1 border-none outline-none text-sm text-gray-900 bg-transparent placeholder:text-gray-400"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
              />
              <button
                onClick={handleSearch}
                className="w-16 h-full rounded-lg bg-blue-600 border-none cursor-pointer flex items-center justify-center text-white shrink-0 hover:bg-blue-700 transition-colors"
              >
                <SearchIcon />
              </button>
            </div>
          </div>

          {/* Filter Tags */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              {filterOptions.map((filter) => (
                <div key={filter.paramKey} className="relative">
                  <button
                    onClick={() => setOpenFilter(openFilter === filter.paramKey ? null : filter.paramKey)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-[13px] font-medium cursor-pointer transition-colors ${
                      filters[filter.paramKey]
                        ? "border-blue-300 bg-blue-50 text-blue-700"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {filter.label}
                    <ChevronDownIcon size={12} />
                  </button>
                  {openFilter === filter.paramKey && (
                    <div className="absolute top-full mt-1 left-0 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-20 min-w-[140px]">
                      {filter.options.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => handleFilterChange(filter.paramKey, opt.value)}
                          className={`w-full px-3 py-2 text-left text-[13px] bg-transparent border-none cursor-pointer transition-colors ${
                            filters[filter.paramKey] === opt.value
                              ? "text-blue-600 bg-blue-50 font-medium"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {activeFilterCount > 0 && (
                <button
                  onClick={() => { setFilters({}); setPage(1); }}
                  className="px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 text-[13px] font-medium cursor-pointer hover:bg-red-100 transition-colors"
                >
                  Reset ({activeFilterCount})
                </button>
              )}
            </div>
            <div className="relative shrink-0">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-1.5 text-gray-500 bg-transparent border-none cursor-pointer p-0 text-[13px]"
              >
                <span>{sortOptions.find((s) => s.value === sort)?.label || "Terbaru"}</span>
                <ChevronDownIcon size={12} />
              </button>
              {showSortDropdown && (
                <div className="absolute top-full mt-1 right-0 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-20 min-w-[140px]">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleSortChange(opt.value)}
                      className={`w-full px-3 py-2 text-left text-[13px] bg-transparent border-none cursor-pointer transition-colors ${
                        sort === opt.value
                          ? "text-blue-600 bg-blue-50 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results count */}
        {pagination && !isLoading && (
          <div className="flex items-center justify-between mt-5">
            <p className="text-sm text-gray-500">
              Menampilkan <span className="font-semibold text-gray-700">{jobs.length}</span> dari{" "}
              <span className="font-semibold text-gray-700">{pagination.total.toLocaleString()}</span> lowongan
              {keyword && (
                <span>
                  {" "}untuk &quot;<span className="text-blue-600 font-medium">{keyword}</span>&quot;
                </span>
              )}
            </p>
          </div>
        )}
      </section>

      {/* ─── Job Cards Grid ─── */}
      <section className="max-w-[1240px] mx-auto px-6 pt-7 pb-12 w-full">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <SpinnerIcon />
            <p className="text-sm text-gray-500">Memuat lowongan kerja...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <p className="text-sm text-gray-600">{error}</p>
            <button
              onClick={loadJobs}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium border-none cursor-pointer hover:bg-blue-700 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <p className="text-sm text-gray-500">Tidak ada lowongan yang ditemukan.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
              {jobs.map((job) => (
                <JobCard
                  key={`${job.id}-${bookmarkByJobId[job.id] ?? "unsaved"}`}
                  job={job}
                  defaultBookmarked={Boolean(bookmarkByJobId[job.id])}
                  bookmarkId={bookmarkByJobId[job.id]}
                  onBookmarkChange={handleBookmarkChange}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  disabled={!pagination.hasPrevPage}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 font-medium cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  ← Sebelumnya
                </button>
                <div className="flex items-center gap-1">
                  {/* Show page numbers */}
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-9 h-9 rounded-lg border text-sm font-medium cursor-pointer transition-colors ${
                          page === pageNum
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  {pagination.totalPages > 5 && page < pagination.totalPages - 2 && (
                    <>
                      <span className="text-gray-400 px-1">...</span>
                      <button
                        onClick={() => setPage(pagination.totalPages)}
                        className="w-9 h-9 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 font-medium cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        {pagination.totalPages}
                      </button>
                    </>
                  )}
                </div>
                <button
                  disabled={!pagination.hasNextPage}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 font-medium cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Selanjutnya →
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <Footer />
    </div>
  );
}
