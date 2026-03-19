"use client";

import {
  useDeleteQna,
  useQnaDetail,
  useUpdateQna,
  useVerifyQnaPassword,
} from "@/hooks/useQna";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

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

export default function QnaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [passwordForView, setPasswordForView] = useState("");
  const [submittedPassword, setSubmittedPassword] = useState("");
  const [editMode, setEditMode] = useState(false);

  const [editAuthorName, setEditAuthorName] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editIsSecret, setEditIsSecret] = useState(false);

  const { data: qna, isLoading, isError, error, refetch } = useQnaDetail(
    id,
    submittedPassword || undefined
  );
  const verifyMutation = useVerifyQnaPassword();
  const updateMutation = useUpdateQna();
  const deleteMutation = useDeleteQna();

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!passwordForView.trim()) {
      alert("비밀번호를 입력해주세요.");
      return;
    }

    try {
      const result = await verifyMutation.mutateAsync({
        id,
        password: passwordForView.trim(),
      });

      if (!result.ok) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
      }

      setSubmittedPassword(passwordForView.trim());
      setTimeout(() => {
        refetch();
      }, 0);
    } catch (e: any) {
      alert(e?.response?.data?.message || "비밀번호 확인 중 오류가 발생했습니다.");
    }
  };

  const openEditMode = () => {
    if (!qna) return;
    setEditAuthorName(qna.authorName);
    setEditTitle(qna.title);
    setEditContent(qna.content);
    setEditIsSecret(qna.isSecret);
    setEditPassword("");
    setEditMode(true);
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();

    if (!qna) return;
    if (!editPassword.trim()) {
      alert("수정 비밀번호를 입력해주세요.");
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: qna.id,
        authorName: editAuthorName.trim(),
        title: editTitle.trim(),
        content: editContent.trim(),
        password: editPassword.trim(),
        isSecret: editIsSecret,
      });

      alert("수정되었습니다.");
      setEditMode(false);
      setSubmittedPassword(editPassword.trim());
      refetch();
    } catch (e: any) {
      alert(e?.response?.data?.message || "수정 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async () => {
    if (!qna) return;

    const password = window.prompt("삭제 비밀번호를 입력해주세요.");
    if (!password) return;

    try {
      await deleteMutation.mutateAsync({
        id: qna.id,
        password,
      });

      alert("삭제되었습니다.");
      router.push("/boards/qna");
    } catch (e: any) {
      alert(e?.response?.data?.message || "삭제 중 오류가 발생했습니다.");
    }
  };

  const needPasswordForm = qna?.isSecret && qna.secretBlocked;

  return (
    <div className="bg-white text-gray-900">
      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/boards/qna"
            className="inline-flex h-10 items-center justify-center rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
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
            {error?.message || "Q&A를 불러오지 못했습니다."}
          </div>
        ) : !qna ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-24 text-center text-sm text-gray-500 shadow-sm">
            존재하지 않는 문의입니다.
          </div>
        ) : needPasswordForm ? (
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-6 py-8">
              <h1 className="text-2xl font-bold text-gray-900">비밀글 확인</h1>
              <p className="mt-2 text-sm text-gray-500">
                이 글은 비밀글입니다. 비밀번호를 입력해주세요.
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4 px-6 py-8">
              <input
                type="password"
                value={passwordForView}
                onChange={(e) => setPasswordForView(e.target.value)}
                className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-gray-400"
                placeholder="비밀번호 입력"
              />

              <button
                type="submit"
                disabled={verifyMutation.isPending}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-gray-900 px-4 text-sm font-semibold text-white disabled:opacity-60"
              >
                확인
              </button>
            </form>
          </div>
        ) : editMode ? (
          <form
            onSubmit={handleUpdate}
            className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
          >
            <div className="space-y-6 p-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    작성자명
                  </label>
                  <input
                    type="text"
                    value={editAuthorName}
                    onChange={(e) => setEditAuthorName(e.target.value)}
                    className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-gray-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    수정 비밀번호
                  </label>
                  <input
                    type="password"
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  제목
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-gray-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  내용
                </label>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="min-h-[260px] w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400"
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={editIsSecret}
                  onChange={(e) => setEditIsSecret(e.target.checked)}
                />
                비밀글
              </label>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700"
              >
                취소
              </button>

              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-gray-900 px-4 text-sm font-semibold text-white disabled:opacity-60"
              >
                수정 저장
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 px-6 py-8 sm:px-8">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  {qna.isSecret && (
                    <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
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

                <h1 className="text-2xl font-bold leading-snug text-gray-900 sm:text-3xl">
                  {qna.title}
                </h1>

                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
                  <span>작성자 {qna.authorName}</span>
                  <span>작성일 {formatDateTime(qna.createdAt)}</span>
                  <span>조회수 {qna.views}</span>
                </div>
              </div>

              <div className="min-h-[240px] whitespace-pre-wrap px-6 py-8 text-[15px] leading-8 text-gray-700 sm:px-8">
                {qna.content}
              </div>

              {qna.answer && (
                <div className="border-t border-gray-200 bg-gray-50 px-6 py-8 sm:px-8">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                      관리자 답변
                    </span>
                  </div>

                  <div className="whitespace-pre-wrap rounded-2xl border border-gray-200 bg-white px-5 py-5 text-[15px] leading-8 text-gray-700">
                    {qna.answer.content}
                  </div>

                  <p className="mt-3 text-xs text-gray-500">
                    답변일 {formatDateTime(qna.answer.updatedAt)}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
              <Link
                href="/boards/qna"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700"
              >
                목록으로
              </Link>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={openEditMode}
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-gray-900 px-4 text-sm font-semibold text-white"
                >
                  수정하기
                </button>

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
      </section>
    </div>
  );
}