"use client";

import Header from "@/components/admin/Header";
import Sidebar from "@/components/admin/Siderbar";
import { useDeleteGallery, useGalleryDetail } from "@/hooks/useGallery";
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

export default function AdminGalleryDetailPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const { data: gallery, isLoading, isError, error } = useGalleryDetail(id);
  const deleteMutation = useDeleteGallery();

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const handleDelete = async () => {
    if (!gallery) return;
    const ok = window.confirm("이 갤러리를 삭제하시겠습니까?");
    if (!ok) return;

    try {
      await deleteMutation.mutateAsync({ id: gallery.id });
      alert("삭제되었습니다.");
      router.push("/admin/boards/gallery");
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
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-blue-600">게시판 관리</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
              활동 갤러리 상세보기
            </h1>
          </div>

          {isLoading ? (
            <div className="rounded-2xl border border-gray-200 bg-white px-6 py-20 text-center text-sm text-gray-500 shadow-sm">
              불러오는 중...
            </div>
          ) : isError ? (
            <div className="rounded-2xl border border-gray-200 bg-white px-6 py-20 text-center text-sm text-red-500 shadow-sm">
              {error?.message || "갤러리를 불러오지 못했습니다."}
            </div>
          ) : !gallery ? (
            <div className="rounded-2xl border border-gray-200 bg-white px-6 py-20 text-center text-sm text-gray-500 shadow-sm">
              존재하지 않는 갤러리입니다.
            </div>
          ) : (
            <>
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 px-6 py-6">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                      활동 갤러리
                    </span>
                    <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                      이미지 {gallery.images.length}
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold leading-snug text-gray-900">
                    {gallery.title}
                  </h2>

                  <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
                    <span>작성일: {formatDateTime(gallery.createdAt)}</span>
                    <span>수정일: {formatDateTime(gallery.updatedAt)}</span>
                    <span>조회수: {gallery.views}</span>
                  </div>
                </div>

                <div className="whitespace-pre-wrap px-6 py-8 text-[15px] leading-7 text-gray-700">
                  {gallery.description || "설명이 없습니다."}
                </div>

                <div className="border-t border-gray-200 px-6 py-6">
                  <h3 className="mb-4 text-sm font-bold text-gray-900">이미지</h3>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {gallery.images.map((image) => (
                      <div
                        key={image.id}
                        className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50"
                      >
                        <img
                          src={`${image.fileUrl}`}
                          alt={image.originalName}
                          className="h-64 w-full object-cover"
                        />

                        <div className="p-4">
                          <div className="flex items-center justify-between gap-3">
                            <p className="truncate text-sm font-semibold text-gray-900">
                              {image.originalName}
                            </p>
                            {image.isThumbnail && (
                              <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                                대표
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                <Link
                  href="/admin/boards/gallery"
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700"
                >
                  목록으로
                </Link>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/admin/boards/gallery/write"
                    className="inline-flex h-11 items-center justify-center rounded-xl border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700"
                  >
                    새 글 작성
                  </Link>

                  <Link
                    href={`/admin/boards/gallery/${gallery.id}/edit`}
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-gray-900 px-4 text-sm font-semibold text-white"
                  >
                    수정하기
                  </Link>

                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleteMutation.isPending}
                    className="inline-flex h-11 items-center justify-center rounded-xl border border-red-200 bg-red-50 px-4 text-sm font-semibold text-red-600 disabled:opacity-60"
                  >
                    삭제하기
                  </button>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}