"use client";

import Header from "@/components/admin/Header";
import Sidebar from "@/components/admin/Siderbar";
import { useApplyDetail, useDeleteApply, useUpdateApplyStatus } from "@/hooks/useApply";
import { ApplyStatus } from "@/types/apply";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

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

export default function AdminApplyDetailPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const { data, isLoading, isError, error } = useApplyDetail(id);
  const deleteMutation = useDeleteApply();
  const statusMutation = useUpdateApplyStatus();

  const handleDelete = async () => {
    if (!confirm("삭제할까요?")) return;
    await deleteMutation.mutateAsync(id);
    router.push("/admin/applys");
  };

  const handleStatusChange = async (status: ApplyStatus) => {
    await statusMutation.mutateAsync({ id, status });
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

        <main className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div>
              <p className="text-sm font-medium text-blue-600">수강신청 상세</p>
              <h1 className="mt-1 text-2xl font-bold">상세보기</h1>
            </div>
            <Link
              href="/admin/apply"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold"
            >
              목록으로
            </Link>
          </div>

          {isLoading ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
              불러오는 중...
            </div>
          ) : isError || !data ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-red-500 shadow-sm">
              {error?.message || "상세 조회에 실패했습니다."}
            </div>
          ) : (
            <>
              <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="grid gap-0 md:grid-cols-2">
                  <Row label="신청번호" value={String(data.id)} />
                  <Row label="이름" value={data.name} />
                  <Row label="수업 종류" value={data.classType} />
                  <Row label="연락처" value={data.phone} />
                  <Row label="숫자연락처" value={data.phoneDigits} />
                  <Row label="구/군" value={data.district} />
                  <Row label="동/읍/면" value={data.neighborhoodDetail} />
                  <Row label="주소" value={data.address} />
                  <Row label="유입경로" value={data.howFound} />
                  <Row label="추천인" value={data.recommender || "-"} />
                  <Row label="개인정보 동의" value={data.privacyAgree ? "동의" : "미동의"} />
                  <Row label="현재 상태" value={statusLabel(data.status)} />
                </div>
              </section>

              <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold">지원동기</h2>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-gray-700">
                  {data.motivation}
                </p>
              </section>

              <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold">관리</h2>

                <div className="mt-4 flex flex-wrap gap-3">
                  <select
                    defaultValue={data.status}
                    onChange={(e) => handleStatusChange(e.target.value as ApplyStatus)}
                    className="h-11 rounded-xl border border-gray-200 px-3 text-sm"
                  >
                    <option value="NEW">신규</option>
                    <option value="CONTACTED">연락완료</option>
                    <option value="DONE">처리완료</option>
                    <option value="CANCELLED">취소</option>
                  </select>

                  <a
                    href={`tel:${data.phoneDigits}`}
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-gray-900 px-4 text-sm font-semibold text-white"
                  >
                    전화하기
                  </a>

                  <button
                    type="button"
                    onClick={handleDelete}
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-red-600 px-4 text-sm font-semibold text-white"
                  >
                    삭제
                  </button>
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-gray-100 px-6 py-4">
      <p className="text-xs font-semibold text-gray-500">{label}</p>
      <p className="mt-1 text-sm text-gray-900">{value}</p>
    </div>
  );
}