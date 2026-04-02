"use client";

import { useGalleries } from "@/hooks/useGallery";
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

export default function GalleryListPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  const { data, isLoading, isError, error } = useGalleries({
    page,
    pageSize: 12,
    q: searchKeyword,
  });

  const items = data?.items ?? [];
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
            활동 갤러리
          </h1>
          <p className="mt-3 text-sm text-gray-500 sm:text-base">
            MIRACLEON의 활동 사진을 확인해보세요.
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

        {isLoading ? (
          <div className="py-24 text-center text-sm text-gray-500">불러오는 중...</div>
        ) : isError ? (
          <div className="py-24 text-center text-sm text-red-500">
            {error?.message || "갤러리를 불러오지 못했습니다."}
          </div>
        ) : items.length === 0 ? (
          <div className="py-24 text-center text-sm text-gray-500">
            등록된 갤러리가 없습니다.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <Link
                key={item.id}
                href={`/boards/gallery/${item.id}`}
                className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                {item.thumbnail ? (
                  <img
                    src={`${item.thumbnail.fileUrl}`}
                    alt={item.thumbnail.originalName}
                    className="h-64 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="flex h-64 w-full items-center justify-center bg-gray-100 text-sm text-gray-400">
                    이미지 없음
                  </div>
                )}

                <div className="space-y-3 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                      이미지 {item.imageCount}
                    </span>
                    <span className="text-xs text-gray-500">
                      조회 {item.views}
                    </span>
                  </div>

                  <h2 className="line-clamp-1 text-lg font-bold text-gray-900">
                    {item.title}
                  </h2>

                  <p className="line-clamp-2 text-sm leading-6 text-gray-600">
                    {item.description || "설명이 없습니다."}
                  </p>

                  <p className="text-xs text-gray-500">{formatDate(item.createdAt)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

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