"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Calendar,
  ChevronRight,
  FileText,
  Loader2,
  Target,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  APIError,
  fetchCVAnalyzerResultDetail,
  fetchCVAnalyzerResults,
  type APIPagination,
  type CVAnalyzerResultDetailResponse,
  type CVAnalyzerResultHistoryItem,
} from "@/lib/api";
import { ProfileShell, Skeleton } from "../_components/ProfileShell";

const scoreStyles = [
  { min: 85, className: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  { min: 70, className: "bg-blue-50 text-blue-700 border-blue-100" },
  { min: 0, className: "bg-amber-50 text-amber-700 border-amber-100" },
];

function formatDateTime(dateValue: string): string {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatFileSize(sizeBytes: number | undefined): string {
  if (!sizeBytes) return "-";
  if (sizeBytes < 1024 * 1024) {
    return `${Math.round(sizeBytes / 1024).toLocaleString("en-US")} KB`;
  }

  return `${(sizeBytes / (1024 * 1024)).toLocaleString("en-US", {
    maximumFractionDigits: 1,
  })} MB`;
}

function formatEnumLabel(value: string | null | undefined): string {
  if (!value) return "-";
  return value
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
}

function getScoreStyle(score: number): string {
  return (
    scoreStyles.find((style) => score >= style.min)?.className ??
    scoreStyles[scoreStyles.length - 1].className
  );
}

function ScorePill({ label, score }: { label: string; score: number }) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] font-bold ${getScoreStyle(score)}`}
    >
      <span>{label}</span>
      <span>{score}</span>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center">
      <p className="text-[14px] font-semibold text-gray-700">
        No CV analysis history yet.
      </p>
      <p className="mt-1 max-w-sm text-[13px] text-gray-400">
        Saved analysis results will appear here after the CV is analyzed.
      </p>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-52" />
          <Skeleton className="h-4 w-36" />
        </div>
        <Skeleton className="h-9 w-9 rounded-full" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-20 rounded-xl" />
        <Skeleton className="h-20 rounded-xl" />
      </div>
      <Skeleton className="h-24 rounded-xl" />
      <Skeleton className="h-36 rounded-xl" />
    </div>
  );
}

export default function CVAnalyzeHistoryPage() {
  const [results, setResults] = useState<CVAnalyzerResultHistoryItem[]>([]);
  const [pagination, setPagination] = useState<APIPagination | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] =
    useState<CVAnalyzerResultDetailResponse["data"] | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const router = useRouter();

  const loadResults = useCallback(async () => {
    await Promise.resolve();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchCVAnalyzerResults({
        page,
        limit: 10,
        sortBy: "analyzedAt",
        sortOrder: "desc",
      });
      setResults(response.data);
      setPagination(response.meta.pagination);
    } catch (err: unknown) {
      if (err instanceof APIError && err.status === 401) {
        router.push("/login");
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load CV analysis history",
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, [page, router]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadResults();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadResults]);

  const handleSelectResult = async (resultId: string) => {
    setSelectedId(resultId);
    setDetail(null);
    setDetailError(null);
    setIsDetailLoading(true);

    try {
      const response = await fetchCVAnalyzerResultDetail(resultId);
      setDetail(response.data);
    } catch (err: unknown) {
      if (err instanceof APIError && err.status === 401) {
        router.push("/login");
      } else {
        setDetailError(
          err instanceof Error
            ? err.message
            : "Failed to load CV analysis detail",
        );
      }
    } finally {
      setIsDetailLoading(false);
    }
  };

  const selectedListItem =
    selectedId ? results.find((result) => result.id === selectedId) : null;

  return (
    <ProfileShell
      activeSection="cv-history"
      title="CV Analyze History"
      description="Review previous CV analysis results and see the full recommendation details."
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-[18px] font-bold text-gray-900">
                Analysis History
              </h2>
            </div>
          </div>

          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-gray-100 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/5" />
                      <Skeleton className="h-3 w-2/5" />
                    </div>
                    <Skeleton className="h-8 w-20 rounded-full" />
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Skeleton className="h-8 w-24 rounded-full" />
                    <Skeleton className="h-8 w-24 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="space-y-3">
                {results.map((result) => {
                  const isSelected = selectedId === result.id;

                  return (
                    <button
                      key={result.id}
                      type="button"
                      onClick={() => handleSelectResult(result.id)}
                      className={`w-full rounded-xl border p-4 text-left transition-colors ${
                        isSelected
                          ? "border-blue-200 bg-blue-50/60"
                          : "border-gray-100 bg-white hover:border-blue-100 hover:bg-[#F8FBFF]"
                      }`}
                      aria-pressed={isSelected}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 text-[12px] font-semibold text-gray-400">
                            <FileText className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">
                              {result.cvFile?.originalFileName ?? "Unnamed CV"}
                            </span>
                          </div>
                          <p className="mt-2 text-[14px] font-semibold leading-6 text-gray-900">
                            {result.overallImpressionPreview}
                          </p>
                          <p className="mt-1 text-[12px] text-gray-400">
                            {formatDateTime(result.analyzedAt)} /{" "}
                            {formatEnumLabel(result.compareSource)}
                          </p>
                        </div>
                        <ChevronRight
                          className={`mt-1 h-4 w-4 shrink-0 ${
                            isSelected ? "text-blue-500" : "text-gray-300"
                          }`}
                        />
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <ScorePill
                          label="Job fit"
                          score={result.jobFitAlignment.score}
                        />
                        <ScorePill
                          label="ATS"
                          score={result.atsFriendliness.score}
                        />
                      </div>

                      {result.topActionablesPreview.length > 0 && (
                        <div className="mt-4 space-y-1.5">
                          {result.topActionablesPreview
                            .slice(0, 2)
                            .map((actionable) => (
                              <p
                                key={actionable}
                                className="text-[12px] leading-5 text-gray-500"
                              >
                                - {actionable}
                              </p>
                            ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {pagination && pagination.totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <button
                    disabled={!pagination.hasPrevPage}
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <span className="text-[13px] text-gray-500">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button
                    disabled={!pagination.hasNextPage}
                    onClick={() => setPage((current) => current + 1)}
                    className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <EmptyState />
          )}
        </section>

        <aside className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          {!selectedId ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
              <p className="text-[14px] font-semibold text-gray-700">
                Select an analysis result.
              </p>
              <p className="mt-1 max-w-xs text-[13px] text-gray-400">
                Recommendation details, section reviews, and job match will appear in this panel.
              </p>
            </div>
          ) : isDetailLoading ? (
            <DetailSkeleton />
          ) : detailError ? (
            <div>
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-[18px] font-bold text-gray-900">
                    Analysis Detail
                  </h2>
                  <p className="mt-1 text-[13px] text-gray-400">
                    {selectedListItem?.cvFile?.originalFileName ?? selectedId}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedId(null);
                    setDetailError(null);
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                  aria-label="Close detail"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
                {detailError}
              </div>
            </div>
          ) : detail ? (
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-[18px] font-bold text-gray-900">
                    Analysis Detail
                  </h2>
                  <p className="mt-1 text-[13px] text-gray-400">
                    {detail.context.cvFile?.originalFileName ?? "Unnamed CV"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedId(null);
                    setDetail(null);
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                  aria-label="Close detail"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-gray-100 bg-[#F8F9FA] p-4">
                  <p className="text-[11px] font-bold uppercase text-gray-400">
                    Job Fit
                  </p>
                  <p className="mt-1 text-[28px] font-bold text-gray-900">
                    {detail.analysisResult.jobFitAlignment.score}
                  </p>
                  <p className="mt-1 text-[12px] leading-5 text-gray-500">
                    {detail.analysisResult.jobFitAlignment.summary}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-[#F8F9FA] p-4">
                  <p className="text-[11px] font-bold uppercase text-gray-400">
                    ATS
                  </p>
                  <p className="mt-1 text-[28px] font-bold text-gray-900">
                    {detail.analysisResult.atsFriendliness.score}
                  </p>
                  <p className="mt-1 text-[12px] leading-5 text-gray-500">
                    {detail.analysisResult.atsFriendliness.summary}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-[14px] font-bold text-gray-900">
                  Overall Impression
                </h3>
                <p className="mt-2 text-[13px] leading-6 text-gray-600">
                  {detail.analysisResult.overallImpression}
                </p>
              </div>

              <div>
                <h3 className="text-[14px] font-bold text-gray-900">
                  Top Actionables
                </h3>
                <ul className="mt-3 space-y-2">
                  {detail.analysisResult.topActionables.map((actionable) => (
                    <li
                      key={actionable}
                      className="rounded-lg bg-blue-50 px-3 py-2 text-[13px] leading-5 text-blue-800"
                    >
                      {actionable}
                    </li>
                  ))}
                </ul>
              </div>

              {detail.analysisResult.sectionReviews.length > 0 && (
                <div>
                  <h3 className="text-[14px] font-bold text-gray-900">
                    Review Section
                  </h3>
                  <div className="mt-3 space-y-3">
                    {detail.analysisResult.sectionReviews.map((section) => (
                      <div
                        key={section.sectionName}
                        className="rounded-xl border border-gray-100 p-4"
                      >
                        <h4 className="text-[13px] font-bold text-gray-900">
                          {section.sectionName}
                        </h4>
                        <p className="mt-2 text-[13px] leading-6 text-gray-600">
                          {section.analysis}
                        </p>
                        <ul className="mt-3 space-y-1.5">
                          {section.actionPoints.map((point) => (
                            <li
                              key={point}
                              className="text-[12px] leading-5 text-gray-500"
                            >
                              - {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {detail.analysisResult.jobRecommendations.length > 0 && (
                <div>
                  <h3 className="text-[14px] font-bold text-gray-900">
                    Job Recommendations
                  </h3>
                  <div className="mt-3 space-y-3">
                    {detail.analysisResult.jobRecommendations.map((job) => (
                      <div
                        key={job.jobId}
                        className="rounded-xl border border-gray-100 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="text-[13px] font-bold text-gray-900">
                              {job.title}
                            </h4>
                            <p className="mt-0.5 text-[12px] text-gray-400">
                              {job.companyName}
                            </p>
                          </div>
                          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[12px] font-bold text-emerald-700">
                            {job.matchScore}
                          </span>
                        </div>
                        <p className="mt-3 text-[13px] leading-6 text-gray-600">
                          {job.reason}
                        </p>
                        <p className="mt-2 text-[12px] font-semibold leading-5 text-blue-700">
                          {job.nextStep}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-xl border border-gray-100 bg-[#F8F9FA] p-4">
                <div className="grid grid-cols-2 gap-3 text-[12px] text-gray-500">
                  <div>
                    <p className="font-bold uppercase text-gray-400">Mode</p>
                    <p className="mt-1 text-gray-700">
                      {formatEnumLabel(detail.context.inputMode)}
                    </p>
                  </div>
                  <div>
                    <p className="font-bold uppercase text-gray-400">Source</p>
                    <p className="mt-1 text-gray-700">
                      {formatEnumLabel(detail.context.compareSource)}
                    </p>
                  </div>
                  <div>
                    <p className="font-bold uppercase text-gray-400">File</p>
                    <p className="mt-1 text-gray-700">
                      {formatFileSize(detail.context.inputSummary?.file?.sizeBytes)}
                    </p>
                  </div>
                  <div>
                    <p className="font-bold uppercase text-gray-400">Analyzed At</p>
                    <p className="mt-1 text-gray-700">
                      {formatDateTime(detail.analysisResult.analyzedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex min-h-[420px] items-center justify-center text-[13px] text-gray-400">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading details...
            </div>
          )}
        </aside>
      </div>
    </ProfileShell>
  );
}
