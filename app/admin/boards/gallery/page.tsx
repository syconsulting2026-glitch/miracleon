"use client";

import Header from "@/components/admin/Header";
import Sidebar from "@/components/admin/Siderbar";
import { useDeleteManyGalleries, useGalleries } from "@/hooks/useGallery";
import Link from "next/link";
import { useMemo, useState } from "react";

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
};

export default function AdminGalleryPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const { data, isLoading, isError, error } = useGalleries({
    page,
    pageSize: 12,
    q: searchKeyword,
  });

  const deleteManyMutation = useDeleteManyGalleries();

  const items = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  const allVisibleIds = useMemo(() => items.map((item) => item.id), [items]);
  const isAllSelected =
    allVisibleIds.length > 0 &&
    allVisibleIds.every((id) => selectedIds.includes(id));

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds((prev) => prev.filter((id) => !allVisibleIds.includes(id)));
      return;
    }

    setSelectedIds((prev) => Array.from(new Set([...prev, ...allVisibleIds])));
  };

  const toggleSelectOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSearch = () => {
    setPage(1);
    setSelectedIds([]);
    setSearchKeyword(searchInput.trim());
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) {
      alert("삭제할 갤러리를 선택해주세요.");
      return;
    }

    const ok = window.confirm(
      `선택한 ${selectedIds.length}개의 갤러리를 삭제하시겠습니까?`
    );
    if (!ok) return;

    try {
      await deleteManyMutation.mutateAsync({ ids: selectedIds });
      setSelectedIds([]);
      alert("삭제되었습니다.");
    } catch (e: any) {
      alert(e?.response?.data?.message || "삭제 중 오류가 발생했습니다.");
    }
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
            <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">게시판 관리</p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
                  활동 갤러리 관리
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  갤러리 목록을 확인하고 등록, 선택 삭제를 할 수 있습니다.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleDeleteSelected}
                  disabled={deleteManyMutation.isPending}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-red-200 bg-red-50 px-4 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-60"
                >
                  선택 삭제
                </button>

                <Link
                  href="/admin/boards/gallery/write"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-gray-900 px-4 text-sm font-semibold text-white transition hover:bg-gray-700"
                >
                  글쓰기
                </Link>
              </div>
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
              <div className="hidden grid-cols-[60px_120px_120px_1fr_140px_100px] bg-gray-100 px-6 py-4 text-sm font-semibold text-gray-700 md:grid">
                <div className="flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="h-4 w-4"
                  />
                </div>
                <div>썸네일</div>
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
                    {error?.message || "목록을 불러오지 못했습니다."}
                  </div>
                ) : items.length > 0 ? (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="px-4 py-4 transition hover:bg-gray-50 md:px-6"
                    >
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-[60px_120px_120px_1fr_140px_100px] md:items-center">
                        <div className="flex items-center justify-start md:justify-center">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(item.id)}
                            onChange={() => toggleSelectOne(item.id)}
                            className="h-4 w-4"
                          />
                        </div>

                        <div>
                          {item.thumbnail ? (
                            <img
                              src={`${item.thumbnail.fileUrl}`}
                              alt={item.thumbnail.originalName}
                              className="h-16 w-24 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="flex h-16 w-24 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                              이미지 없음
                            </div>
                          )}
                        </div>

                        <div className="text-sm font-semibold text-gray-600">
                          {item.id}
                        </div>

                        <div className="min-w-0">
                          <Link
                            href={`/admin/boards/gallery/${item.id}`}
                            className="flex min-w-0 items-center gap-2"
                          >
                            <span className="truncate font-medium text-gray-900 hover:text-blue-600">
                              {item.title}
                            </span>

                            <span className="inline-flex rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                              이미지 {item.imageCount}
                            </span>
                          </Link>

                          <div className="mt-1 line-clamp-1 text-xs text-gray-500 md:hidden">
                            {item.description || "설명 없음"} · {formatDate(item.createdAt)} · 조회 {item.views}
                          </div>
                        </div>

                        <div className="hidden text-sm text-gray-600 md:block">
                          {formatDate(item.createdAt)}
                        </div>

                        <div className="hidden text-sm text-gray-600 md:block">
                          {item.views}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-20 text-center text-sm text-gray-500">
                    등록된 갤러리가 없습니다.
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