"use client";

import Header from "@/components/admin/Header";
import Sidebar from "@/components/admin/Siderbar";
import {
  useApplyList,
  useBulkDeleteApply,
  useBulkUpdateApplyStatus,
  useDeleteApply,
  useUpdateApplyStatus,
} from "@/hooks/useApply";
import { ApplyStatus } from "@/types/apply";
import Link from "next/link";
import { useMemo, useState } from "react";

const STATUS_OPTIONS: ApplyStatus[] = ["NEW", "CONTACTED", "DONE", "CANCELLED"];

const statusLabel = (status: ApplyStatus) => {
  switch (status) {
    case "NEW":
      return "신규";
    case "CONTACTED":
      return "연락완료";
    case "DONE":
      return "처리완료";
    case "CANCELLED":
      return "취소";
  }
};

export default function AdminApplysPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [qInput, setQInput] = useState("");
  const [q, setQ] = useState("");
  const [classType, setClassType] = useState<"" | "AI" | "CODING">("");
  const [status, setStatus] = useState<"" | ApplyStatus>("");
  const [district, setDistrict] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<ApplyStatus>("CONTACTED");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const { data, isLoading, isError, error } = useApplyList({
    page,
    pageSize: 10,
    q,
    classType,
    status,
    district,
    order: "new",
  });

  const deleteOneMutation = useDeleteApply();
  const bulkDeleteMutation = useBulkDeleteApply();
  const updateStatusMutation = useUpdateApplyStatus();
  const bulkStatusMutation = useBulkUpdateApplyStatus();

  const items = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;
  const allChecked = items.length > 0 && selectedIds.length === items.length;

  const busy =
    deleteOneMutation.isPending ||
    bulkDeleteMutation.isPending ||
    updateStatusMutation.isPending ||
    bulkStatusMutation.isPending;

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const toggleOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelectedIds(allChecked ? [] : items.map((item) => item.id));
  };

  const handleSearch = () => {
    setPage(1);
    setQ(qInput.trim());
  };

  const handleDeleteOne = async (id: number) => {
    if (!confirm("삭제할까요?")) return;
    await deleteOneMutation.mutateAsync(id);
    setSelectedIds((prev) => prev.filter((v) => v !== id));
  };

  const handleBulkDelete = async () => {
    if (!selectedIds.length) return;
    if (!confirm(`선택한 ${selectedIds.length}건을 삭제할까요?`)) return;
    await bulkDeleteMutation.mutateAsync(selectedIds);
    setSelectedIds([]);
  };

  const handleChangeStatusOne = async (id: number, nextStatus: ApplyStatus) => {
    await updateStatusMutation.mutateAsync({ id, status: nextStatus });
  };

  const handleBulkStatus = async () => {
    if (!selectedIds.length) return;
    await bulkStatusMutation.mutateAsync({ ids: selectedIds, status: selectedStatus });
    setSelectedIds([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar sidebarOpen={sidebarOpen} />

      <div className="lg:pl-72">
        <Header sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((p) => !p)} />

        <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-blue-600">신청 관리</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight">수강신청 관리</h1>
            <p className="mt-1 text-sm text-gray-500">수강신청 목록 조회, 상태변경, 삭제가 가능합니다.</p>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
              <select
                value={classType}
                onChange={(e) => setClassType(e.target.value as "" | "AI" | "CODING")}
                className="h-11 rounded-xl border border-gray-200 px-3 text-sm outline-none"
              >
                <option value="">수업 전체</option>
                <option value="AI">AI</option>
                <option value="CODING">CODING</option>
              </select>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "" | ApplyStatus)}
                className="h-11 rounded-xl border border-gray-200 px-3 text-sm outline-none"
              >
                <option value="">상태 전체</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {statusLabel(s)}
                  </option>
                ))}
              </select>
              <input
                value={qInput}
                onChange={(e) => setQInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="이름/연락처/주소 검색"
                className="h-11 rounded-xl border border-gray-200 px-4 text-sm outline-none md:col-span-2"
              />
              
              <button
                type="button"
                onClick={handleSearch}
                className="h-11 rounded-xl bg-gray-900 text-sm font-semibold text-white"
              >
                검색
              </button>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-[1fr_180px_180px_120px]">
              <input
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="구/군"
                className="h-11 rounded-xl border border-gray-200 px-4 text-sm outline-none"
              />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as ApplyStatus)}
                className="h-11 rounded-xl border border-gray-200 px-3 text-sm outline-none"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {statusLabel(s)}
                  </option>
                ))}
              </select>
              <button
                type="button"
                disabled={busy || selectedIds.length === 0}
                onClick={handleBulkStatus}
                className="h-11 rounded-xl bg-blue-600 text-sm font-semibold text-white disabled:opacity-50"
              >
                선택 상태변경
              </button>
              <button
                type="button"
                disabled={busy || selectedIds.length === 0}
                onClick={handleBulkDelete}
                className="h-11 rounded-xl bg-red-600 text-sm font-semibold text-white disabled:opacity-50"
              >
                선택 삭제
              </button>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="grid grid-cols-[60px_80px_1fr_150px_120px_140px_140px] bg-gray-100 px-6 py-4 text-sm font-semibold text-gray-700">
              <div>
                <input type="checkbox" checked={allChecked} onChange={toggleAll} />
              </div>
              <div>번호</div>
              <div>신청자</div>
              <div>연락처</div>
              <div>수업</div>
              <div>상태</div>
              <div>관리</div>
            </div>

            <div className="divide-y divide-gray-200">
              {isLoading ? (
                <div className="px-6 py-16 text-center text-sm text-gray-500">불러오는 중...</div>
              ) : isError ? (
                <div className="px-6 py-16 text-center text-sm text-red-500">
                  {error?.message || "목록 조회 실패"}
                </div>
              ) : items.length === 0 ? (
                <div className="px-6 py-16 text-center text-sm text-gray-500">신청 내역이 없습니다.</div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[60px_80px_1fr_150px_120px_140px_140px] items-center px-6 py-4 text-sm"
                  >
                    <div>
                      <input
                        type="checkbox"
                        checked={selectedSet.has(item.id)}
                        onChange={() => toggleOne(item.id)}
                      />
                    </div>
                    <div>{item.id}</div>
                    <div className="min-w-0">
                      <Link
                        href={`/admin/apply/${item.id}`}
                        className="truncate font-semibold text-gray-900 hover:text-blue-600"
                      >
                        {item.name}
                      </Link>
                      <p className="truncate text-xs text-gray-500">{item.address}</p>
                    </div>
                    <div>{item.phone}</div>
                    <div>{item.classType}</div>
                    <div>
                      <select
                        value={item.status}
                        onChange={(e) => handleChangeStatusOne(item.id, e.target.value as ApplyStatus)}
                        className="h-9 rounded-lg border border-gray-200 px-2 text-xs"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {statusLabel(s)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleDeleteOne(item.id)}
                        className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="inline-flex h-10 items-center justify-center rounded-xl border border-gray-200 bg-white px-4 text-sm disabled:opacity-50"
            >
              이전
            </button>
            <span className="text-sm text-gray-600">
              {page} / {Math.max(totalPages, 1)}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="inline-flex h-10 items-center justify-center rounded-xl border border-gray-200 bg-white px-4 text-sm disabled:opacity-50"
            >
              다음
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}