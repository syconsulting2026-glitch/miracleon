"use client";


import Header from "@/components/admin/Header";
import Sidebar from "@/components/admin/Siderbar";
import { SiteBasicForm } from "@/lib/variable";
import { useState, ChangeEvent, FormEvent } from "react";
const AdminSiteBasicPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const [form, setForm] = useState<SiteBasicForm>({
    siteName: "",
    siteSubTitle: "",
    siteDescription: "",
    siteUrl: "",
    adminEmail: "",
    adminPhone: "",
    footerText: "",
    kakaoLink: "",
    youtubeLink: "",
    instagramLink: "",
    logoFile: null,
    faviconFile: null,
    ogImageFile: null,
    isPublic: true,
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox" && "checked" in e.target) {
      setForm((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files?.[0] ?? null,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // 추후 API 연동 시 FormData로 전송하면 됩니다.
    console.log("사이트 기본 정보 저장", form);
    alert("기본 정보가 저장되었습니다.");
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} />

      {/* Main area */}
      <div className="lg:pl-72">
        {/* Topbar */}
        <Header sidebarOpen={sidebarOpen} onToggleSidebar={toggleSidebar} />

        {/* Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* 사이트 정보 등록 폼 시작 */}
          <section className="bg-white border border-gray-200 rounded-2xl shadow-sm">
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-8">
              {/* 1. 사이트 기본 정보 */}
              <div className="space-y-4">
                <div className="border-b border-gray-100 pb-3">
                  <h2 className="text-lg font-semibold">사이트 기본 정보</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    사이트의 이름과 소개 문구를 등록합니다.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      사이트명
                    </label>
                    <input
                      type="text"
                      name="siteName"
                      value={form.siteName}
                      onChange={handleChange}
                      placeholder="예: 미라클온"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      사이트 부제목 / 슬로건
                    </label>
                    <input
                      type="text"
                      name="siteSubTitle"
                      value={form.siteSubTitle}
                      onChange={handleChange}
                      placeholder="예: 함께 배우고 함께 나누는 MIRACLE"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    사이트 설명
                  </label>
                  <textarea
                    name="siteDescription"
                    value={form.siteDescription}
                    onChange={handleChange}
                    rows={4}
                    placeholder="사이트를 소개하는 문구를 입력해 주세요."
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    사이트 URL
                  </label>
                  <input
                    type="text"
                    name="siteUrl"
                    value={form.siteUrl}
                    onChange={handleChange}
                    placeholder="예: https://miracle-on.kr"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* 2. 운영자 정보 */}
              <div className="space-y-4">
                <div className="border-b border-gray-100 pb-3">
                  <h2 className="text-lg font-semibold">운영자 정보</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    관리자 또는 운영 주체의 연락처 정보를 입력합니다.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      관리자 이메일
                    </label>
                    <input
                      type="email"
                      name="adminEmail"
                      value={form.adminEmail}
                      onChange={handleChange}
                      placeholder="예: admin@miracle-on.kr"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      관리자 연락처
                    </label>
                    <input
                      type="text"
                      name="adminPhone"
                      value={form.adminPhone}
                      onChange={handleChange}
                      placeholder="예: 010-1234-5678"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>
              </div>

              {/* 3. 이미지 설정 */}
              <div className="space-y-4">
                <div className="border-b border-gray-100 pb-3">
                  <h2 className="text-lg font-semibold">이미지 설정</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    로고, 파비콘, 대표 공유 이미지를 등록합니다.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      사이트 로고
                    </label>
                    <input
                      type="file"
                      name="logoFile"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-sm file:font-medium hover:file:bg-gray-200"
                    />
                    {form.logoFile && (
                      <p className="mt-2 text-xs text-gray-500">
                        선택 파일: {form.logoFile.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      파비콘
                    </label>
                    <input
                      type="file"
                      name="faviconFile"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-sm file:font-medium hover:file:bg-gray-200"
                    />
                    {form.faviconFile && (
                      <p className="mt-2 text-xs text-gray-500">
                        선택 파일: {form.faviconFile.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      SNS 공유 대표 이미지
                    </label>
                    <input
                      type="file"
                      name="ogImageFile"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-sm file:font-medium hover:file:bg-gray-200"
                    />
                    {form.ogImageFile && (
                      <p className="mt-2 text-xs text-gray-500">
                        선택 파일: {form.ogImageFile.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* 4. SNS 링크 */}
              <div className="space-y-4">
                <div className="border-b border-gray-100 pb-3">
                  <h2 className="text-lg font-semibold">SNS / 외부 링크</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    사이트에서 연결할 외부 채널 주소를 등록합니다.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      카카오채널 링크
                    </label>
                    <input
                      type="text"
                      name="kakaoLink"
                      value={form.kakaoLink}
                      onChange={handleChange}
                      placeholder="예: https://pf.kakao.com/..."
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      유튜브 링크
                    </label>
                    <input
                      type="text"
                      name="youtubeLink"
                      value={form.youtubeLink}
                      onChange={handleChange}
                      placeholder="예: https://youtube.com/..."
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      인스타그램 링크
                    </label>
                    <input
                      type="text"
                      name="instagramLink"
                      value={form.instagramLink}
                      onChange={handleChange}
                      placeholder="예: https://instagram.com/..."
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>
              </div>

              {/* 5. 푸터 / 운영 설정 */}
              <div className="space-y-4">
                <div className="border-b border-gray-100 pb-3">
                  <h2 className="text-lg font-semibold">운영 설정</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    푸터 문구와 사이트 공개 여부를 설정합니다.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    푸터 문구
                  </label>
                  <input
                    type="text"
                    name="footerText"
                    value={form.footerText}
                    onChange={handleChange}
                    placeholder="예: © 2026 미라클온. All Rights Reserved."
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <label className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3">
                  <input
                    type="checkbox"
                    name="isPublic"
                    checked={form.isPublic}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <p className="text-sm font-medium">사이트 공개 상태</p>
                    <p className="text-xs text-gray-500">
                      체크 해제 시 점검중 또는 비공개 상태로 운영할 수 있습니다.
                    </p>
                  </div>
                </label>
              </div>

              {/* 버튼 */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  className="inline-flex items-center rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  저장하기
                </button>
              </div>
            </form>
          </section>
          {/* 사이트 정보 등록 폼 끝 */}
        </main>
      </div>
    </div>
  );
};

export default AdminSiteBasicPage;