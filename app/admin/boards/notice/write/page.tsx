"use client";

import Header from "@/components/admin/Header";
import Sidebar from "@/components/admin/Siderbar";
import { useCreateNotice } from "@/hooks/useNotices";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";

export default function AdminNoticeWritePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);

  const router = useRouter();
  const createMutation = useCreateNotice();

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const handleFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const nextFiles = files.slice(0, 5);

    if (files.length > 5) {
      alert("첨부파일은 최대 5개까지 가능합니다.");
    }

    setAttachments(nextFiles);
  };

  const handleRemoveFile = (index: number) => {
    setAttachments((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    try {
      const created = await createMutation.mutateAsync({
        title: title.trim(),
        content: content.trim(),
        attachments,
      });

      alert("등록되었습니다.");
      router.push(`/admin/boards/notice/${created.id}`);
    } catch (e: any) {
      alert(e?.response?.data?.message || "등록 중 오류가 발생했습니다.");
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
                공지사항 글쓰기
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                새로운 공지사항을 작성할 수 있습니다.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
            >
              <div className="space-y-6 p-6">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    제목
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="공지사항 제목을 입력하세요"
                    className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-gray-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    내용
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="공지사항 내용을 입력하세요"
                    className="min-h-[380px] w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    첨부파일 (최대 5개)
                  </label>

                  <input
                    type="file"
                    multiple
                    onChange={handleFilesChange}
                    className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
                  />

                  <div className="mt-3 space-y-2">
                    {attachments.map((file, index) => (
                      <div
                        key={`${file.name}-${index}`}
                        className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-gray-900">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveFile(index)}
                          className="ml-3 inline-flex h-9 items-center justify-center rounded-lg border border-red-200 bg-red-50 px-3 text-sm font-semibold text-red-600"
                        >
                          제거
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4 sm:flex-row sm:justify-end">
                <Link
                  href="/admin/boards/notice"
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                >
                  취소
                </Link>

                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-gray-900 px-4 text-sm font-semibold text-white transition hover:bg-gray-700 disabled:opacity-60"
                >
                  등록하기
                </button>
              </div>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
}