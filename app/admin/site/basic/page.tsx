"use client";


import Header from "@/components/admin/Header";
import Sidebar from "@/components/admin/Siderbar";
import { SiteBasicForm } from "@/lib/variable";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useSiteBasic, useSaveSiteBasic } from "@/hooks/useSiteBasic";
import { ImageIcon, X } from "lucide-react";
const AdminSiteBasicPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  // --- React Query 훅 사용 ---
  const { data: initialData, isLoading } = useSiteBasic();
  const { mutate: saveSiteBasic, isPending } = useSaveSiteBasic();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
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
  // 데이터 로드 시 폼 상태 업데이트
  useEffect(() => {
    if (initialData) {
      setForm((prev) => ({
        ...prev,
        ...initialData,
        // 파일은 서버에서 URL로 오기 때문에 초기화 시 파일 객체는 null로 유지하거나 처리 필요
        logoFile: null,
        faviconFile: null,
        ogImageFile: null,
      }));
    }
  }, [initialData]);
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
  // 미리보기 URL 생성 함수
  const getPreviewUrl = (file: File | null, savedPath: string | undefined | null) => {
    if (file) return URL.createObjectURL(file); // 새로 선택한 파일
    if (savedPath) return `${process.env.NEXT_PUBLIC_API_BASE_URL}${savedPath}`; // 서버에 저장된 경로
    return null;
  };
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // --- FormData 생성 (파일 전송을 위해 필수) ---
    const formData = new FormData();
    
    // 텍스트 필드 추가
    Object.keys(form).forEach((key) => {
      const value = (form as any)[key];
      if (value !== null) {
        // 파일 필드가 아닌 경우 또는 파일이 실제로 있는 경우만 추가
        formData.append(key, value);
      }
    });

    saveSiteBasic(formData);
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} />\
      {/* Main area */}
      <div className="lg:pl-72">
        {/* Topbar */}
        <Header sidebarOpen={sidebarOpen} onToggleSidebar={toggleSidebar} />

        {/* Content */}
        <main className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8">
          <div className=" gap-8">
            <div className="flex-1 space-y-8">
              <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-gray-900">사이트 기본 정보</h1>
                  <p className="text-sm text-gray-500 mt-1">사이트의 이름과 소개 문구를 등록합니다..</p>
                </div>

              </header>
              {/* 사이트 정보 등록 폼 시작 */}
              <section className="bg-white border border-gray-200 rounded-2xl shadow-sm">
                <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-8">
                  {/* 1. 사이트 기본 정보 */}
                  <div className="space-y-4">


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
                      {[
                      { label: "사이트 로고", name: "logoFile", saved: initialData?.logoImageUrl },
                      { label: "파비콘", name: "faviconFile", saved: initialData?.faviconImageUrl },
                      { label: "SNS 공유 대표 이미지", name: "ogImageFile", saved: initialData?.ogImageUrl },
                    ].map((item) => {
                      const preview = getPreviewUrl((form as any)[item.name], item.saved);
                      return (
                        <div key={item.name} className="space-y-3">
                          <label className="block text-sm font-medium">{item.label}</label>
                          
                          {/* 이미지 미리보기 박스 */}
                          <div 
                            className="relative w-full h-40 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden group cursor-pointer"
                            onClick={() => preview && setSelectedImage(preview)}
                          >
                            {preview ? (
                              <>
                                <img src={preview} className="w-full h-full object-contain" alt="Preview" />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                  <span className="text-white text-xs font-bold">원본 보기</span>
                                </div>
                              </>
                            ) : (
                              <div className="text-gray-400 flex flex-col items-center">
                                <ImageIcon size={32} />
                                <span className="text-xs mt-2">이미지 없음</span>
                              </div>
                            )}
                          </div>

                          <input
                            type="file"
                            name={item.name}
                            accept="image/*"
                            onChange={handleFileChange}
                            className="block w-full text-xs text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-xs file:font-medium hover:file:bg-gray-200"
                          />
                        </div>
                      );
                    })}
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
            </div>
          </div>
          {/* 사이트 정보 등록 폼 끝 */}
        </main>
      </div>
      {/* 이미지 확대 모달 */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-5xl max-h-[90vh]">
            <button className="absolute -top-10 right-0 text-white hover:text-gray-300"><X size={32} /></button>
            <img src={selectedImage} className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" alt="Enlarged" onClick={(e) => e.stopPropagation()} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSiteBasicPage;