"use client";

import Header from "@/components/admin/Header";
import Sidebar from "@/components/admin/Siderbar";
import { useGalleryDetail, useUpdateGallery } from "@/hooks/useGallery";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";

export default function AdminGalleryEditPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [newImages, setNewImages] = useState<File[]>([]);
  const [deleteImageIds, setDeleteImageIds] = useState<number[]>([]);
  const [thumbnailImageId, setThumbnailImageId] = useState<number | undefined>(undefined);
  const [thumbnailNewIndex, setThumbnailNewIndex] = useState<number | undefined>(undefined);

  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const { data: gallery, isLoading, isError, error } = useGalleryDetail(id);
  const updateMutation = useUpdateGallery();

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  useEffect(() => {
    if (!gallery) return;
    setTitle(gallery.title);
    setDescription(gallery.description || "");
    const currentThumb = gallery.images.find((img) => img.isThumbnail);
    setThumbnailImageId(currentThumb?.id);
  }, [gallery]);

  const remainedImages = useMemo(() => {
    return (gallery?.images ?? []).filter((img) => !deleteImageIds.includes(img.id));
  }, [gallery, deleteImageIds]);

  const previews = useMemo(
    () => newImages.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [newImages]
  );

  const handleNewImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const availableCount = Math.max(0, 20 - remainedImages.length);
    const sliced = files.slice(0, availableCount);

    if (remainedImages.length + files.length > 20) {
      alert("기존 이미지 포함 최대 20장까지 가능합니다.");
    }

    setNewImages(sliced);
  };

  const toggleDeleteImage = (imageId: number) => {
    setDeleteImageIds((prev) =>
      prev.includes(imageId)
        ? prev.filter((id) => id !== imageId)
        : [...prev, imageId]
    );
  };

  const handleRemoveNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, idx) => idx !== index));
    if (thumbnailNewIndex === index) {
      setThumbnailNewIndex(undefined);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    try {
      const updated = await updateMutation.mutateAsync({
        id,
        title: title.trim(),
        description: description.trim(),
        images: newImages,
        deleteImageIds,
        thumbnailImageId,
        thumbnailNewIndex,
      });

      alert("수정되었습니다.");
      router.push(`/admin/boards/gallery/${updated.id}`);
    } catch (e: any) {
      alert(e?.response?.data?.message || "수정 중 오류가 발생했습니다.");
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
              활동 갤러리 수정
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

                <div className="space-y-4">
                  <div>
                    <label className="mb-3 block text-sm font-semibold text-gray-700">
                      기존 이미지
                    </label>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                      {gallery.images.map((image) => {
                        const checked = deleteImageIds.includes(image.id);

                        return (
                          <div
                            key={image.id}
                            className={`overflow-hidden rounded-2xl border ${
                              checked
                                ? "border-red-200 bg-red-50"
                                : "border-gray-200 bg-gray-50"
                            }`}
                          >
                            <img
                              src={`${image.fileUrl}`}
                              alt={image.originalName}
                              className="h-44 w-full object-cover"
                            />

                            <div className="space-y-3 p-4">
                              <p className="truncate text-sm font-medium text-gray-900">
                                {image.originalName}
                              </p>

                              <label className="flex items-center gap-2 text-sm text-gray-700">
                                <input
                                  type="radio"
                                  name="existingThumbnail"
                                  checked={thumbnailImageId === image.id}
                                  onChange={() => {
                                    setThumbnailImageId(image.id);
                                    setThumbnailNewIndex(undefined);
                                  }}
                                  disabled={checked}
                                />
                                대표 이미지
                              </label>

                              <label className="flex items-center gap-2 text-sm text-red-600">
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => toggleDeleteImage(image.id)}
                                />
                                삭제
                              </label>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="mb-3 block text-sm font-semibold text-gray-700">
                      새 이미지 추가
                    </label>

                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleNewImagesChange}
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
                                name="newThumbnail"
                                checked={thumbnailNewIndex === index}
                                onChange={() => {
                                  setThumbnailNewIndex(index);
                                  setThumbnailImageId(undefined);
                                }}
                              />
                              새 대표 이미지
                            </label>

                            <button
                              type="button"
                              onClick={() => handleRemoveNewImage(index)}
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
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4 sm:flex-row sm:justify-end">
                <Link
                  href={`/admin/boards/gallery/${id}`}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700"
                >
                  취소
                </Link>

                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-gray-900 px-4 text-sm font-semibold text-white disabled:opacity-60"
                >
                  수정하기
                </button>
              </div>
            </form>
          )}
        </main>
      </div>
    </div>
  );
}