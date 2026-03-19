"use client";

import { useNoticeDetail } from "@/hooks/useNotices";
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

export default function NoticeDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const { data: notice, isLoading, isError, error } = useNoticeDetail(id);

  return (
    <div className="bg-white text-gray-900">
      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/boards/notice"
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
            {error?.message || "공지사항을 불러오지 못했습니다."}
          </div>
        ) : !notice ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-24 text-center text-sm text-gray-500 shadow-sm">
            존재하지 않는 공지사항입니다.
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-6 py-8 sm:px-8">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                  공지사항
                </span>

                {notice.attachments.length > 0 && (
                  <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    첨부 {notice.attachments.length}
                  </span>
                )}
              </div>

              <h1 className="text-2xl font-bold leading-snug text-gray-900 sm:text-3xl">
                {notice.title}
              </h1>

              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
                <span>작성일 {formatDateTime(notice.createdAt)}</span>
                <span>수정일 {formatDateTime(notice.updatedAt)}</span>
                <span>조회수 {notice.views}</span>
              </div>
            </div>

            <div className="min-h-[280px] whitespace-pre-wrap px-6 py-8 text-[15px] leading-8 text-gray-700 sm:px-8">
              {notice.content}
            </div>

            {notice.attachments.length > 0 && (
              <div className="border-t border-gray-200 px-6 py-8 sm:px-8">
                <h2 className="mb-4 text-base font-bold text-gray-900">
                  첨부파일
                </h2>

                <div className="space-y-3">
                  {notice.attachments.map((file) => {
                    const fileHref = file.fileUrl
                      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${file.fileUrl}`
                      : null;

                    return (
                      <div
                        key={file.id}
                        className="rounded-2xl border border-gray-200 bg-gray-50 p-4"
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-gray-900">
                              {file.originalName}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              {file.fileType === "image" ? "이미지 파일" : "첨부 파일"}
                            </p>
                          </div>

                          {fileHref && (
                            <a
                              href={fileHref}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex h-10 items-center justify-center rounded-xl border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                            >
                              열기
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}