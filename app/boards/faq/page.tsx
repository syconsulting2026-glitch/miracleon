"use client";

import { useFaqs } from "@/hooks/useFaqs";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useMemo, useState } from "react";

export default function FaqPage() {
  const [searchInput, setSearchInput] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [openIds, setOpenIds] = useState<number[]>([]);

  const { data, isLoading, isError, error } = useFaqs({
    page: 1,
    pageSize: 100,
    q: searchKeyword,
  });

  const faqItems = data?.items ?? [];

  const categories = useMemo(() => {
    const set = new Set<string>();
    faqItems.forEach((item) => {
      if (item.category?.trim()) set.add(item.category.trim());
    });
    return Array.from(set);
  }, [faqItems]);

  const [selectedCategory, setSelectedCategory] = useState("");

  const filteredFaqs = faqItems.filter((item) =>
    selectedCategory ? item.category === selectedCategory : true
  );

  const handleSearch = () => {
    setSearchKeyword(searchInput.trim());
  };

  const toggleAccordion = (id: number) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="bg-white text-gray-900">
      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold text-blue-600">FAQ</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            자주 묻는 질문
          </h1>
          <p className="mt-3 text-sm text-gray-500 sm:text-base">
            MIRACLEON 관련 자주 묻는 질문과 답변을 확인하실 수 있습니다.
          </p>
        </div>

        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_180px_120px]">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="질문 또는 답변 검색"
              className="h-12 rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-gray-400"
            />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-12 rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-gray-400"
            >
              <option value="">전체</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleSearch}
              className="h-12 rounded-xl bg-gray-900 px-5 text-sm font-semibold text-white transition hover:bg-gray-700"
            >
              검색
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          {isLoading ? (
            <div className="px-6 py-20 text-center text-sm text-gray-500">
              불러오는 중...
            </div>
          ) : isError ? (
            <div className="px-6 py-20 text-center text-sm text-red-500">
              {error?.message || "FAQ를 불러오지 못했습니다."}
            </div>
          ) : filteredFaqs.length === 0 ? (
            <div className="px-6 py-20 text-center text-sm text-gray-500">
              등록된 FAQ가 없습니다.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredFaqs.map((item) => {
                const isOpen = openIds.includes(item.id);

                return (
                  <div key={item.id} className="bg-white">
                    <button
                      type="button"
                      onClick={() => toggleAccordion(item.id)}
                      className="flex w-full items-start justify-between gap-4 px-6 py-5 text-left transition hover:bg-gray-50 sm:px-8"
                    >
                      <div className="min-w-0">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
                            {item.category}
                          </span>
                          {item.isPinned && (
                            <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                              자주 찾는 질문
                            </span>
                          )}
                        </div>

                        <h2 className="text-base font-semibold leading-7 text-gray-900 sm:text-lg">
                          {item.question}
                        </h2>
                      </div>

                      {isOpen ? (
                        <ChevronUp className="mt-1 h-5 w-5 shrink-0 text-gray-500" />
                      ) : (
                        <ChevronDown className="mt-1 h-5 w-5 shrink-0 text-gray-500" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="border-t border-gray-100 bg-gray-50 px-6 py-5 sm:px-8">
                        <div className="whitespace-pre-wrap text-sm leading-8 text-gray-700 sm:text-[15px]">
                          {item.answer}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}