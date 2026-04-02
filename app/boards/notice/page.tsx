"use client";

import { useNotices } from "@/hooks/useNotices";
import Link from "next/link";
import { useMemo, useState } from "react";

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}.${String(date.getDate()).padStart(2, "0")}`;
};

export default function NoticeListPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  const { data, isLoading, isError, error } = useNotices({
    page,
    pageSize: 10,
    q: searchKeyword,
  });

  const notices = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);

    for (let i = start; i <= end; i += 1) {
      pages.push(i);
    }

    return pages;
  }, [page, totalPages]);

  const handleSearch = () => {
    setPage(1);
    setSearchKeyword(searchInput.trim());
  };

  return (
    <div className="bg-white text-gray-900">
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold tracking-[0.2em] text-blue-600">
            COMMUNITY
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            공지사항
          </h1>
          <p className="mt-3 text-sm text-gray-500 sm:text-base">
            MIRACLEON의 소식과 공지 내용을 확인해보세요.
          </p>
        </div>

        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:flex-row">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            placeholder="제목으로 검색"
            className="h-12 flex-1 rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-gray-400"
          />

          <button
            type="button"
            onClick={handleSearch}
            className="h-12 rounded-xl bg-gray-900 px-5 text-sm font-semibold text-white transition hover:bg-gray-700"
          >
            검색
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="hidden grid-cols-[100px_1fr_140px_100px] bg-gray-100 px-6 py-4 text-sm font-semibold text-gray-700 md:grid">
            <div>번호</div>
            <div>제목</div>
            <div>작성일</div>
            <div>조회수</div>
          </div>

          <div className="divide-y divide-gray-200">
            {isLoading ? (
              <div className="px-6 py-20 text-center text-sm text-gray-500">
                불러오는 중...
              </div>
            ) : isError ? (
              <div className="px-6 py-20 text-center text-sm text-red-500">
                {error?.message || "공지사항을 불러오지 못했습니다."}
              </div>
            ) : notices.length === 0 ? (
              <div className="px-6 py-20 text-center text-sm text-gray-500">
                등록된 공지사항이 없습니다.
              </div>
            ) : (
              notices.map((item) => (
                <Link
                  key={item.id}
                  href={`/boards/notice/${item.id}`}
                  className="block px-4 py-5 transition hover:bg-gray-50 md:px-6"
                >
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-[100px_1fr_140px_100px] md:items-center">
                    <div className="text-sm font-semibold text-gray-500">
                      {item.id}
                    </div>

                    <div className="min-w-0">
                      <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <span className="truncate text-sm font-medium text-gray-900 sm:text-base">
                          {item.title}
                        </span>

                        {item.hasAttachment && (
                          <span className="inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                            첨부 {item.attachmentCount}
                          </span>
                        )}

                        {item.hasImage && (
                          <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                            이미지
                          </span>
                        )}
                      </div>

                      <div className="mt-1 text-xs text-gray-500 md:hidden">
                        {formatDate(item.createdAt)} · 조회 {item.views}
                      </div>
                    </div>

                    <div className="hidden text-sm text-gray-600 md:block">
                      {formatDate(item.createdAt)}
                    </div>

                    <div className="hidden text-sm text-gray-600 md:block">
                      {item.views}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page <= 1}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-700 disabled:opacity-50"
          >
            이전
          </button>

          {pageNumbers.map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              onClick={() => setPage(pageNumber)}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold transition ${
                pageNumber === page
                  ? "bg-gray-900 text-white"
                  : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {pageNumber}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page >= totalPages}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-700 disabled:opacity-50"
          >
            다음
          </button>
        </div>
      </section>
    </div>
  );
}