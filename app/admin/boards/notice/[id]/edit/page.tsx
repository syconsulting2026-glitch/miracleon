"use client";

import Header from "@/components/admin/Header";
import Sidebar from "@/components/admin/Siderbar";
import { useUpdateNotice, useNoticeDetail } from "@/hooks/useNotices"; // useUpdateNotice로 변경 확인
import { NoticeAttachmentItem } from "@/types/notice";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";


export default function AdminNoticeEditPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  
  // 상태 관리: 기존 파일 vs 새로 추가할 파일
  const [existingAttachments, setExistingAttachments] = useState<NoticeAttachmentItem[]>([]);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [deleteAttachmentIds, setDeleteAttachmentIds] = useState<number[]>([]);

  const params = useParams();
  const id = Number(params.id);
  
  const { data: notice, isLoading } = useNoticeDetail(id);
  const router = useRouter();
  const updateMutation = useUpdateNotice(); // 수정용 뮤테이션

  const toggleSidebar = () => setSidebarOpen((prev) => prev);

  useEffect(() => {
    if (!notice) return;
    setTitle(notice.title);
    setContent(notice.content || "");
    // 서버에서 받은 기존 첨부파일 저장
    setExistingAttachments(notice.attachments || []);
  }, [notice]);

  // 새 파일 선택 핸들러
  const handleFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const totalCount = existingAttachments.length + attachments.length + files.length;

    if (totalCount > 5) {
      alert("첨부파일은 최대 5개까지 가능합니다.");
      return;
    }

    setAttachments((prev) => [...prev, ...files]);
    e.target.value = ""; // 같은 파일 다시 선택 가능하게 초기화
  };

  // 기존 파일 삭제 핸들러
  const handleRemoveExistingFile = (fileId: number) => {
    setExistingAttachments((prev) => prev.filter((file) => file.id !== fileId));
    setDeleteAttachmentIds((prev) => [...prev, fileId]);
  };

  // 새 파일 삭제 핸들러
  const handleRemoveNewFile = (index: number) => {
    setAttachments((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id,
        title: title.trim(),
        content: content.trim(),
        attachments, // 신규 파일들
        deleteAttachmentIds, // 삭제할 기존 파일 ID들
      });

      alert("수정되었습니다.");
      router.push(`/admin/boards/notice/${id}`);
    } catch (e: any) {
      alert(e?.response?.data?.message || "수정 중 오류가 발생했습니다.");
    }
  };

  if (isLoading) return <div className="p-10 text-center">로딩 중...</div>;

  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900">
      <Sidebar sidebarOpen={sidebarOpen} />
      <div className="lg:pl-72">
        <Header sidebarOpen={sidebarOpen} onToggleSidebar={toggleSidebar} />

        <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <section className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h1 className="text-2xl font-bold text-gray-900">공지사항 수정하기</h1>
            </div>

            <form onSubmit={handleSubmit} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="space-y-6 p-6">
                {/* 제목/내용 입력란 (기존과 동일) */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">제목</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="h-12 w-full rounded-xl border border-gray-200 px-4"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">내용</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[380px] w-full rounded-xl border border-gray-200 px-4 py-3"
                  />
                </div>

                {/* 첨부파일 섹션 */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">첨부파일 (최대 5개)</label>
                  <input
                    type="file"
                    multiple
                    onChange={handleFilesChange}
                    className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
                  />

                  <div className="mt-4 space-y-2">
                    {/* 1. 기존 업로드된 파일 목록 */}
                    {existingAttachments.map((file) => (
                      <div key={`existing-${file.id}`} className="flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <span className="shrink-0 text-xs font-bold text-blue-500 uppercase">Existing</span>
                          <p className="truncate text-sm font-medium text-gray-900">{file.originalName}</p>
                        </div>
                        <div className="flex gap-2">
                          <a
                            href={file.fileUrl?.toString()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex h-9 items-center rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                          >
                            파일 열기
                          </a>
                          <button
                            type="button"
                            onClick={() => handleRemoveExistingFile(file.id)}
                            className="h-9 rounded-lg bg-red-50 px-3 text-sm font-semibold text-red-600 hover:bg-red-100"
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* 2. 새로 추가한 파일 목록 */}
                    {attachments.map((file, index) => (
                      <div key={`new-${index}`} className="flex items-center justify-between rounded-xl border border-green-100 bg-green-50 px-4 py-3">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <span className="shrink-0 text-xs font-bold text-green-500 uppercase">New</span>
                          <p className="truncate text-sm font-medium text-gray-900">{file.name}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveNewFile(index)}
                          className="h-9 rounded-lg bg-red-50 px-3 text-sm font-semibold text-red-600"
                        >
                          제거
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t bg-gray-50 px-6 py-4">
                <Link href="/admin/boards/notice" className="inline-flex h-11 items-center rounded-xl border bg-white px-6 font-semibold">취소</Link>
                <button type="submit" className="inline-flex h-11 items-center rounded-xl bg-gray-900 px-6 font-semibold text-white">수정하기</button>
              </div>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
}