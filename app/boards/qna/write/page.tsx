"use client";

import { useCreateQna, useQnaCaptcha } from "@/hooks/useQna";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function QnaWritePage() {
  const router = useRouter();
  const createMutation = useCreateQna();
  const captchaMutation = useQnaCaptcha();

  const [authorName, setAuthorName] = useState("");
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSecret, setIsSecret] = useState(false);

  const [captchaId, setCaptchaId] = useState("");
  const [captchaImage, setCaptchaImage] = useState("");
  const [captchaText, setCaptchaText] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [startedAt, setStartedAt] = useState(0);

  const loadCaptcha = async () => {
    try {
      const data = await captchaMutation.mutateAsync();
      setCaptchaId(data.captchaId);
      setCaptchaImage(data.image);
      setCaptchaText("");
      setStartedAt(Date.now());
    } catch (e: any) {
      alert(e?.response?.data?.message || "자동입력방지를 불러오지 못했습니다.");
    }
  };

  useEffect(() => {
    loadCaptcha();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!authorName.trim()) {
      alert("작성자명을 입력해주세요.");
      return;
    }

    if (!password.trim()) {
      alert("비밀번호를 입력해주세요.");
      return;
    }

    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    if (!captchaId || !captchaText.trim()) {
      alert("자동입력방지 문자를 입력해주세요.");
      return;
    }

    try {
      const created = await createMutation.mutateAsync({
        authorName: authorName.trim(),
        password: password.trim(),
        title: title.trim(),
        content: content.trim(),
        isSecret,
        captchaId,
        captchaText: captchaText.trim(),
        honeypot,
        startedAt,
      });

      alert("문의가 등록되었습니다.");
      router.push(`/boards/qna/${created.id}`);
    } catch (e: any) {
      alert(e?.response?.data?.message || "등록 중 오류가 발생했습니다.");
      loadCaptcha();
    }
  };

  return (
    <div className="bg-white text-gray-900">
      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Q&amp;A 문의하기</h1>
          <p className="mt-2 text-sm text-gray-500">
            문의 내용을 남겨주시면 확인 후 답변드리겠습니다.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
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
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-gray-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  비밀번호
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-gray-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                내용
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[260px] w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400"
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={isSecret}
                onChange={(e) => setIsSecret(e.target.checked)}
              />
              비밀글로 등록
            </label>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <label className="mb-3 block text-sm font-semibold text-gray-700">
                자동입력방지
              </label>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="overflow-hidden rounded-lg border border-gray-300 bg-white">
                  {captchaImage ? (
                    <img
                      src={captchaImage}
                      alt="자동입력방지"
                      className="h-[60px] w-[180px]"
                    />
                  ) : (
                    <div className="flex h-[60px] w-[180px] items-center justify-center text-sm text-gray-400">
                      로딩중...
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={loadCaptcha}
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700"
                >
                  새로고침
                </button>
              </div>

              <input
                type="text"
                value={captchaText}
                onChange={(e) => setCaptchaText(e.target.value)}
                placeholder="보이는 문자를 입력하세요"
                className="mt-3 h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none focus:border-gray-400 sm:max-w-[260px]"
              />
            </div>

            <div className="hidden">
              <input
                type="text"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                autoComplete="off"
                tabIndex={-1}
              />
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4 sm:flex-row sm:justify-end">
            <Link
              href="/boards/qna"
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
      </section>
    </div>
  );
}