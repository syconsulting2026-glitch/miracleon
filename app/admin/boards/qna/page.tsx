"use client";

import Header from "@/components/admin/Header";
import Sidebar from "@/components/admin/Siderbar";
import { useQnas } from "@/hooks/useQna";
import Link from "next/link";
import { useState } from "react";

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
};

export default function AdminQnaPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [page, setPage] = useState(1);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const { data, isLoading, isError, error } = useQnas({
    page,
    pageSize: 10,
    q: searchKeyword,
  });

  const items = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  const handleSearch = () => {
    setPage(1);
    setSearchKeyword(searchInput.trim());
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar sidebarOpen={sidebarOpen} />

      <div className="lg:pl-72">
        <Header sidebarOpen={sidebarOpen} onToggleSidebar={toggleSidebar} />

        <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <section className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-blue-600">게시판 관리</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
                Q&amp;A 관리
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                문의 목록을 확인하고 답변을 관리할 수 있습니다.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_120px]">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                  placeholder="제목으로 검색"
                  className="h-11 rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-gray-400"
                />

                <button
                  type="button"
                  onClick={handleSearch}
                  className="h-11 rounded-xl bg-gray-100 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
                >
                  검색
                </button>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="hidden grid-cols-[90px_1fr_120px_120px_100px] bg-gray-100 px-6 py-4 text-sm font-semibold text-gray-700 md:grid">
                <div>번호</div>
                <div>제목</div>
                <div>작성자</div>
                <div>작성일</div>
                <div>상태</div>
              </div>

              <div className="divide-y divide-gray-200">
                {isLoading ? (
                  <div className="px-6 py-20 text-center text-sm text-gray-500">
                    불러오는 중...
                  </div>
                ) : isError ? (
                  <div className="px-6 py-20 text-center text-sm text-red-500">
                    {error?.message || "목록을 불러오지 못했습니다."}
                  </div>
                ) : items.length > 0 ? (
                  items.map((item) => (
                    <Link
                      key={item.id}
                      href={`/admin/boards/qna/${item.id}`}
                      className="block px-4 py-5 transition hover:bg-gray-50 md:px-6"
                    >
                      <div className="grid grid-cols-1 gap-2 md:grid-cols-[90px_1fr_120px_120px_100px] md:items-center">
                        <div className="text-sm font-semibold text-gray-500">
                          {item.id}
                        </div>

                        <div className="min-w-0">
                          <div className="flex min-w-0 items-center gap-2">
                            {item.isSecret && (
                              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">
                                비밀글
                              </span>
                            )}
                            <span className="truncate font-medium text-gray-900 hover:text-blue-600">
                              {item.title}
                            </span>
                          </div>

                          <div className="mt-1 text-xs text-gray-500 md:hidden">
                            {item.authorName} · {formatDate(item.createdAt)}
                          </div>
                        </div>

                        <div className="hidden text-sm text-gray-600 md:block">
                          {item.authorName}
                        </div>

                        <div className="hidden text-sm text-gray-600 md:block">
                          {formatDate(item.createdAt)}
                        </div>

                        <div className="md:block">
                          {item.hasAnswer ? (
                            <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                              답변완료
                            </span>
                          ) : (
                            <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                              답변대기
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="px-6 py-20 text-center text-sm text-gray-500">
                    등록된 문의가 없습니다.
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page <= 1}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-700 disabled:opacity-50"
              >
                이전
              </button>

              <span className="text-sm text-gray-600">
                {page} / {Math.max(totalPages, 1)}
              </span>

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
        </main>
      </div>
    </div>
  );
}