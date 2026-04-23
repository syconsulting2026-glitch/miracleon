"use client";

import Header from "@/components/admin/Header";
import Sidebar from "@/components/admin/Siderbar";
import {
  BannerCategory,
  BannerCategoryState,
  BannerEffect,
  BannerSlide,
  CATEGORY_OPTIONS,
  createCategoryState,
  createEmptySlide,
  TextAlign,
  VerticalAlign,
} from "@/lib/bannersVariable";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { useSiteBanners } from "@/hooks/useSiteBanners";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  Pagination,
  Navigation,
  EffectFade,
  EffectCoverflow,
  EffectFlip,
  EffectCards,
  EffectCreative,
  EffectCube,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import "swiper/css/effect-coverflow";
import "swiper/css/effect-flip";
import "swiper/css/effect-cards";
import "swiper/css/effect-creative";
import "swiper/css/effect-cube";
import { useSaveSiteBanner } from "@/hooks/useSaveSiteBanner";
import {
  Type,
  Palette,
  AlignCenter,
  AlignLeft,
  AlignRight,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
  Plus,
  Minus,
  ALargeSmall
} from "lucide-react";
const createInitialBannerData = (): Record<BannerCategory, BannerCategoryState> => ({
  메인: createCategoryState(),
  MIRACLEON소개: createCategoryState(),
  설립목적: createCategoryState(),
  주요사업: createCategoryState(),
  철학가치관: createCategoryState(),
  커뮤니티: createCategoryState(),
});

