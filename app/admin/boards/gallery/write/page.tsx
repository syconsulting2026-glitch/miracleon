"use client";

import Header from "@/components/admin/Header";
import Sidebar from "@/components/admin/Siderbar";
import { useCreateGallery } from "@/hooks/useGallery";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useMemo, useState } from "react";

export default function AdminGalleryWritePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [thumbnailIndex, setThumbnailIndex] = useState(0);

  const router = useRouter();
  const createMutation = useCreateGallery();

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const previews = useMemo(
    () => images.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [images]
  );

  const handleImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const nextFiles = files.slice(0, 20);

    if (files.length > 20) {
      alert("이미지는 최대 20장까지 가능합니다.");
    }

    setImages(nextFiles);
    setThumbnailIndex(0);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      const next = prev.filter((_, idx) => idx !== index);
      if (thumbnailIndex >= next.length) {
        setThumbnailIndex(0);
      }
      return next;
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (images.length === 0) {
      alert("최소 1장의 이미지를 업로드해주세요.");
      return;
    }

    try {
      const created = await createMutation.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        images,
        thumbnailIndex,
      });

      alert("등록되었습니다.");
      router.push(`/admin/boards/gallery/${created.id}`);
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
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-blue-600">게시판 관리</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
              활동 갤러리 등록
            </h1>
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
                  className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-gray-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  설명
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[180px] w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  이미지 업로드 (최대 20장)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImagesChange}
                  className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
                />

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {previews.map((item, index) => (
                    <div
                      key={`${item.file.name}-${index}`}
                      className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50"
                    >
                      <img
                        src={item.url}
                        alt={item.file.name}
                        className="h-44 w-full object-cover"
                      />

                      <div className="space-y-3 p-4">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {item.file.name}
                        </p>

                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input
                            type="radio"
                            name="thumbnail"
                            checked={thumbnailIndex === index}
                            onChange={() => setThumbnailIndex(index)}
                          />
                          대표 이미지
                        </label>

                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="inline-flex h-9 items-center justify-center rounded-lg border border-red-200 bg-red-50 px-3 text-sm font-semibold text-red-600"
                        >
                          제거
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4 sm:flex-row sm:justify-end">
              <Link
                href="/admin/boards/gallery"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700"
              >
                취소
              </Link>

              <button
                type="submit"
                disabled={createMutation.isPending}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-gray-900 px-4 text-sm font-semibold text-white disabled:opacity-60"
              >
                등록하기
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}