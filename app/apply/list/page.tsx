"use client";

import { useApplyList } from "@/hooks/useApply";
import type { ApplyStatus } from "@/types/apply";
import Link from "next/link";
import { useMemo, useState } from "react";

const STATUS_OPTIONS: Array<{ value: "" | ApplyStatus; label: string }> = [
  { value: "", label: "전체 상태" },
  { value: "NEW", label: "신규" },
  { value: "CONTACTED", label: "연락완료" },
  { value: "DONE", label: "처리완료" },
  { value: "CANCELLED", label: "취소" },
];

const CLASS_OPTIONS: Array<{ value: "" | "AI" | "CODING"; label: string }> = [
  { value: "", label: "전체 수업" },
  { value: "AI", label: "AI" },
  { value: "CODING", label: "CODING" },
];

function getStatusLabel(status: ApplyStatus) {
  switch (status) {
    case "NEW":
      return "신규";
    case "CONTACTED":
      return "연락완료";
    case "DONE":
      return "처리완료";
    case "CANCELLED":
      return "취소";
    default:
      return status;
  }
}

function getStatusBadgeClass(status: ApplyStatus) {
  switch (status) {
    case "NEW":
      return "bg-blue-50 text-blue-700 ring-blue-200";
    case "CONTACTED":
      return "bg-amber-50 text-amber-700 ring-amber-200";
    case "DONE":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "CANCELLED":
      return "bg-red-50 text-red-700 ring-red-200";
    default:
      return "bg-gray-50 text-gray-700 ring-gray-200";
  }
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export default function ApplyListClient() {
  const [page, setPage] = useState(1);
  const [qInput, setQInput] = useState("");
  const [q, setQ] = useState("");
  const [classType, setClassType] = useState<"" | "AI" | "CODING">("");
  const [status, setStatus] = useState<"" | ApplyStatus>("");
  const [district, setDistrict] = useState("");

  const queryParams = useMemo(
    () => ({
      page,
      pageSize: 10,
      q,
      classType,
      status,
      district,
      order: "new" as const,
    }),
    [page, q, classType, status, district]
  );

  const { data, isLoading, isError, error } = useApplyList(queryParams);

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const handleSearch = () => {
    setPage(1);
    setQ(qInput.trim());
  };

  const handleReset = () => {
    setPage(1);
    setQInput("");
    setQ("");
    setClassType("");
    setStatus("");
    setDistrict("");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold text-blue-600">MIRACLEON</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            수강신청 목록
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            접수된 수강신청 내역을 확인할 수 있습니다.
          </p>
        </section>

        <section className="mt-6 rounded-3xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
            <input
              value={qInput}
              onChange={(e) => setQInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="이름 / 연락처 / 주소 검색"
              className="h-12 rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-gray-400 md:col-span-2"
            />

            <select
              value={classType}
              onChange={(e) => {
                setPage(1);
                setClassType(e.target.value as "" | "AI" | "CODING");
              }}
              className="h-12 rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-gray-400"
            >
              {CLASS_OPTIONS.map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={status}
              onChange={(e) => {
                setPage(1);
                setStatus(e.target.value as "" | ApplyStatus);
              }}
              className="h-12 rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-gray-400"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleSearch}
              className="h-12 rounded-xl bg-gray-900 text-sm font-semibold text-white"
            >
              검색
            </button>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-[1fr_120px]">
            <input
              value={district}
              onChange={(e) => {
                setPage(1);
                setDistrict(e.target.value);
              }}
              placeholder="구/군 검색"
              className="h-12 rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-gray-400"
            />

            <button
              type="button"
              onClick={handleReset}
              className="h-12 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700"
            >
              초기화
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              총 <span className="font-semibold text-gray-900">{total}</span>건
            </p>

            <Link
              href="/apply"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white"
            >
              수강 신청하기
            </Link>
          </div>
        </section>

        <section className="mt-6 space-y-4">
          {isLoading ? (
            <div className="rounded-3xl border border-gray-200 bg-white px-6 py-16 text-center text-sm text-gray-500 shadow-sm">
              목록을 불러오는 중입니다.
            </div>
          ) : isError ? (
            <div className="rounded-3xl border border-gray-200 bg-white px-6 py-16 text-center text-sm text-red-500 shadow-sm">
              {error?.message || "목록 조회에 실패했습니다."}
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-3xl border border-gray-200 bg-white px-6 py-16 text-center text-sm text-gray-500 shadow-sm">
              신청 내역이 없습니다.
            </div>
          ) : (
            items.map((item) => (
              <Link
                key={item.id}
                href={`/apply/${item.id}`}
                className="block rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                        #{item.id}
                      </span>
                      <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                        {item.classType}
                      </span>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${getStatusBadgeClass(
                          item.status
                        )}`}
                      >
                        {getStatusLabel(item.status)}
                      </span>
                    </div>

                    <h2 className="mt-3 text-lg font-bold text-gray-900">
                      {item.name}
                    </h2>

                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      <p>연락처: {item.phone}</p>
                      <p>주소: {item.address}</p>
                      <p>유입경로: {item.howFound}</p>
                      <p>접수일: {formatDate(item.createdAt)}</p>
                    </div>
                  </div>

                  <div className="shrink-0 text-sm font-semibold text-blue-600">
                    상세보기 →
                  </div>
                </div>
              </Link>
            ))
          )}
        </section>

        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page <= 1}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            이전
          </button>

          <span className="px-3 text-sm text-gray-600">
            {page} / {Math.max(totalPages, 1)}
          </span>

          <button
            type="button"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page >= totalPages}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
}