const AdminSiteBasicPage = () => {
  // 1. 드래그 중인 슬라이드 ID를 추적하기 위한 상태 추가
  const [dragActiveSlide, setDragActiveSlide] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  // 상단 상태 선언부에 추가
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const openPreview = () => setPreviewOpen(true);
  const closePreview = () => setPreviewOpen(false);

  const { mutateAsync: saveBanner, isPending } = useSaveSiteBanner();

  const {
    data: bannerResponse,
    isLoading: isBannerLoading,
    isFetching: isBannerFetching,
    refetch,
  } = useSiteBanners();

  const [selectedCategory, setSelectedCategory] =
    useState<BannerCategory>("메인");

  const [bannerData, setBannerData] = useState<
    Record<BannerCategory, BannerCategoryState>
  >(createInitialBannerData());

  const toFullImageUrl = (imageUrl: string | null) => {
    if (!imageUrl) return null;

    if (
      imageUrl.startsWith("http://") ||
      imageUrl.startsWith("https://") ||
      imageUrl.startsWith("blob:")
    ) {
      return imageUrl;
    }

    return `${process.env.NEXT_PUBLIC_API_BASE_URL}${imageUrl}`;
  };

  const stripApiBaseUrl = (url: string | null) => {
    if (!url) return null;

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (baseUrl && url.startsWith(baseUrl)) {
      return url.replace(baseUrl, "");
    }

    return url;
  };

  useEffect(() => {
    if (!bannerResponse?.success || !bannerResponse.data) return;

    const nextBannerData: Record<BannerCategory, BannerCategoryState> =
      createInitialBannerData();

    for (const banner of bannerResponse.data) {
      nextBannerData[banner.category] = {
        effect: banner.effect,
        slides:
          banner.slides && banner.slides.length > 0
            ? banner.slides.map((slide, index) => ({
              id: slide.id ?? index + 1,
              title: slide.title ?? "",
              description: slide.description ?? "",
              imageFile: null,
              previewUrl: toFullImageUrl(slide.imageUrl),
              fontSize: slide.fontSize ?? 48,
              fontColor: slide.fontColor ?? "#ffffff",
              fontFamily: slide.fontFamily ?? "Pretendard",
              textAlign: slide.textAlign ?? "center",
              verticalAlign: slide.verticalAlign ?? "center",
              duration: slide.duration ?? 5,
            }))
            : [createEmptySlide(1)],
      };
    }

    setBannerData(nextBannerData);
  }, [bannerResponse]);

  const currentCategoryData = useMemo(
    () => bannerData[selectedCategory],
    [bannerData, selectedCategory]
  );

  const currentSlides = currentCategoryData.slides;

  const updateSlide = (
    slideId: number,
    key: keyof BannerSlide,
    value: BannerSlide[keyof BannerSlide]
  ) => {
    setBannerData((prev) => ({
      ...prev,
      [selectedCategory]: {
        ...prev[selectedCategory],
        slides: prev[selectedCategory].slides.map((slide) =>
          slide.id === slideId ? { ...slide, [key]: value } : slide
        ),
      },
    }));
  };

  const handleCategoryChange = (category: BannerCategory) => {
    setSelectedCategory(category);
  };

  const handleEffectChange = (effect: BannerEffect) => {
    setBannerData((prev) => ({
      ...prev,
      [selectedCategory]: {
        ...prev[selectedCategory],
        effect,
      },
    }));
  };
  // 2. 파일 처리 공통 로직 추출
  const processFile = (file: File, slideId: number) => {
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드 가능합니다.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setBannerData((prev) => ({
      ...prev,
      [selectedCategory]: {
        ...prev[selectedCategory],
        slides: prev[selectedCategory].slides.map((slide) =>
          slide.id === slideId
            ? {
              ...slide,
              imageFile: file,
              previewUrl,
            }
            : slide
        ),
      },
    }));
  };
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>, slideId: number) => {
    const file = e.target.files?.[0] ?? null;
    if (file) processFile(file, slideId);
  };
  // 3. 드래그 앤 드롭 핸들러 추가
  const handleDrag = (e: React.DragEvent, slideId: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActiveSlide(slideId);
    } else if (e.type === "dragleave") {
      setDragActiveSlide(null);
    }
  };

  const handleDrop = (e: React.DragEvent, slideId: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveSlide(null);

    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file, slideId);
  };
  const handleInputChange = (
    slideId: number,
    key: keyof BannerSlide,
    value: string | number
  ) => {
    updateSlide(slideId, key, value as BannerSlide[keyof BannerSlide]);
  };

  const addSlide = () => {
    if (currentSlides.length >= 5) {
      alert("이미지는 최대 5장까지 등록할 수 있습니다.");
      return;
    }

    const nextId =
      currentSlides.length > 0
        ? Math.max(...currentSlides.map((slide) => slide.id)) + 1
        : 1;

    setBannerData((prev) => ({
      ...prev,
      [selectedCategory]: {
        ...prev[selectedCategory],
        slides: [...prev[selectedCategory].slides, createEmptySlide(nextId)],
      },
    }));
  };

  const removeSlide = (slideId: number) => {
    if (currentSlides.length === 1) {
      alert("최소 1개의 배너는 유지되어야 합니다.");
      return;
    }

    setBannerData((prev) => ({
      ...prev,
      [selectedCategory]: {
        ...prev[selectedCategory],
        slides: prev[selectedCategory].slides.filter(
          (slide) => slide.id !== slideId
        ),
      },
    }));
  };

  const handleCancel = () => {
    if (!bannerResponse?.success || !bannerResponse.data) {
      setBannerData(createInitialBannerData());
      return;
    }

    const nextBannerData: Record<BannerCategory, BannerCategoryState> =
      createInitialBannerData();

    for (const banner of bannerResponse.data) {
      nextBannerData[banner.category] = {
        effect: banner.effect,
        slides:
          banner.slides && banner.slides.length > 0
            ? banner.slides.map((slide, index) => ({
              id: slide.id ?? index + 1,
              title: slide.title ?? "",
              description: slide.description ?? "",
              imageFile: null,
              previewUrl: toFullImageUrl(slide.imageUrl),
              fontSize: slide.fontSize ?? 48,
              fontColor: slide.fontColor ?? "#ffffff",
              fontFamily: slide.fontFamily ?? "Pretendard",
              textAlign: slide.textAlign ?? "center",
              verticalAlign: slide.verticalAlign ?? "center",
              duration: slide.duration ?? 5,
            }))
            : [createEmptySlide(1)],
      };
    }

    setBannerData(nextBannerData);
  };

  const getHorizontalClass = (align: TextAlign) => {
    switch (align) {
      case "left":
        return "justify-start text-left";
      case "center":
        return "justify-center text-center";
      case "right":
        return "justify-end text-right";
      default:
        return "justify-center text-center";
    }
  };

  const getVerticalClass = (align: VerticalAlign) => {
    switch (align) {
      case "top":
        return "items-start";
      case "center":
        return "items-center";
      case "bottom":
        return "items-end";
      default:
        return "items-center";
    }
  };

  const getSwiperProps = (effect: BannerEffect) => {
    switch (effect) {
      case "fade":
        return {
          effect: "fade" as const,
          fadeEffect: { crossFade: true },
        };
      case "coverflow":
        return {
          effect: "coverflow" as const,
          centeredSlides: true,
          slidesPerView: 1,
          coverflowEffect: {
            rotate: 20,
            stretch: 0,
            depth: 120,
            modifier: 1,
            slideShadows: false,
            scale: 0.95,
          },
        };
      case "flip":
        return {
          effect: "flip" as const,
          flipEffect: {
            slideShadows: false,
            limitRotation: true,
          },
        };
      case "cards":
        return {
          effect: "cards" as const,
          grabCursor: true,
        };
      case "creative":
        return {
          effect: "creative" as const,
          creativeEffect: {
            prev: {
              shadow: false,
              translate: [0, 0, -200],
            },
            next: {
              translate: ["100%", 0, 0],
            },
          },
        };
      case "cube":
        return {
          effect: "cube" as const,
          cubeEffect: {
            shadow: true,
            slideShadows: true,
            shadowOffset: 20,
            shadowScale: 0.94,
          },
        };
      default:
        return {
          effect: "slide" as const,
        };
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        category: selectedCategory,
        effect: currentCategoryData.effect as any, // TODO: types/siteBanner.ts에서 BannerEffect 타입에 'cube' 추가 필요
        slides: currentSlides.map((slide) => ({
          title: slide.title || null,
          description: slide.description || null,
          existingImageUrl:
            slide.previewUrl && !slide.previewUrl.startsWith("blob:")
              ? stripApiBaseUrl(slide.previewUrl)
              : null,
          existingImageName:
            slide.imageFile?.name || (slide.previewUrl ? "existing-image" : null),
          imageFile: slide.imageFile || null,
          fontSize: Number(slide.fontSize),
          fontColor: slide.fontColor,
          fontFamily: slide.fontFamily,
          textAlign: slide.textAlign,
          verticalAlign: slide.verticalAlign,
          duration: Number(slide.duration),
          isActive: true,
        })),
      };

      const result = await saveBanner(payload);

      if (result.success) {
        alert(result.message || "저장되었습니다.");
        await refetch();
        return;
      }

      alert("저장에 실패했습니다.");
    } catch (error: any) {
      console.error(error);
      alert(
        error?.response?.data?.message || "저장 중 오류가 발생했습니다."
      );
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900">
      <Sidebar sidebarOpen={sidebarOpen} />

      <div className="lg:pl-72">
        <Header sidebarOpen={sidebarOpen} onToggleSidebar={toggleSidebar} />

        <main className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8">
          <div className=" gap-8">
            <div className="flex-1 space-y-8">
              <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-gray-900">메인 배너 관리</h1>
                  <p className="text-sm text-gray-500 mt-1">카테고리별 배너 이미지, 문구 위치, 슬라이드 시간, 애니메이션 효과를 설정할 수 있습니다.</p>
                </div>

              </header>


              {(isBannerLoading || isBannerFetching) && (
                <section className="rounded-2xl border border-gray-200 bg-white px-4 py-6 text-sm text-gray-500 shadow-sm">
                  배너 데이터를 불러오는 중입니다...
                </section>
              )}

              <section className="bg-white border border-gray-200 rounded-2xl shadow-sm">
                <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-8">
                  <div className="space-y-4">
                    <div className="border-b border-gray-100 pb-3">
                      <h2 className="text-lg font-semibold">배너 카테고리</h2>
                      <p className="text-sm text-gray-500 mt-1">
                        총 6개 메뉴별로 배너를 각각 관리할 수 있습니다.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
                      {CATEGORY_OPTIONS.map((category) => {
                        const active = selectedCategory === category;

                        return (
                          <button
                            key={category}
                            type="button"
                            onClick={() => handleCategoryChange(category)}
                            className={[
                              "rounded-xl border px-4 py-3 text-sm font-medium transition",
                              active
                                ? "border-orange-500 bg-orange-50 text-orange-600"
                                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
                            ].join(" ")}
                          >
                            {category}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-gray-50 border border-gray-200 px-4 py-4 space-y-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-500">현재 선택된 카테고리</p>
                        <p className="text-lg font-semibold">{selectedCategory}</p>
                      </div>

                      <button
                        type="button"
                        onClick={addSlide}
                        className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                      >
                        슬라이드 추가
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          배너 애니메이션 효과
                        </label>
                        <select
                          value={currentCategoryData.effect}
                          onChange={(e) =>
                            handleEffectChange(e.target.value as BannerEffect)
                          }
                          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                          <option value="slide">기본 슬라이드</option>
                          <option value="fade">페이드</option>
                          <option value="coverflow">커버플로우</option>
                          <option value="flip">플립</option>
                          <option value="creative">크리에이티브</option>
                          <option value="cards">카드</option>
                          <option value="cube">큐브</option>
                        </select>
                      </div>

                      <div className="flex items-end">
                        <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 w-full">
                          현재 적용 효과:{" "}
                          <span className="font-semibold text-gray-900">
                            {currentCategoryData.effect}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {currentSlides.map((slide, index) => (
                      <div key={slide.id} className="rounded-2xl border border-gray-200 overflow-hidden">
                        {/* 슬라이드 헤더 부분은 유지 */}
                        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100 bg-gray-50">
                          <div>
                            <h3 className="text-base font-semibold">슬라이드 {index + 1}</h3>
                            <p className="text-sm text-gray-500">배너 스타일과 이미지를 설정하세요.</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeSlide(slide.id)}
                            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                          >
                            삭제
                          </button>
                        </div>

                        <div className="p-4 sm:p-6 space-y-6">
                          {/* --- 위지윅 스타일 툴바 시작 --- */}
                          <div className="flex flex-wrap items-center gap-2 p-2 bg-gray-50 border border-gray-200 rounded-xl">

                            {/* 폰트 선택 */}
                            <div className="flex items-center gap-2 border-r border-gray-300 pr-2">
                              <Type size={18} className="text-gray-400 ml-1" />
                              <select
                                value={slide.fontFamily}
                                onChange={(e) => handleInputChange(slide.id, "fontFamily", e.target.value)}
                                className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer"
                              >
                                <option value="Pretendard">Pretendard</option>
                                <option value="Noto Sans KR">Noto Sans KR</option>
                                <option value="Gmarket Sans">Gmarket Sans</option>
                                <option value="NanumSquare">NanumSquare</option>
                              </select>
                            </div>

                            {/* 글자 크기 조절 */}
                            <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
                              <button
                                type="button"
                                onClick={() => handleInputChange(slide.id, "fontSize", Math.max(20, slide.fontSize - 2))}
                                className="p-1.5 hover:bg-gray-200 rounded-md transition"
                              >
                                <Minus size={16} />
                              </button>
                              <div className="flex items-center gap-1 px-2">
                                <span className="text-sm font-bold w-6 text-center">{slide.fontSize}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleInputChange(slide.id, "fontSize", Math.min(120, slide.fontSize + 2))}
                                className="p-1.5 hover:bg-gray-200 rounded-md transition"
                              >
                                <Plus size={16} />
                              </button>
                            </div>

                            {/* 가로 정렬 */}
                            <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
                              {[
                                { val: "left", icon: AlignLeft },
                                { val: "center", icon: AlignCenter },
                                { val: "right", icon: AlignRight },
                              ].map((item) => (
                                <button
                                  key={item.val}
                                  type="button"
                                  onClick={() => handleInputChange(slide.id, "textAlign", item.val)}
                                  className={`p-1.5 rounded-md transition ${slide.textAlign === item.val ? "bg-orange-100 text-orange-600" : "hover:bg-gray-200 text-gray-500"
                                    }`}
                                >
                                  <item.icon size={18} />
                                </button>
                              ))}
                            </div>

                            {/* 세로 정렬 */}
                            <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
                              {[
                                { val: "top", icon: AlignVerticalJustifyStart },
                                { val: "center", icon: AlignVerticalJustifyCenter },
                                { val: "bottom", icon: AlignVerticalJustifyEnd },
                              ].map((item) => (
                                <button
                                  key={item.val}
                                  type="button"
                                  onClick={() => handleInputChange(slide.id, "verticalAlign", item.val)}
                                  className={`p-1.5 rounded-md transition ${slide.verticalAlign === item.val ? "bg-blue-100 text-blue-600" : "hover:bg-gray-200 text-gray-500"
                                    }`}
                                >
                                  <item.icon size={18} />
                                </button>
                              ))}
                            </div>

                            {/* 색상 선택기 커스텀 */}
                            <div className="flex items-center gap-2 pl-1">
                              <label className="relative cursor-pointer group">
                                <input
                                  type="color"
                                  value={slide.fontColor}
                                  onChange={(e) => handleInputChange(slide.id, "fontColor", e.target.value)}
                                  className="absolute inset-0 w-0 h-0 opacity-0"
                                />
                                <div className="flex items-center gap-2 p-1.5 rounded-md hover:bg-gray-200 transition">
                                  <div
                                    className="w-5 h-5 rounded-full border border-gray-300 shadow-sm"
                                    style={{ backgroundColor: slide.fontColor }}
                                  />

                                </div>
                              </label>
                            </div>
                          </div>
                          {/* --- 위지윅 스타일 툴바 끝 --- */}

                          {/* 이미지 업로드 영역 */}
                          <div>
                            <label className="block text-sm font-semibold mb-2 text-gray-700">배너 이미지</label>
                            <div
                              className={`relative group border-2 border-dashed rounded-xl transition-all duration-200 flex flex-col items-center justify-center p-6 ${dragActiveSlide === slide.id
                                ? "border-orange-500 bg-orange-50"
                                : "border-gray-300 bg-white hover:border-orange-300"
                                }`}
                              onDragEnter={(e) => handleDrag(e, slide.id)}
                              onDragLeave={(e) => handleDrag(e, slide.id)}
                              onDragOver={(e) => handleDrag(e, slide.id)}
                              onDrop={(e) => handleDrop(e, slide.id)}
                            >
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageChange(e, slide.id)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                              />

                              <div className="flex flex-col items-center gap-2 text-center">
                                <div className="p-3 bg-orange-100 rounded-full text-orange-600">
                                  <Plus size={24} />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-700">
                                    클릭하거나 이미지를 드래그하여 업로드
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    PNG, JPG, WebP (최대 10MB)
                                  </p>
                                </div>
                              </div>
                            </div>

                            {slide.previewUrl && (
                              <div className="mt-4 flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                {/* 이미지 클릭 시 setSelectedImage 호출 */}
                                <div
                                  className="relative w-24 h-16 rounded-lg overflow-hidden border border-gray-200 bg-white flex-shrink-0 cursor-pointer group hover:ring-2 hover:ring-orange-500 transition-all"
                                  onClick={() => setSelectedImage(slide.previewUrl)}
                                >
                                  <img src={slide.previewUrl} className="w-full h-full object-cover" alt="미리보기" />
                                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <span className="text-[10px] text-white font-bold">확대보기</span>
                                  </div>
                                </div>

                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {slide.imageFile?.name || "기존 이미지"}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {slide.imageFile ? `${(slide.imageFile.size / 1024 / 1024).toFixed(2)} MB` : "서버 저장됨"}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* 문구 입력 영역 (기존과 동일하되 디자인 소폭 조정) */}
                          <div className="grid gap-4">
                            <div>
                              <label className="block text-sm font-semibold mb-2 text-gray-700">메인 타이틀</label>
                              <input
                                type="text"
                                value={slide.title}
                                onChange={(e) => handleInputChange(slide.id, "title", e.target.value)}
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none transition"
                                placeholder="메인 문구를 입력하세요"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold mb-2 text-gray-700">서브 설명</label>
                              <textarea
                                value={slide.description}
                                onChange={(e) => handleInputChange(slide.id, "description", e.target.value)}
                                rows={2}
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none transition resize-none"
                                placeholder="설명 문구를 입력하세요"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold flex items-center gap-2">
                        <span className="w-2 h-6 bg-orange-500 rounded-full" />
                        실시간 미리보기
                      </h2>
                      <span className="text-xs text-gray-400">* 실제 사이트에 적용될 화면입니다.</span>
                    </div>

                    <div className="overflow-hidden rounded-3xl border-4 border-white shadow-2xl bg-gray-100">
                      <Swiper
                        key={`${selectedCategory}-${currentCategoryData.effect}`}
                        modules={[Autoplay, Pagination, Navigation, EffectFade, EffectCoverflow, EffectFlip, EffectCards, EffectCreative, EffectCube]}
                        loop={currentSlides.length > 1}
                        pagination={{ clickable: true }}
                        navigation={currentSlides.length > 1}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        speed={700}
                        {...getSwiperProps(currentCategoryData.effect)}
                        className="h-[300px] sm:h-[450px] w-full"
                      >
                        {currentSlides.map((slide) => (
                          <SwiperSlide key={slide.id}>
                            <div className="relative h-full w-full">
                              {slide.previewUrl ? (
                                <img src={slide.previewUrl} className="absolute inset-0 h-full w-full object-cover" alt="배너" />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-400">이미지를 등록해주세요</div>
                              )}
                              <div className="absolute inset-0 bg-black/20" />
                              <div className={`absolute inset-0 flex p-10 ${getHorizontalClass(slide.textAlign)} ${getVerticalClass(slide.verticalAlign)}`}>
                                <div className="max-w-2xl">
                                  <h2 style={{ fontSize: `${slide.fontSize}px`, color: slide.fontColor, fontFamily: slide.fontFamily }} className="font-extrabold leading-tight whitespace-pre-line drop-shadow-lg">
                                    {slide.title || "타이틀을 입력하세요"}
                                  </h2>
                                  {slide.description && (
                                    <p style={{ color: slide.fontColor, opacity: 0.9 }} className="mt-4 text-lg whitespace-pre-line drop-shadow-md">
                                      {slide.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                  </section>

                  <div className="flex flex-wrap items-center justify-end gap-3 pt-2">

                    <button
                      type="button"
                      onClick={handleCancel}
                      className="inline-flex items-center rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      disabled={isPending}
                      className="inline-flex items-center rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isPending ? "저장 중..." : "저장하기"}
                    </button>
                  </div>

                </form>
              </section>
            </div>
          </div>
        </main>
      </div>
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-10"
          onClick={() => setSelectedImage(null)} // 배경 클릭 시 닫기
        >
          <div className="relative max-w-7xl w-full h-full flex items-center justify-center">
            {/* 닫기 버튼 */}
            <button
              className="absolute top-0 right-0 m-4 text-white hover:text-gray-300 z-10 p-2 bg-black/20 rounded-full"
              onClick={() => setSelectedImage(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            {/* 원본 이미지 */}
            <img
              src={selectedImage}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-200"
              alt="확대된 이미지"
              onClick={(e) => e.stopPropagation()} // 이미지 클릭 시에는 닫히지 않게 보호
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSiteBasicPage;