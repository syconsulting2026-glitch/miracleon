"use client";

import Header from "@/components/admin/Header";
import Sidebar from "@/components/admin/Siderbar";
import { useDeleteNotice, useNoticeDetail } from "@/hooks/useNotices";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

const formatDateTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")} ${String(
    date.getHours()
  ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
};

export default function AdminNoticeDetailPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const { data: notice, isLoading, isError, error } = useNoticeDetail(id);

  const deleteMutation = useDeleteNotice();

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  
  const handleDelete = async () => {
    if (!notice) return;

    const ok = window.confirm("이 공지사항을 삭제하시겠습니까?");
    if (!ok) return;

    try {
      await deleteMutation.mutateAsync({ id: notice.id });
      alert("삭제되었습니다.");
      router.push("/admin/boards/notice");
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
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-blue-600">게시판 관리</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
                공지사항 상세보기
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                공지사항 내용을 확인하고 수정 또는 삭제할 수 있습니다.
              </p>
            </div>

            {isLoading ? (
              <div className="rounded-2xl border border-gray-200 bg-white px-6 py-20 text-center text-sm text-gray-500 shadow-sm">
                불러오는 중...
              </div>
            ) : isError ? (
              <div className="rounded-2xl border border-gray-200 bg-white px-6 py-20 text-center text-sm text-red-500 shadow-sm">
                {error?.message || "공지사항을 불러오지 못했습니다."}
              </div>
            ) : !notice ? (
              <div className="rounded-2xl border border-gray-200 bg-white px-6 py-20 text-center text-sm text-gray-500 shadow-sm">
                존재하지 않는 공지사항입니다.
              </div>
            ) : (
              <>
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                  <div className="border-b border-gray-200 px-6 py-6">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                        공지사항
                      </span>

                      {notice.attachments.length > 0 && (
                        <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                          첨부 {notice.attachments.length}
                        </span>
                      )}
                    </div>

                    <h2 className="text-2xl font-bold leading-snug text-gray-900">
                      {notice.title}
                    </h2>

                    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
                      <span>작성일: {formatDateTime(notice.createdAt)}</span>
                      <span>수정일: {formatDateTime(notice.updatedAt)}</span>
                      <span>조회수: {notice.views}</span>
                    </div>
                  </div>

                  <div className="min-h-[320px] whitespace-pre-wrap px-6 py-8 text-[15px] leading-7 text-gray-700">
                    {notice.content}
                  </div>

                  {notice.attachments.length > 0 && (
                    <div className="border-t border-gray-200 px-6 py-6">
                      <h3 className="mb-4 text-sm font-bold text-gray-900">
                        첨부파일
                      </h3>

                      <div className="space-y-3">
                        {notice.attachments.map((file) => (
                          <div
                            key={file.id}
                            className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                          >
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-gray-900">
                                  {file.originalName}
                                </p>
                                <p className="mt-1 text-xs text-gray-500">
                                  {file.fileType === "image" ? "이미지" : "파일"}
                                </p>
                              </div>

                              {file.fileUrl && (
                                <a
                                  href={`${file.fileUrl}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex h-10 items-center justify-center rounded-xl border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                                >
                                  열기
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                  <Link
                    href="/admin/boards/notice"
                    className="inline-flex h-11 items-center justify-center rounded-xl border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                  >
                    목록으로
                  </Link>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      href="/admin/boards/notice/write"
                      className="inline-flex h-11 items-center justify-center rounded-xl border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                    >
                      새 글 작성
                    </Link>

                    <Link
                      href={`/admin/boards/notice/${notice.id}/edit`}
                      className="inline-flex h-11 items-center justify-center rounded-xl bg-gray-900 px-4 text-sm font-semibold text-white transition hover:bg-gray-700"
                    >
                      수정하기
                    </Link>

                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={deleteMutation.isPending}
                      className="inline-flex h-11 items-center justify-center rounded-xl border border-red-200 bg-red-50 px-4 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-60"
                    >
                      삭제하기
                    </button>
                  </div>
                </div>
              </>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}