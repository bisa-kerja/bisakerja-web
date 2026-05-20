"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  APIError,
  fetchApplications,
  updateApplicationStatus,
  type APIApplication,
  type APIPagination,
  type ApplicationStatus,
} from "@/lib/api";
import { FileTextIcon, SearchIcon } from "../_components/ProfileIcons";
import { ProfileShell, Skeleton } from "../_components/ProfileShell";

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

export default function ApplicationTrackerPage() {
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
  const router = useRouter();

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

  return (
    <ProfileShell
      activeSection="applications"
      title="Application Tracker"
      description="Track your job applications and update each hiring status."
    >
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
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
              onChange={(event) => setApplicationSearchInput(event.target.value)}
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
                  const isUpdating = updatingApplicationId === application.id;

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
                              {getCompanyInitials(application.job.company.name)}
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
                  setApplicationPage((current) => Math.max(1, current - 1))
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
    </ProfileShell>
  );
}
