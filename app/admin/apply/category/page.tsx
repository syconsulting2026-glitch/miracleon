"use client";

import Header from "@/components/admin/Header";
import Sidebar from "@/components/admin/Siderbar";
import { useState } from "react";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  type Category,
} from "@/hooks/useCategory";

export default function AdminApplysPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 1. React Query 훅 연결
  const { data: categories = [], isLoading } = useCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  // 입력 폼 상태
  const [form, setForm] = useState({
    id: 0,
    name: "",
    description: "",
    isActive: true,
    sortOrder: 0,
  });

  const [isEditing, setIsEditing] = useState(false);

  // 폼 입력 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 등록 및 수정 서밋 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert("과목 이름을 입력해 주세요.");
      return;
    }

    try {
      if (isEditing) {
        // 수정 API 연동
        await updateMutation.mutateAsync({
          id: form.id,
          data: {
            name: form.name.trim(),
            description: form.description.trim() || null,
            isActive: form.isActive,
            sortOrder: Number(form.sortOrder),
          },
        });
        alert("수정되었습니다.");
      } else {
        // 등록 API 연동
        await createMutation.mutateAsync({
          name: form.name.trim(),
          description: form.description.trim() || null,
          isActive: form.isActive,
          sortOrder: Number(form.sortOrder),
        });
        alert("등록되었습니다.");
      }
      resetForm();
    } catch (error: any) {
      alert(error?.response?.data?.message || "요청 처리 중 오류가 발생했습니다.");
    }
  };

  // 수정 버튼 클릭 시 데이터 셋업
  const handleEdit = (category: Category) => {
    setForm({
      id: category.id,
      name: category.name,
      description: category.description || "",
      isActive: category.isActive,
      sortOrder: category.sortOrder,
    });
    setIsEditing(true);
  };

  // 삭제 처리
  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까? (관련된 수강신청 내역이 있을 수 있습니다.)")) {
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
    setForm({ id: 0, name: "", description: "", isActive: true, sortOrder: 0 });
    setIsEditing(false);
  };

  // 버튼 비활성화 상태 정의
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
            <p className="text-sm font-medium text-blue-600">과목 관리</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight">과목 관리</h1>
            <p className="mt-1 text-sm text-gray-500">
              과목관리 목록 조회, 상태변경, 삭제가 가능합니다.
            </p>
          </section>

          {/* 등록 및 수정 폼 */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">
              {isEditing ? "과목 수정" : "새 과목 등록"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">노출 순서</label>
                  <input
                    type="number"
                    name="sortOrder"
                    value={form.sortOrder}
                    onChange={handleChange}
                    className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-gray-900"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">과목 이름</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="예: 스마트폰 기초"
                    className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-gray-900"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">설명 (선택)</label>
                  <input
                    type="text"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="과목에 대한 간단한 설명"
                    className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-gray-900"
                  />
                </div>
                <div className="flex flex-col justify-end gap-2 sm:col-span-2 md:col-span-4 lg:col-span-1 lg:flex-row lg:items-end">
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

          {/* 과목 목록 테이블 */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase text-gray-700">
                  <tr>
                    <th className="px-6 py-4">순서</th>
                    <th className="px-6 py-4">과목 이름</th>
                    <th className="px-6 py-4">설명</th>
                    <th className="px-6 py-4">상태</th>
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
                  ) : categories.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-500">
                        등록된 과목이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    categories.map((category) => (
                      <tr key={category.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">{category.sortOrder}</td>
                        <td className="px-6 py-4 font-medium text-gray-900">{category.name}</td>
                        <td className="px-6 py-4">{category.description || "-"}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              category.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {category.isActive ? "노출 중" : "숨김"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-3">
                            <button
                              onClick={() => handleEdit(category)}
                              disabled={deleteMutation.isPending}
                              className="font-medium text-blue-600 hover:text-blue-800 disabled:opacity-50"
                            >
                              수정
                            </button>
                            <button
                              onClick={() => handleDelete(category.id)}
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