"use client";

import { useGalleryDetail } from "@/hooks/useGallery";
import Link from "next/link";
import { useParams } from "next/navigation";

const formatDateTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}.${String(date.getDate()).padStart(2, "0")} ${String(
    date.getHours()
  ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
};

export default function GalleryDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const { data: gallery, isLoading, isError, error } = useGalleryDetail(id);

  return (
    <div className="bg-white text-gray-900">
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/boards/gallery"
            className="inline-flex h-10 items-center justify-center rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            목록으로
          </Link>
        </div>

        {isLoading ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-24 text-center text-sm text-gray-500 shadow-sm">
            불러오는 중...
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-24 text-center text-sm text-red-500 shadow-sm">
            {error?.message || "갤러리를 불러오지 못했습니다."}
          </div>
        ) : !gallery ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-24 text-center text-sm text-gray-500 shadow-sm">
            존재하지 않는 갤러리입니다.
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-6 py-8 sm:px-8">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                  활동 갤러리
                </span>
                <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                  이미지 {gallery.images.length}
                </span>
              </div>

              <h1 className="text-2xl font-bold leading-snug text-gray-900 sm:text-3xl">
                {gallery.title}
              </h1>

              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
                <span>작성일 {formatDateTime(gallery.createdAt)}</span>
                <span>수정일 {formatDateTime(gallery.updatedAt)}</span>
                <span>조회수 {gallery.views}</span>
              </div>
            </div>

            <div className="whitespace-pre-wrap px-6 py-8 text-[15px] leading-8 text-gray-700 sm:px-8">
              {gallery.description || "설명이 없습니다."}
            </div>

            <div className="border-t border-gray-200 px-6 py-8 sm:px-8">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {gallery.images.map((image) => (
                  <div
                    key={image.id}
                    className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50"
                  >
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${image.fileUrl}`}
                      alt={image.originalName}
                      className="h-72 w-full object-cover"
                    />

                    <div className="flex items-center justify-between gap-3 p-4">
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
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}