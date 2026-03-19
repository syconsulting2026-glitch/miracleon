"use client";

import Header from "@/components/admin/Header";
import Sidebar from "@/components/admin/Siderbar";
import {
  useCreateQnaAnswer,
  useDeleteQnaAnswer,
  useQnaDetail,
  useUpdateQnaAnswer,
} from "@/hooks/useQna";
import { useParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

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

export default function AdminQnaDetailPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [answerContent, setAnswerContent] = useState("");

  const params = useParams();
  const id = Number(params.id);

  const { data: qna, isLoading, isError, error } = useQnaDetail(id);
  const createAnswerMutation = useCreateQnaAnswer();
  const updateAnswerMutation = useUpdateQnaAnswer();
  const deleteAnswerMutation = useDeleteQnaAnswer();

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  useEffect(() => {
    if (qna?.answer?.content) {
      setAnswerContent(qna.answer.content);
    } else {
      setAnswerContent("");
    }
  }, [qna]);

  const handleSubmitAnswer = async (e: FormEvent) => {
    e.preventDefault();

    if (!qna) return;
    if (!answerContent.trim()) {
      alert("답변 내용을 입력해주세요.");
      return;
    }

    try {
      if (qna.answer) {
        await updateAnswerMutation.mutateAsync({
          qnaId: qna.id,
          content: answerContent.trim(),
        });
        alert("답변이 수정되었습니다.");
      } else {
        await createAnswerMutation.mutateAsync({
          qnaId: qna.id,
          content: answerContent.trim(),
        });
        alert("답변이 등록되었습니다.");
      }
    } catch (e: any) {
      alert(e?.response?.data?.message || "답변 처리 중 오류가 발생했습니다.");
    }
  };

  const handleDeleteAnswer = async () => {
    if (!qna?.answer) return;

    const ok = window.confirm("등록된 답변을 삭제하시겠습니까?");
    if (!ok) return;

    try {
      await deleteAnswerMutation.mutateAsync({ qnaId: qna.id });
      alert("답변이 삭제되었습니다.");
      setAnswerContent("");
    } catch (e: any) {
      alert(e?.response?.data?.message || "답변 삭제 중 오류가 발생했습니다.");
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
              Q&amp;A 상세 / 답변관리
            </h1>
          </div>

          {isLoading ? (
            <div className="rounded-2xl border border-gray-200 bg-white px-6 py-20 text-center text-sm text-gray-500 shadow-sm">
              불러오는 중...
            </div>
          ) : isError ? (
            <div className="rounded-2xl border border-gray-200 bg-white px-6 py-20 text-center text-sm text-red-500 shadow-sm">
              {error?.message || "Q&A를 불러오지 못했습니다."}
            </div>
          ) : !qna ? (
            <div className="rounded-2xl border border-gray-200 bg-white px-6 py-20 text-center text-sm text-gray-500 shadow-sm">
              존재하지 않는 Q&A입니다.
            </div>
          ) : (
            <>
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 px-6 py-6">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    {qna.isSecret && (
                      <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                        비밀글
                      </span>
                    )}

                    {qna.hasAnswer ? (
                      <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                        답변완료
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                        답변대기
                      </span>
                    )}
                  </div>

                  <h2 className="text-2xl font-bold leading-snug text-gray-900">
                    {qna.title}
                  </h2>

                  <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
                    <span>작성자: {qna.authorName}</span>
                    <span>작성일: {formatDateTime(qna.createdAt)}</span>
                    <span>수정일: {formatDateTime(qna.updatedAt)}</span>
                    <span>조회수: {qna.views}</span>
                  </div>
                </div>

                <div className="min-h-[220px] whitespace-pre-wrap px-6 py-8 text-[15px] leading-7 text-gray-700">
                  {qna.content}
                </div>
              </div>

              <form
                onSubmit={handleSubmitAnswer}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="border-b border-gray-200 px-6 py-5">
                  <h3 className="text-lg font-bold text-gray-900">관리자 답변</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    답변을 등록하거나 수정할 수 있습니다.
                  </p>
                </div>

                <div className="space-y-4 p-6">
                  <textarea
                    value={answerContent}
                    onChange={(e) => setAnswerContent(e.target.value)}
                    className="min-h-[220px] w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400"
                    placeholder="답변 내용을 입력하세요"
                  />

                  {qna.answer && (
                    <p className="text-xs text-gray-500">
                      마지막 수정일: {formatDateTime(qna.answer.updatedAt)}
                    </p>
                  )}
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4 sm:flex-row sm:justify-end">
                  {qna.answer && (
                    <button
                      type="button"
                      onClick={handleDeleteAnswer}
                      disabled={deleteAnswerMutation.isPending}
                      className="inline-flex h-11 items-center justify-center rounded-xl border border-red-200 bg-red-50 px-4 text-sm font-semibold text-red-600 disabled:opacity-60"
                    >
                      답변 삭제
                    </button>
                  )}

                  <button
                    type="submit"
                    disabled={
                      createAnswerMutation.isPending || updateAnswerMutation.isPending
                    }
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-gray-900 px-4 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    {qna.answer ? "답변 수정" : "답변 등록"}
                  </button>
                </div>
              </form>
            </>
          )}
        </main>
      </div>
    </div>
  );
}