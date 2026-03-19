"use client";

import Header from "@/components/admin/Header";
import Sidebar from "@/components/admin/Siderbar";
import { useFaqDetail, useUpdateFaq } from "@/hooks/useFaqs";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function AdminFaqEditPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [category, setCategory] = useState("기타");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);

  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const { data: faq, isLoading, isError, error } = useFaqDetail(id);
  const updateMutation = useUpdateFaq();

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  useEffect(() => {
    if (!faq) return;
    setCategory(faq.category ?? "기타");
    setQuestion(faq.question ?? "");
    setAnswer(faq.answer ?? "");
    setIsPinned(Boolean(faq.isPinned));
    setIsVisible(Boolean(faq.isVisible));
    setSortOrder(faq.sortOrder ?? 0);
  }, [faq]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!category.trim()) {
      alert("카테고리를 입력해주세요.");
      return;
    }

    if (!question.trim()) {
      alert("질문을 입력해주세요.");
      return;
    }

    if (!answer.trim()) {
      alert("답변을 입력해주세요.");
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id,
        category: category.trim(),
        question: question.trim(),
        answer: answer.trim(),
        isPinned,
        isVisible,
        sortOrder,
      });

      alert("수정되었습니다.");
      router.push("/admin/boards/faq");
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
          <section className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-blue-600">게시판 관리</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
                FAQ 수정
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                FAQ 내용을 수정할 수 있습니다.
              </p>
            </div>

            {isLoading ? (
              <div className="rounded-2xl border border-gray-200 bg-white px-6 py-20 text-center text-sm text-gray-500 shadow-sm">
                불러오는 중...
              </div>
            ) : isError ? (
              <div className="rounded-2xl border border-gray-200 bg-white px-6 py-20 text-center text-sm text-red-500 shadow-sm">
                {error?.message || "FAQ를 불러오지 못했습니다."}
              </div>
            ) : !faq ? (
              <div className="rounded-2xl border border-gray-200 bg-white px-6 py-20 text-center text-sm text-gray-500 shadow-sm">
                존재하지 않는 FAQ입니다.
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="space-y-6 p-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        카테고리
                      </label>
                      <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-gray-400"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        정렬순서
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={sortOrder}
                        onChange={(e) => setSortOrder(Number(e.target.value) || 0)}
                        className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-gray-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <label className="flex h-12 items-center gap-3 rounded-xl border border-gray-200 px-4 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={isPinned}
                        onChange={(e) => setIsPinned(e.target.checked)}
                        className="h-4 w-4"
                      />
                      상단 고정
                    </label>

                    <label className="flex h-12 items-center gap-3 rounded-xl border border-gray-200 px-4 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={isVisible}
                        onChange={(e) => setIsVisible(e.target.checked)}
                        className="h-4 w-4"
                      />
                      사용자 페이지 노출
                    </label>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      질문
                    </label>
                    <input
                      type="text"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-gray-400"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      답변
                    </label>
                    <textarea
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      className="min-h-[280px] w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-400"
                    />
                  </div>
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4 sm:flex-row sm:justify-end">
                  <Link
                    href="/admin/boards/faq"
                    className="inline-flex h-11 items-center justify-center rounded-xl border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                  >
                    취소
                  </Link>

                  <button
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-gray-900 px-4 text-sm font-semibold text-white transition hover:bg-gray-700 disabled:opacity-60"
                  >
                    수정하기
                  </button>
                </div>
              </form>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}