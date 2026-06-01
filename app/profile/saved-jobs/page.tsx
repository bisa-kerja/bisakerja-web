"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import JobCard from "@/components/JobCard";
import {
  APIError,
  fetchBookmarks,
  type APIBookmark,
  type APIPagination,
} from "@/lib/api";
import { BookmarkIcon, SearchIcon } from "../_components/ProfileIcons";
import { ProfileShell, Skeleton } from "../_components/ProfileShell";

export default function SavedJobsPage() {
  const [bookmarks, setBookmarks] = useState<APIBookmark[]>([]);
  const [bookmarkPagination, setBookmarkPagination] =
    useState<APIPagination | null>(null);
  const [isBookmarksLoading, setIsBookmarksLoading] = useState(true);
  const [bookmarkError, setBookmarkError] = useState<string | null>(null);
  const [bookmarkSearchInput, setBookmarkSearchInput] = useState("");
  const [bookmarkKeyword, setBookmarkKeyword] = useState("");
  const [bookmarkPage, setBookmarkPage] = useState(1);
  const router = useRouter();

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

  const handleBookmarkSearch = () => {
    setBookmarkKeyword(bookmarkSearchInput.trim());
    setBookmarkPage(1);
  };

  return (
    <ProfileShell
      activeSection="saved-jobs"
      title="Saved Jobs"
      description="Review and manage the jobs you saved for later."
    >
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-[18px] font-bold text-gray-900">Saved Jobs</h2>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Search saved jobs..."
              value={bookmarkSearchInput}
              onChange={(event) => setBookmarkSearchInput(event.target.value)}
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
    </ProfileShell>
  );
}
