"use client";

import Header from "@/components/admin/Header";
import Sidebar from "@/components/admin/Siderbar";
import { useDeleteFaq, useDeleteManyFaqs, useFaqs } from "@/hooks/useFaqs";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
};

export default function AdminFaqPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [openIds, setOpenIds] = useState<number[]>([]);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const { data, isLoading, isError, error } = useFaqs({
    page,
    pageSize: 10,
    q: searchKeyword,
    category: categoryFilter || undefined,
    admin: true,
  });

  const deleteMutation = useDeleteFaq();
  const deleteManyMutation = useDeleteManyFaqs();

  const faqItems = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  const categories = useMemo(() => {
    const set = new Set<string>();
    faqItems.forEach((item) => {
      if (item.category?.trim()) set.add(item.category.trim());
    });
    return Array.from(set);
  }, [faqItems]);

  const allVisibleIds = useMemo(() => faqItems.map((item) => item.id), [faqItems]);
  const isAllSelected =
    allVisibleIds.length > 0 &&
    allVisibleIds.every((id) => selectedIds.includes(id));

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

  const toggleAccordion = (id: number) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSearch = () => {
    setPage(1);
    setSelectedIds([]);
    setSearchKeyword(searchInput.trim());
    setCategoryFilter(categoryInput);
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) {
      alert("삭제할 FAQ를 선택해주세요.");
      return;
    }

    const ok = window.confirm(
      `선택한 ${selectedIds.length}개의 FAQ를 삭제하시겠습니까?`
    );
    if (!ok) return;

    try {
      await deleteManyMutation.mutateAsync({ ids: selectedIds });
      setSelectedIds([]);
      setOpenIds((prev) => prev.filter((id) => !selectedIds.includes(id)));
      alert("삭제되었습니다.");
    } catch (e: any) {
      alert(e?.response?.data?.message || "삭제 중 오류가 발생했습니다.");
    }
  };

  const handleDeleteOne = async (id: number) => {
    const ok = window.confirm("이 FAQ를 삭제하시겠습니까?");
    if (!ok) return;

    try {
      await deleteMutation.mutateAsync({ id });
      setSelectedIds((prev) => prev.filter((item) => item !== id));
      setOpenIds((prev) => prev.filter((item) => item !== id));
      alert("삭제되었습니다.");
    } catch (e: any) {
      alert(e?.response?.data?.message || "삭제 중 오류가 발생했습니다.");
    }
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

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
                  FAQ 관리
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  FAQ를 등록, 수정, 삭제하고 아코디언 형태로 확인할 수 있습니다.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleDeleteSelected}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-red-200 bg-red-50 px-4 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                >
                  선택 삭제
                </button>

                <Link
                  href="/admin/boards/faq/write"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-gray-900 px-4 text-sm font-semibold text-white transition hover:bg-gray-700"
                >
                  글쓰기
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_180px_120px]">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="질문 또는 답변 검색"
                  className="h-11 rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-gray-400"
                />

                <select
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  className="h-11 rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-gray-400"
                >
                  <option value="">전체</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                  {!categories.includes("기타") && <option value="기타">기타</option>}
                </select>

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
              <div className="hidden grid-cols-[60px_80px_120px_1fr_100px_100px_140px_90px_80px] bg-gray-100 px-6 py-4 text-sm font-semibold text-gray-700 md:grid">
                <div className="flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="h-4 w-4"
                  />
                </div>
                <div>번호</div>
                <div>카테고리</div>
                <div>질문</div>
                <div>고정</div>
                <div>노출</div>
                <div>작성일</div>
                <div>조회수</div>
                <div className="text-center">관리</div>
              </div>

              <div className="divide-y divide-gray-200">
                {isLoading ? (
                  <div className="px-6 py-20 text-center text-sm text-gray-500">
                    불러오는 중...
                  </div>
                ) : isError ? (
                  <div className="px-6 py-20 text-center text-sm text-red-500">
                    {error?.message || "FAQ를 불러오지 못했습니다."}
                  </div>
                ) : faqItems.length === 0 ? (
                  <div className="px-6 py-20 text-center text-sm text-gray-500">
                    등록된 FAQ가 없습니다.
                  </div>
                ) : (
                  faqItems.map((item) => {
                    const isOpen = openIds.includes(item.id);

                    return (
                      <div key={item.id} className="bg-white">
                        <div className="hidden grid-cols-[60px_80px_120px_1fr_100px_100px_140px_90px_80px] items-center px-6 py-4 md:grid">
                          <div className="flex items-center justify-center">
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(item.id)}
                              onChange={() => toggleSelectOne(item.id)}
                              className="h-4 w-4"
                            />
                          </div>

                          <div className="text-sm text-gray-600">{item.id}</div>
                          <div className="text-sm text-gray-600">{item.category}</div>

                          <button
                            type="button"
                            onClick={() => toggleAccordion(item.id)}
                            className="flex items-center justify-between gap-3 text-left"
                          >
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                {item.isPinned && (
                                  <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                                    고정
                                  </span>
                                )}
                                <span className="truncate text-sm font-semibold text-gray-900">
                                  {item.question}
                                </span>
                              </div>
                            </div>

                            {isOpen ? (
                              <ChevronUp className="h-4 w-4 shrink-0 text-gray-500" />
                            ) : (
                              <ChevronDown className="h-4 w-4 shrink-0 text-gray-500" />
                            )}
                          </button>

                          <div className="text-sm text-gray-600">
                            {item.isPinned ? "Y" : "-"}
                          </div>
                          <div className="text-sm text-gray-600">
                            {item.isVisible ? "Y" : "N"}
                          </div>
                          <div className="text-sm text-gray-600">
                            {formatDate(item.createdAt)}
                          </div>
                          <div className="text-sm text-gray-600">{item.views}</div>

                          <div className="flex items-center justify-center gap-2">
                            <Link
                              href={`/admin/boards/faq/${item.id}/edit`}
                              className="inline-flex h-9 items-center justify-center rounded-lg border border-gray-300 bg-white px-3 text-xs font-semibold text-gray-700 transition hover:bg-gray-100"
                            >
                              수정
                            </Link>

                            <button
                              type="button"
                              onClick={() => handleDeleteOne(item.id)}
                              className="inline-flex h-9 items-center justify-center rounded-lg border border-red-200 bg-red-50 px-3 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                            >
                              삭제
                            </button>
                          </div>
                        </div>

                        <div className="px-4 py-4 md:hidden">
                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(item.id)}
                              onChange={() => toggleSelectOne(item.id)}
                              className="mt-1 h-4 w-4"
                            />

                            <div className="min-w-0 flex-1">
                              <button
                                type="button"
                                onClick={() => toggleAccordion(item.id)}
                                className="flex w-full items-start justify-between gap-3 text-left"
                              >
                                <div className="min-w-0">
                                  <div className="mb-2 flex flex-wrap items-center gap-2">
                                    <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
                                      {item.category}
                                    </span>
                                    {item.isPinned && (
                                      <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                                        고정
                                      </span>
                                    )}
                                    {!item.isVisible && (
                                      <span className="inline-flex rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-600">
                                        숨김
                                      </span>
                                    )}
                                  </div>

                                  <p className="text-sm font-semibold text-gray-900">
                                    {item.question}
                                  </p>

                                  <p className="mt-2 text-xs text-gray-500">
                                    {formatDate(item.createdAt)} · 조회 {item.views}
                                  </p>
                                </div>

                                {isOpen ? (
                                  <ChevronUp className="mt-1 h-4 w-4 shrink-0 text-gray-500" />
                                ) : (
                                  <ChevronDown className="mt-1 h-4 w-4 shrink-0 text-gray-500" />
                                )}
                              </button>

                              <div className="mt-3 flex gap-2">
                                <Link
                                  href={`/admin/boards/faq/${item.id}/edit`}
                                  className="inline-flex h-9 items-center justify-center rounded-lg border border-gray-300 bg-white px-3 text-xs font-semibold text-gray-700"
                                >
                                  수정
                                </Link>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteOne(item.id)}
                                  className="inline-flex h-9 items-center justify-center rounded-lg border border-red-200 bg-red-50 px-3 text-xs font-semibold text-red-600"
                                >
                                  삭제
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {isOpen && (
                          <div className="border-t border-gray-200 bg-gray-50 px-6 py-5">
                            <p className="mb-2 text-xs font-semibold text-gray-500">
                              답변
                            </p>
                            <div className="whitespace-pre-wrap text-sm leading-7 text-gray-700">
                              {item.answer}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
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
        </main>
      </div>
    </div>
  );
}