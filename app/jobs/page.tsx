"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JobCard from "@/components/JobCard";
import Image from "next/image";
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

function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

function JobCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Skeleton className="w-11 h-11 rounded-[10px] shrink-0" />
          <div className="space-y-2 min-w-0 flex-1">
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-3 w-3/5" />
          </div>
        </div>
        <Skeleton className="w-7 h-7 rounded-md shrink-0" />
      </div>

      <Skeleton className="h-4 w-28" />

      <div className="space-y-2">
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-5/6" />
        <Skeleton className="h-3.5 w-2/3" />
      </div>

      <div className="flex items-center justify-between pt-2 mt-auto">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}

function JobCardSkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
      {Array.from({ length: count }, (_, index) => (
        <JobCardSkeleton key={index} />
      ))}
    </div>
  );
}

/* ─── Data ─── */
const filterOptions: { label: string; paramKey: keyof JobSearchParams; options: { label: string; value: string }[] }[] = [
  {
    label: "Work Type",
    paramKey: "workType",
    options: [
      { label: "All", value: "" },
      { label: "Remote", value: "REMOTE" },
      { label: "Hybrid", value: "HYBRID" },
      { label: "On-site", value: "ONSITE" },
    ],
  },
  {
    label: "Employment Type",
    paramKey: "employmentType",
    options: [
      { label: "All", value: "" },
      { label: "Full Time", value: "FULL_TIME" },
      { label: "Contract", value: "CONTRACT" },
      { label: "Part Time", value: "PART_TIME" },
      { label: "Internship", value: "INTERNSHIP" },
    ],
  },
  {
    label: "Experience Level",
    paramKey: "experienceLevel",
    options: [
      { label: "All", value: "" },
      { label: "Entry Level", value: "ENTRY_LEVEL" },
      { label: "Mid Level", value: "MID_LEVEL" },
      { label: "Senior Level", value: "SENIOR" },
    ],
  },
];

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Highest Salary", value: "salary_highest" },
  { label: "Lowest Salary", value: "salary_lowest" },
];

/* ─── Main Page ─── */
export default function Home() {
  const [jobs, setJobs] = useState<APIJob[]>([]);
  const [pagination, setPagination] = useState<APIPagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookmarkByJobId, setBookmarkByJobId] = useState<Record<string, string>>(
    {},
  );
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const requestIdRef = useRef(0);

  // Search & filter state
  const [keyword, setKeyword] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sort, setSort] = useState("newest");
  const [nextPage, setNextPage] = useState(1);

  // Dropdown states
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const loadJobs = useCallback(async (pageToLoad = 1) => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    const isFirstPage = pageToLoad === 1;

    if (isFirstPage) {
      setIsLoading(true);
      setIsLoadingMore(false);
    } else {
      setIsLoadingMore(true);
    }

    setError(null);
    try {
      const params: JobSearchParams = {
        page: pageToLoad,
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
      if (requestId !== requestIdRef.current) return;

      setJobs((currentJobs) => (
        isFirstPage ? res.data : [...currentJobs, ...res.data]
      ));
      setPagination(res.meta.pagination);
      setNextPage(res.meta.pagination.hasNextPage ? pageToLoad + 1 : pageToLoad);
    } catch {
      if (requestId !== requestIdRef.current) return;
      setError("Failed to load jobs. Please try again.");
    } finally {
      if (requestId !== requestIdRef.current) return;

      if (isFirstPage) {
        setIsLoading(false);
      } else {
        setIsLoadingMore(false);
      }
    }
  }, [keyword, filters, sort]);

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
  };

  const handleFilterChange = (paramKey: string, value: string) => {
    setFilters((prev) => ({ ...prev, [paramKey]: value }));
    setOpenFilter(null);
  };

  const handleSortChange = (value: string) => {
    setSort(value);
    setShowSortDropdown(false);
  };

  const handleLoadMore = useCallback(() => {
    if (isLoading || isLoadingMore || !pagination?.hasNextPage) return;

    loadJobs(nextPage);
  }, [isLoading, isLoadingMore, loadJobs, nextPage, pagination?.hasNextPage]);

  useEffect(() => {
    const sentinel = loadMoreRef.current;
    if (!sentinel || !pagination?.hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          handleLoadMore();
        }
      },
      { rootMargin: "320px 0px" },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [handleLoadMore, pagination?.hasNextPage]);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50" style={{ colorScheme: "light" }}>
      <Navbar />

      {/* ─── Hero Section ─── */}
      <section className="relative isolate overflow-hidden px-6 pb-20 pt-28" style={{ background: "linear-gradient(135deg, #1e40af 0%, #2563eb 35%, #3b82f6 65%, #60a5fa 100%)" }}>
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-10" style={{ background: "radial-gradient(circle, white 0%, transparent 70%)" }} />
          <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full opacity-10" style={{ background: "radial-gradient(circle, white 0%, transparent 70%)" }} />
          <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full opacity-5" style={{ background: "radial-gradient(circle, white 0%, transparent 70%)" }} />
        </div>
        <div className="relative max-w-[1240px] mx-auto flex items-center justify-between gap-8">
          <div className="flex-1 text-left">
            <h1 className="text-[28px] md:text-[34px] font-bold text-white leading-relaxed">
              Find Jobs Using BisaKerja{" "}
              <span className="text-yellow-300">#BestMatch</span>
            </h1>
            <p className="mt-3 text-blue-100 text-base md:text-lg max-w-xl leading-relaxed">
              Find thousands of the best jobs that match your skills and interests.
            </p>
          </div>
          <div className="hidden md:block shrink-0 absolute -bottom-36 right-0">
            <Image
              src="/maskots/job-search.png"
              alt="BisaKerja Mascot"
              width={420}
              height={420}
              priority
              className="drop-shadow-2xl"
              style={{ filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.2))" }}
            />
          </div>
        </div>
      </section>

      {/* ─── Search & Filters Section ─── */}
      <section className="max-w-[1240px] mx-auto px-6 -mt-9 relative z-10 w-full">
        {/* Search Card */}
        <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] px-4 md:px-7 pt-5 md:pt-6 pb-4 md:pb-5">
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
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
                  onClick={() => setFilters({})}
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
                <span>{sortOptions.find((s) => s.value === sort)?.label || "Newest"}</span>
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
              Showing <span className="font-semibold text-gray-700">{jobs.length}</span> of{" "}
              <span className="font-semibold text-gray-700">{pagination.total.toLocaleString()}</span> jobs
              {keyword && (
                <span>
                  {" "}for &quot;<span className="text-blue-600 font-medium">{keyword}</span>&quot;
                </span>
              )}
            </p>
          </div>
        )}
      </section>

      {/* ─── Job Cards Grid ─── */}
      <section className="max-w-[1240px] mx-auto px-6 pt-7 pb-12 w-full">
        {isLoading ? (
          <JobCardSkeletonGrid />
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
              onClick={() => loadJobs(1)}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium border-none cursor-pointer hover:bg-blue-700 transition-colors"
            >
              Try Again
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
            <p className="text-sm text-gray-500">No jobs found.</p>
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

            {isLoadingMore && (
              <div className="mt-4">
                <JobCardSkeletonGrid count={4} />
              </div>
            )}

            {pagination?.hasNextPage && (
              <div
                ref={loadMoreRef}
                aria-hidden="true"
                className="h-10"
              />
            )}

            {!pagination?.hasNextPage && jobs.length > 0 && (
              <p className="mt-10 text-center text-sm text-gray-500">
                You&apos;ve reached the end of the list.
              </p>
            )}
          </>
        )}
      </section>

      <Footer />
    </div>
  );
}
