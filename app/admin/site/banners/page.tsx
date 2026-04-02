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
} from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import "swiper/css/effect-coverflow";
import "swiper/css/effect-flip";
import "swiper/css/effect-cards";
import "swiper/css/effect-creative";
import { useSaveSiteBanner } from "@/hooks/useSaveSiteBanner";

const createInitialBannerData = (): Record<BannerCategory, BannerCategoryState> => ({
  메인: createCategoryState(),
  MIRACLEON소개: createCategoryState(),
  설립목적: createCategoryState(),
  주요사업: createCategoryState(),
  철학가치관: createCategoryState(),
  커뮤니티: createCategoryState(),
});

const AdminSiteBasicPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

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

  const handleImageChange = (
    e: ChangeEvent<HTMLInputElement>,
    slideId: number
  ) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;

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
        effect: currentCategoryData.effect,
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
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {previewOpen && (
        <div className="fixed inset-0 z-[60]">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={closePreview}
          />
          <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
            <div className="relative w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 sm:px-6">
                <div>
                  <h3 className="text-lg font-semibold">배너 미리보기</h3>
                  <p className="text-sm text-gray-500">
                    {selectedCategory} / 효과: {currentCategoryData.effect}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closePreview}
                  className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  닫기
                </button>
              </div>

              <div className="p-4 sm:p-6">
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
                  <Swiper
                    modules={[
                      Autoplay,
                      Pagination,
                      Navigation,
                      EffectFade,
                      EffectCoverflow,
                      EffectFlip,
                      EffectCards,
                      EffectCreative,
                    ]}
                    loop={currentSlides.length > 1}
                    pagination={{ clickable: true }}
                    navigation={currentSlides.length > 1}
                    autoplay={{
                      delay: currentSlides[0]?.duration
                        ? currentSlides[0].duration * 1000
                        : 5000,
                      disableOnInteraction: false,
                      pauseOnMouseEnter: true,
                    }}
                    speed={700}
                    {...getSwiperProps(currentCategoryData.effect)}
                    className="h-[320px] sm:h-[420px] lg:h-[540px] w-full"
                  >
                    {currentSlides.map((previewSlide) => (
                      <SwiperSlide
                        key={previewSlide.id}
                        data-swiper-autoplay={previewSlide.duration * 1000}
                      >
                        <div className="relative h-full w-full overflow-hidden">
                          {previewSlide.previewUrl ? (
                            <img
                              src={previewSlide.previewUrl}
                              alt={`slide-preview-${previewSlide.id}`}
                              className="absolute inset-0 h-full w-full object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-sm text-gray-400">
                              업로드된 이미지가 없습니다
                            </div>
                          )}

                          <div className="absolute inset-0 bg-black/20" />

                          <div
                            className={[
                              "absolute inset-0 flex p-8 sm:p-10 lg:p-14",
                              getHorizontalClass(previewSlide.textAlign),
                              getVerticalClass(previewSlide.verticalAlign),
                            ].join(" ")}
                          >
                            <div className="w-full max-w-[420px] text-white">
                              <p
                                style={{
                                  fontSize: `${previewSlide.fontSize}px`,
                                  color: previewSlide.fontColor,
                                  fontFamily: previewSlide.fontFamily,
                                }}
                                className="text-2xl sm:text-3xl lg:text-5xl font-extrabold leading-tight whitespace-pre-line drop-shadow-md"
                              >
                                {previewSlide.title ||
                                  "여기에 메인 문구가 표시됩니다"}
                              </p>

                              {previewSlide.description && (
                                <p
                                  style={{
                                    fontSize: `${Math.max(
                                      previewSlide.fontSize - 20,
                                      12
                                    )}px`,
                                    color: previewSlide.fontColor,
                                    fontFamily: previewSlide.fontFamily,
                                  }}
                                  className="mt-3 text-sm sm:text-base lg:text-lg leading-relaxed whitespace-pre-line text-white/95 drop-shadow"
                                >
                                  {previewSlide.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>

                <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                  슬라이드별 표시 시간과 선택한 애니메이션 효과가 함께 적용됩니다.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Sidebar sidebarOpen={sidebarOpen} />

      <div className="lg:pl-72">
        <Header sidebarOpen={sidebarOpen} onToggleSidebar={toggleSidebar} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <section className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight">메인 배너 관리</h1>
            <p className="text-sm text-gray-500">
              카테고리별 배너 이미지, 문구 위치, 슬라이드 시간, 애니메이션 효과를 설정할 수 있습니다.
            </p>
          </section>

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
                      <option value="cards">카드</option>
                      <option value="creative">크리에이티브</option>
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
                  <div
                    key={slide.id}
                    className="rounded-2xl border border-gray-200 overflow-hidden"
                  >
                    <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100 bg-gray-50">
                      <div>
                        <h3 className="text-base font-semibold">
                          슬라이드 {index + 1}
                        </h3>
                        <p className="text-sm text-gray-500">
                          이미지, 문구, 정렬, 슬라이드 시간을 설정하세요.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeSlide(slide.id)}
                        className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                      >
                        삭제
                      </button>
                    </div>

                    <div className="p-4 sm:p-6">
                      <div className="space-y-5">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            배너 이미지 업로드
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, slide.id)}
                            className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-sm file:font-medium hover:file:bg-gray-200"
                          />
                          <p className="mt-2 text-xs text-gray-500">
                            카테고리별 최대 5장까지 등록 가능합니다.
                          </p>
                          {slide.imageFile && (
                            <p className="mt-2 text-xs text-gray-500">
                              선택 파일: {slide.imageFile.name}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            메인 문구
                          </label>
                          <input
                            type="text"
                            value={slide.title}
                            onChange={(e) =>
                              handleInputChange(slide.id, "title", e.target.value)
                            }
                            placeholder="예: 작은 재능이 모이면 세상은 조금 더 따뜻해집니다"
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            보조 문구
                          </label>
                          <textarea
                            value={slide.description}
                            onChange={(e) =>
                              handleInputChange(
                                slide.id,
                                "description",
                                e.target.value
                              )
                            }
                            rows={3}
                            placeholder="필요한 경우 보조 설명 문구를 입력하세요."
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              글자 크기(px)
                            </label>
                            <input
                              type="number"
                              min={20}
                              max={120}
                              value={slide.fontSize}
                              onChange={(e) =>
                                handleInputChange(
                                  slide.id,
                                  "fontSize",
                                  Number(e.target.value)
                                )
                              }
                              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">
                              글자 색상
                            </label>
                            <input
                              type="color"
                              value={slide.fontColor}
                              onChange={(e) =>
                                handleInputChange(
                                  slide.id,
                                  "fontColor",
                                  e.target.value
                                )
                              }
                              className="w-full h-[46px] rounded-xl border border-gray-300"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">
                              폰트
                            </label>
                            <select
                              value={slide.fontFamily}
                              onChange={(e) =>
                                handleInputChange(
                                  slide.id,
                                  "fontFamily",
                                  e.target.value
                                )
                              }
                              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm"
                            >
                              <option value="Pretendard">Pretendard</option>
                              <option value="Noto Sans KR">Noto Sans KR</option>
                              <option value="Gmarket Sans">Gmarket Sans</option>
                              <option value="NanumSquare">NanumSquare</option>
                              <option value="Spoqa Han Sans">Spoqa Han Sans</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              가로 정렬
                            </label>
                            <select
                              value={slide.textAlign}
                              onChange={(e) =>
                                handleInputChange(
                                  slide.id,
                                  "textAlign",
                                  e.target.value
                                )
                              }
                              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            >
                              <option value="left">좌측정렬</option>
                              <option value="center">중앙정렬</option>
                              <option value="right">우측정렬</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">
                              세로 정렬
                            </label>
                            <select
                              value={slide.verticalAlign}
                              onChange={(e) =>
                                handleInputChange(
                                  slide.id,
                                  "verticalAlign",
                                  e.target.value
                                )
                              }
                              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            >
                              <option value="top">상단정렬</option>
                              <option value="center">중앙정렬</option>
                              <option value="bottom">하단정렬</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">
                              슬라이드 시간(초)
                            </label>
                            <input
                              type="number"
                              min={1}
                              max={60}
                              value={slide.duration}
                              onChange={(e) =>
                                handleInputChange(
                                  slide.id,
                                  "duration",
                                  Number(e.target.value)
                                )
                              }
                              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={openPreview}
                  className="inline-flex items-center rounded-xl border border-blue-300 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-700 hover:bg-blue-100"
                >
                  미리보기
                </button>
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
        </main>
      </div>
    </div>
  );
};

export default AdminSiteBasicPage;