"use client";

import Header from "@/components/admin/Header";
import Sidebar from "@/components/admin/Siderbar";
import { useState } from "react";
import {
  useRecommenders,
  useCreateRecommender,
  useUpdateRecommender,
  useDeleteRecommender,
  type Recommender,
} from "@/hooks/useRecommender";

const formatPhone = (raw: string) => {
  const digits = raw.replace(/[^0-9]/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
};

export default function AdminRecommendersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // 검색 텍스트 바인딩용
  const [filterQ, setFilterQ] = useState(""); // 실제 API로 요청 보낼 조건 검색어

  // 1. 추천인 목록 패칭 (검색어 조건 포함)
  const { data: recommenders = [], isLoading } = useRecommenders({ q: filterQ });
  
  const createMutation = useCreateRecommender();
  const updateMutation = useUpdateRecommender();
  const deleteMutation = useDeleteRecommender();

  // 입력 폼 상태
  const [form, setForm] = useState({
    id: 0,
    name: "",
    phone: "",
    isActive: true,
  });

  const [isEditing, setIsEditing] = useState(false);

  // 폼 입력 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (name === "phone") {
      setForm((prev) => ({ ...prev, phone: formatPhone(value) }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 상단 목록 검색어 서밋 핸들러
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilterQ(searchQuery.trim());
  };

  // 등록 및 수정 서밋 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert("추천인 이름을 입력해 주세요.");
      return;
    }
    if (form.phone.replace(/[^0-9]/g, "").length < 10) {
      alert("올바른 연락처를 입력해 주세요.");
      return;
    }

    try {
      if (isEditing) {
        await updateMutation.mutateAsync({
          id: form.id,
          data: {
            name: form.name.trim(),
            phone: form.phone,
            isActive: form.isActive,
          },
        });
        alert("수정되었습니다.");
      } else {
        await createMutation.mutateAsync({
          name: form.name.trim(),
          phone: form.phone,
          isActive: form.isActive,
        });
        alert("등록되었습니다.");
      }
      resetForm();
    } catch (error: any) {
      alert(error?.response?.data?.message || "요청 처리 중 오류가 발생했습니다.");
    }
  };

  // 수정 클릭 시 폼에 설정
  const handleEdit = (recommender: Recommender) => {
    setForm({
      id: recommender.id,
      name: recommender.name,
      phone: recommender.phone,
      isActive: recommender.isActive,
    });
    setIsEditing(true);
  };

  // 삭제 처리
  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(id);
      alert("삭제되었습니다.");
      if (form.id === id) resetForm();
    } catch (error: any) {
      alert(error?.response?.data?.message || "삭제 중 오류가 발생했습니다.");
    }
  };

  const resetForm = () => {
    setForm({ id: 0, name: "", phone: "", isActive: true });
    setIsEditing(false);
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar sidebarOpen={sidebarOpen} />

      <div className="lg:pl-72">
        <Header sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((p) => !p)} />

        <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-blue-600">추천인 관리</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight">추천인 명단 관리</h1>
            <p className="mt-1 text-sm text-gray-500">
              수강 신청 폼에 노출될 추천인을 추가하고 관리합니다.
            </p>
          </section>

          {/* 등록 및 수정 폼 */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">
              {isEditing ? "추천인 정보 수정" : "새 추천인 등록"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">이름</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="예: 홍길동"
                    className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-gray-900"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">연락처</label>
                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="010-0000-0000"
                    className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-gray-900"
                  />
                </div>
                <div className="flex flex-col justify-end gap-2 sm:col-span-2 lg:col-span-2 lg:flex-row lg:items-end">
                  <label className="mb-2 flex h-10 items-center gap-2 text-sm text-gray-700 lg:mb-0 lg:mr-auto">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={form.isActive}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    사용(폼 노출)
                  </label>
                  <div className="flex gap-2 w-full lg:w-auto">
                    {isEditing && (
                      <button
                        type="button"
                        onClick={resetForm}
                        className="h-10 flex-1 rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 lg:flex-none"
                      >
                        취소
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="h-10 flex-1 rounded-lg bg-gray-900 px-4 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60 lg:flex-none"
                    >
                      {isSubmitting ? "처리 중..." : isEditing ? "수정완료" : "등록하기"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </section>

          {/* 명단 검색 툴바 영역 */}
          <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <form onSubmit={handleSearchSubmit} className="flex gap-3 max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="추천인 이름 또는 전화번호 검색"
                className="h-10 flex-1 rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-gray-900"
              />
              <button
                type="submit"
                className="h-10 rounded-lg bg-gray-900 px-4 text-sm font-medium text-white hover:bg-gray-800"
              >
                검색
              </button>
            </form>
          </section>

          {/* 추천인 목록 테이블 */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase text-gray-700">
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">이름</th>
                    <th className="px-6 py-4">연락처</th>
                    <th className="px-6 py-4">노출 상태</th>
                    <th className="px-6 py-4 text-right">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-500">
                        데이터를 불러오는 중입니다...
                      </td>
                    </tr>
                  ) : recommenders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-500">
                        등록된 추천인이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    recommenders.map((item: Recommender) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">{item.id}</td>
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {item.name} {item.last4Digits ? `(${item.last4Digits})` : ""}
                        </td>
                        <td className="px-6 py-4">{item.phone}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              item.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {item.isActive ? "노출 중" : "숨김"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-3">
                            <button
                              onClick={() => handleEdit(item)}
                              disabled={deleteMutation.isPending}
                              className="font-medium text-blue-600 hover:text-blue-800 disabled:opacity-50"
                            >
                              수정
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              disabled={deleteMutation.isPending}
                              className="font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
                            >
                              삭제
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}