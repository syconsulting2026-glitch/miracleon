"use client";

import Header from "@/components/admin/Header";
import Sidebar from "@/components/admin/Siderbar";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { ChangeEvent, DragEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useSaveSiteContent } from "@/hooks/useSaveSiteContent";
import { SaveSiteContentPayload } from "@/types/siteContent";
import { useSiteContents } from "@/hooks/useSiteContents";
import { SiteContentPageItem } from "@/types/siteContent";

// 아이콘 라이브러리 추가
import {
    ChevronUp, ChevronDown,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Image as ImageIcon,
    PanelLeft,
    PanelRight,
    PanelTop,
    Grid,
    Type as FontIcon,
    ArrowRightCircle,
    Monitor,
    Tablet,
    Smartphone,
    Plus,
    Trash2,
    MoveVertical,
    X
} from "lucide-react";

type ContentCategory = "MIRACLEON소개" | "설립목적" | "주요사업" | "철학가치관";
type PreviewDevice = "desktop" | "tablet" | "mobile";
type SectionType = "text" | "imageText" | "cta" | "titleImage" | "cardGrid";
type TextAlign = "left" | "center" | "right";
type AnimationType = "none" | "fadeUp" | "fadeIn" | "slideLeft" | "slideRight" | "zoomIn";

type CardGridItem = {
    id: number;
    title: string;
    description: string;
    iconUrl: string;
    iconFile?: File | null;
    iconName?: string;
    titleColor: string;
    descriptionColor: string;
    cardBgColor: string;
};

type BaseSection = {
    id: number;
    type: SectionType;
    orderIndex: number;
    animation: AnimationType;
    title: string;
    description: string;
    titleColor: string;
    descriptionColor: string;
    align: TextAlign;
    backgroundColor: string;
};

type TextSection = BaseSection & { type: "text" };
type ImageTextSection = BaseSection & {
    type: "imageText";
    imageUrl: string;
    imageFile?: File | null;
    imagePosition: "left" | "right" | "top";
};
type CTASection = BaseSection & {
    type: "cta";
    buttonText: string;
    buttonLink: string;
    buttonColor: string;
    buttonTextColor: string;
};
type TitleImageSection = BaseSection & {
    type: "titleImage";
    imageUrl: string;
    imageFile?: File | null;
};
type CardGridSection = BaseSection & {
    type: "cardGrid";
    items: CardGridItem[];
};

type Section = TextSection | ImageTextSection | CTASection | TitleImageSection | CardGridSection;

// 공통 툴바 버튼 컴포넌트
const ToolbarButton = ({ active, onClick, children, title }: { active: boolean; onClick: () => void; children: React.ReactNode; title: string }) => (
    <button
        type="button"
        onClick={onClick}
        title={title}
        className={`p-2 rounded-lg transition-all ${active
            ? "bg-orange-100 text-orange-600 border border-orange-200 shadow-sm"
            : "hover:bg-gray-100 text-gray-400 border border-transparent"
            }`}
    >
        {children}
    </button>
);

// 공통 컬러 피커 컴포넌트
const ColorPicker = ({ value, onChange, label }: { value: string; onChange: (color: string) => void; label: string }) => (
    <div className="flex items-center gap-2 px-2 py-1 bg-white border border-gray-200 rounded-lg">
        <label className="relative cursor-pointer flex items-center">
            <input
                type="color"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            />
            <div className="w-5 h-5 rounded-full border border-gray-300 shadow-inner" style={{ backgroundColor: value }} />
        </label>
        <span className="text-[11px] font-bold text-gray-500 uppercase">{label}</span>
    </div>
);

const AdminContentsPage = () => {
    // 1. 상태 추가 (컴포넌트 상단)
    const [selectedImage, setSelectedImage] = useState<string | null>(null); // 모달용
    const [activeDragId, setActiveDragId] = useState<string | null>(null); // 드래그 상태 추적용
    const [isFloatingSaveButton, setIsFloatingSaveButton] = useState(false); // 최종 저장하기 버튼 플로팅 상태

    // 스크롤 이벤트 리스너 (플로팅 버튼 처리)
    useEffect(() => {
        const handleScroll = () => {
            const headerElement = document.querySelector('header'); // 헤더 요소를 찾습니다.
            // 헤더의 높이보다 스크롤 위치가 내려가면 플로팅 버튼을 활성화합니다.
            if (headerElement) {
                setIsFloatingSaveButton(window.scrollY > headerElement.offsetHeight);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    // 2. 파일 처리 공통 로직 (핸들러 대체)
    const processFile = (file: File, id: number) => {
        if (!file.type.startsWith("image/")) return alert("이미지 파일만 가능합니다.");
        const url = URL.createObjectURL(file);
        setSections((prev) =>
            prev.map((s) => {
                if (s.id !== id) return s;
                if (s.type === "imageText" || s.type === "titleImage") {
                    return { ...s, imageUrl: url, imageFile: file };
                }
                return s;
            })
        );
    };
    const processCardFile = (file: File, sectionId: number, cardId: number) => {
        if (!file.type.startsWith("image/")) return alert("이미지 파일만 가능합니다.");
        const url = URL.createObjectURL(file);
        setSections((prev) =>
            prev.map((s) => {
                if (s.id === sectionId && s.type === "cardGrid") {
                    const newItems = s.items.map((item) =>
                        item.id === cardId ? { ...item, iconUrl: url, iconFile: file } : item
                    );
                    return { ...s, items: newItems };
                }
                return s;
            })
        );
    };

    // 3. 드래그 이벤트 핸들러
    const handleDrag = (e: React.DragEvent, dragId: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") setActiveDragId(dragId);
        else if (e.type === "dragleave") setActiveDragId(null);
    };

    const handleDrop = (e: React.DragEvent, dragId: string, callback: (file: File) => void) => {
        e.preventDefault();
        e.stopPropagation();
        setActiveDragId(null);
        const file = e.dataTransfer.files?.[0];
        if (file) callback(file);
    };
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<ContentCategory>("MIRACLEON소개");
    const [previewDevice, setPreviewDevice] = useState<PreviewDevice>("desktop");
    const [sections, setSections] = useState<Section[]>([]);
    const [draggingId, setDraggingId] = useState<number | null>(null);

    const { mutateAsync: saveContent, isPending } = useSaveSiteContent();
    const { data: contentResponse, isLoading, refetch } = useSiteContents();

    useEffect(() => {
        if (contentResponse?.success && contentResponse.data) {
            const categoryData = contentResponse.data.find(
                (item: SiteContentPageItem) => item.category === selectedCategory
            );

            if (categoryData && categoryData.sections) {
                // 서버 데이터를 내부 Section 타입에 맞게 매핑
                const mappedSections: Section[] = categoryData.sections.map((s: any) => ({
                    ...s,
                    // 서버 데이터에 없을 경우를 대비한 기본값 설정
                    orderIndex: s.orderIndex ?? 0,
                    align: s.align ?? "center",
                    backgroundColor: s.backgroundColor ?? "#ffffff",
                    animation: s.animation ?? "fadeUp",
                    titleColor: s.titleColor ?? "#111827",
                    descriptionColor: s.descriptionColor ?? "#4B5563",

                    // 각 타입별 특수 필드 처리 (이미 존재하는 경우 유지)
                    ...(s.type === "imageText" && {
                        imagePosition: s.imagePosition ?? "left",
                        imageUrl: s.imageUrl ?? "",
                    }),
                    ...(s.type === "cta" && {
                        buttonText: s.buttonText ?? "자세히 보기",
                        buttonColor: s.buttonColor ?? "#F97316",
                        buttonTextColor: s.buttonTextColor ?? "#ffffff",
                    }),
                    ...(s.type === "cardGrid" && {
                        items: (s.items || []).map((item: any) => ({
                            ...item,
                            titleColor: item.titleColor ?? "#111827",
                            descriptionColor: item.descriptionColor ?? "#4B5563",
                            cardBgColor: item.cardBgColor ?? "#F9FAFB",
                        })),
                    }),
                })) as Section[];

                setSections(mappedSections);
            } else {
                setSections([]);
            }
        }
    }, [contentResponse, selectedCategory]);

    // 섹션 순서 이동 함수
    const moveSection = (id: number, direction: 'up' | 'down') => {
        const index = sections.findIndex(s => s.id === id);
        if (index === -1) return;

        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        // 범위를 벗어나면 실행하지 않음
        if (targetIndex < 0 || targetIndex >= sections.length) return;

        const newSections = [...sections];
        // 위치 스왑
        [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];

        // orderIndex 재설정 및 상태 업데이트
        setSections(newSections.map((s, idx) => ({ ...s, orderIndex: idx })));
    };

    const updateSection = (id: number, updates: Partial<Section>) => {
        setSections((prev) =>
            prev.map((section) => (section.id === id ? ({ ...section, ...updates } as Section) : section))
        );
    };

    const addSection = (type: SectionType) => {
        const newId = Date.now();
        const base: BaseSection = {
            id: newId,
            type,
            orderIndex: sections.length,
            animation: "fadeUp",
            title: "",
            description: "",
            titleColor: "#111827",
            descriptionColor: "#4B5563",
            align: "center",
            backgroundColor: "#ffffff",
        };

        let newSection: Section;
        if (type === "text") newSection = { ...base, type: "text" };
        else if (type === "imageText")
            newSection = { ...base, type: "imageText", imageUrl: "", imagePosition: "left" };
        else if (type === "cta")
            newSection = { ...base, type: "cta", buttonText: "자세히 보기", buttonLink: "", buttonColor: "#F97316", buttonTextColor: "#ffffff" };
        else if (type === "titleImage")
            newSection = { ...base, type: "titleImage", imageUrl: "" };
        else {
            newSection = {
                ...base,
                type: "cardGrid",
                items: [
                    {
                        id: 1,
                        title: "",
                        description: "",
                        iconUrl: "",
                        titleColor: "#111827",
                        descriptionColor: "#4B5563",
                        cardBgColor: "#F9FAFB",
                    },
                ],
            };
        }

        setSections((prev) => [...prev, newSection]);
    };

    const removeSection = (id: number) => {
        setSections((prev) => prev.filter((s) => s.id !== id));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>, id: number) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);

        setSections((prev) =>
            prev.map((s) => {
                if (s.id !== id) return s;
                if (s.type === "imageText" || s.type === "titleImage") {
                    return { ...s, imageUrl: url, imageFile: file };
                }
                return s;
            })
        );
    };

    const handleCardFileChange = (e: ChangeEvent<HTMLInputElement>, sectionId: number, cardId: number) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);

        setSections((prev) =>
            prev.map((s) => {
                if (s.id === sectionId && s.type === "cardGrid") {
                    const newItems = s.items.map((item) =>
                        item.id === cardId ? { ...item, iconUrl: url, iconFile: file } : item
                    );
                    return { ...s, items: newItems };
                }
                return s;
            })
        );
    };

  

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {

            console.log(sections);
            const payload: SaveSiteContentPayload = {
                category: selectedCategory,
                sections: sections.map((s) => ({
                    ...s,
                    // 필수 필드인 'name' 추가 (보통 프론트의 title 값을 할당합니다)
                    name: s.title || "",
                    backgroundColor: s.backgroundColor || "#ffffff",
                    // 기존 이미지 URL 처리
                    existingImageUrl:
                        (s.type === "imageText" || s.type === "titleImage")
                            ? (s.imageUrl.startsWith("blob:") ? null : s.imageUrl)
                            : null,

                    // 카드 그리드 아이템 처리
                    items: s.type === "cardGrid"
                        ? s.items.map(item => ({
                            ...item,
                            existingIconUrl: item.iconUrl.startsWith("blob:") ? null : item.iconUrl
                        }))
                        : [] // undefined 대신 빈 배열을 보내는 것이 안전할 수 있습니다
                })),
            };

            const res = await saveContent(payload);
            if (res.success) {
                alert("저장되었습니다.");
                refetch();
            }
        } catch (err) {
            console.error(err);
            alert("저장 중 오류가 발생했습니다.");
        }
    };

    // --- 위지윅 에디터 렌더링 함수 ---
    const renderSectionEditor = (section: Section) => {
        return (
            <div className="space-y-6">
                {/* 2. 섹션별 특화 툴바 (WYSIWYG 아이콘) */}
                <div className="flex flex-col gap-3">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">스타일 및 레이아웃 설정</label>
                    <div className="flex flex-wrap items-center gap-3 p-2 bg-gray-50 border border-gray-200 rounded-2xl shadow-sm">

                        {/* [텍스트 정렬 툴바] - 모든 섹션 공통 혹은 타입별 */}
                        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-gray-100 shadow-sm">
                            <ToolbarButton
                                active={section.align === "left"}
                                onClick={() => updateSection(section.id, { align: "left" })}
                                title="왼쪽 정렬"
                            >
                                <AlignLeft size={18} />
                            </ToolbarButton>
                            <ToolbarButton
                                active={section.align === "center"}
                                onClick={() => updateSection(section.id, { align: "center" })}
                                title="중앙 정렬"
                            >
                                <AlignCenter size={18} />
                            </ToolbarButton>
                            <ToolbarButton
                                active={section.align === "right"}
                                onClick={() => updateSection(section.id, { align: "right" })}
                                title="오른쪽 정렬"
                            >
                                <AlignRight size={18} />
                            </ToolbarButton>
                        </div>

                        {/* [Image+Text 전용: 이미지 위치 설정] */}
                        {section.type === "imageText" && (
                            <div className="flex items-center gap-1 bg-blue-50/50 p-1 rounded-lg border border-blue-100">
                                <ToolbarButton
                                    active={section.imagePosition === "left"}
                                    onClick={() => updateSection(section.id, { imagePosition: "left" })}
                                    title="이미지 왼쪽 / 텍스트 오른쪽"
                                >
                                    <PanelLeft size={20} />
                                </ToolbarButton>
                                <ToolbarButton
                                    active={section.imagePosition === "right"}
                                    onClick={() => updateSection(section.id, { imagePosition: "right" })}
                                    title="이미지 오른쪽 / 텍스트 왼쪽"
                                >
                                    <PanelRight size={20} />
                                </ToolbarButton>
                                <ToolbarButton
                                    active={section.imagePosition === "top"}
                                    onClick={() => updateSection(section.id, { imagePosition: "top" })}
                                    title="이미지 상단 / 텍스트 하단"
                                >
                                    <PanelTop size={20} />
                                </ToolbarButton>
                            </div>
                        )}

                        {/* [컬러 피커들] */}
                        <div className="flex flex-wrap items-center gap-2">
                            <ColorPicker
                                label="제목"
                                value={section.titleColor}
                                onChange={(color) => updateSection(section.id, { titleColor: color })}
                            />
                            <ColorPicker
                                label="설명"
                                value={section.descriptionColor}
                                onChange={(color) => updateSection(section.id, { descriptionColor: color })}
                            />
                            {section.type !== "titleImage" &&(
                                <ColorPicker
                                label="배경"
                                value={section.backgroundColor}
                                onChange={(color) => updateSection(section.id, { backgroundColor: color })}
                            />
                            )}
                            
                        </div>

                        {/* [CTA 전용: 버튼 컬러] */}
                        {section.type === "cta" && (
                            <div className="flex flex-wrap items-center gap-2 border-l border-gray-200 pl-3">
                                <ColorPicker
                                    label="버튼 배경"
                                    value={section.buttonColor}
                                    onChange={(color) => updateSection(section.id, { buttonColor: color })}
                                />
                                <ColorPicker
                                    label="버튼 글자"
                                    value={section.buttonTextColor}
                                    onChange={(color) => updateSection(section.id, { buttonTextColor: color })}
                                />
                            </div>
                        )}
                    </div>
                </div>
                {/* 1. 공통 타이틀 & 설명 입력 */}
                <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">메인 타이틀</label>
                        <input
                            type="text"
                            value={section.title}
                            onChange={(e) => updateSection(section.id, { title: e.target.value })}
                            placeholder="섹션 제목을 입력하세요"
                            className="w-full border-b border-gray-200 py-2 font-bold text-lg outline-none focus:border-orange-500 transition-colors"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">상세 설명</label>
                        <textarea
                            value={section.description}
                            onChange={(e) => updateSection(section.id, { description: e.target.value })}
                            placeholder="상세 내용을 입력하세요 (엔터로 줄바꿈 가능)"
                            rows={3}
                            className="w-full border border-gray-100 rounded-xl p-3 text-sm text-gray-600 outline-none focus:border-orange-500 transition-colors resize-none"
                        />
                    </div>
                </div>



                {/* 3. 파일 업로드 및 특수 입력창 (섹션 타입별) */}
                <div className="pt-2">
                    {(section.type === "imageText" || section.type === "titleImage") && (
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                <ImageIcon size={14} /> 섹션 이미지 업로드
                            </label>

                            <div
                                className={`relative border-2 border-dashed rounded-2xl p-4 transition-all flex items-center gap-4 ${activeDragId === `section-${section.id}` ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-orange-300"
                                    }`}
                                onDragEnter={(e) => handleDrag(e, `section-${section.id}`)}
                                onDragOver={(e) => handleDrag(e, `section-${section.id}`)}
                                onDragLeave={(e) => handleDrag(e, `section-${section.id}`)}
                                onDrop={(e) => handleDrop(e, `section-${section.id}`, (file) => processFile(file, section.id))}
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) processFile(file, section.id);
                                    }}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />

                                <div className="flex-1 text-center py-2">
                                    <p className="text-xs font-medium text-gray-500">이미지를 드래그하거나 클릭하여 업로드</p>
                                </div>

                                {section.imageUrl && (
                                    <div
                                        className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 shrink-0 shadow-sm z-20 cursor-pointer hover:ring-2 hover:ring-orange-500 transition-all"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedImage(section.imageUrl);
                                        }}
                                    >
                                        <Image src={section.imageUrl} alt="미리보기" fill className="object-cover" />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {section.type === "cta" && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400">버튼 텍스트</label>
                                <input
                                    type="text"
                                    value={section.buttonText}
                                    onChange={(e) => updateSection(section.id, { buttonText: e.target.value })}
                                    className="w-full border-b border-gray-200 py-1 text-sm outline-none focus:border-orange-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400">연결 링크(URL)</label>
                                <input
                                    type="text"
                                    value={section.buttonLink}
                                    onChange={(e) => updateSection(section.id, { buttonLink: e.target.value })}
                                    placeholder="https://..."
                                    className="w-full border-b border-gray-200 py-1 text-sm outline-none focus:border-orange-500"
                                />
                            </div>
                        </div>
                    )}

                    {section.type === "cardGrid" && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                    <Grid size={14} /> 그리드 카드 리스트
                                </label>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newItems = [
                                            ...section.items,
                                            {
                                                id: Date.now(),
                                                title: "",
                                                description: "",
                                                iconUrl: "",
                                                titleColor: "#111827",
                                                descriptionColor: "#4B5563",
                                                cardBgColor: "#F9FAFB",
                                            },
                                        ];
                                        updateSection(section.id, { items: newItems });
                                    }}
                                    className="text-xs bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors"
                                >
                                    카드 추가 +
                                </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {section.items.map((item) => (
                                    <div key={item.id} className="p-4 rounded-2xl border border-gray-200 bg-white shadow-sm space-y-3 relative group">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newItems = section.items.filter(i => i.id !== item.id);
                                                updateSection(section.id, { items: newItems });
                                            }}
                                            className="absolute top-2 right-2 text-gray-300 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 overflow-hidden shrink-0">
                                                {item.iconUrl ? <Image src={item.iconUrl} alt="아이콘" width={40} height={40} className="object-cover" /> : <ImageIcon size={20} className="text-gray-300" />}
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleCardFileChange(e, section.id, item.id)}
                                                className="text-[10px] text-gray-400 w-full"
                                            />
                                        </div>
                                        <input
                                            type="text"
                                            value={item.title}
                                            onChange={(e) => {
                                                const newItems = section.items.map(i => i.id === item.id ? { ...i, title: e.target.value } : i);
                                                updateSection(section.id, { items: newItems });
                                            }}
                                            placeholder="카드 제목"
                                            className="w-full text-sm font-bold border-b border-gray-100 py-1 outline-none focus:border-orange-500"
                                        />
                                        <textarea
                                            value={item.description}
                                            onChange={(e) => {
                                                const newItems = section.items.map(i => i.id === item.id ? { ...i, description: e.target.value } : i);
                                                updateSection(section.id, { items: newItems });
                                            }}
                                            placeholder="카드 설명"
                                            rows={2}
                                            className="w-full text-xs text-gray-500 outline-none resize-none"
                                        />
                                        <div className="flex gap-2 pt-1">
                                            <ColorPicker label="배경" value={item.cardBgColor} onChange={(c) => {
                                                const newItems = section.items.map(i => i.id === item.id ? { ...i, cardBgColor: c } : i);
                                                updateSection(section.id, { items: newItems });
                                            }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen w-full bg-gray-50 text-gray-900">
            <Sidebar sidebarOpen={sidebarOpen} />

            <div className="lg:pl-72">
                <Header sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

                <main className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8">
                    <div className=" gap-8">

                        {/* --- 왼쪽: 설정 영역 --- */}
                        <div className="flex-1 space-y-8">
                            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-3xl font-black tracking-tight text-gray-900">콘텐츠 관리</h1>
                                    <p className="text-sm text-gray-500 mt-1">카테고리별 섹션을 자유롭게 구성하고 스타일을 편집하세요.</p>
                                </div>
                                {/* 원래 위치의 저장 버튼 (플로팅 버튼 활성화 시 숨김) */}
                                <div className={`flex gap-2 ${isFloatingSaveButton ? "opacity-0 pointer-events-none" : ""}`}>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={isPending}
                                        className="bg-orange-500 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all disabled:opacity-50"
                                    >
                                        {isPending ? "저장 중..." : "최종 저장하기"}
                                    </button>
                                </div>
                            </header>

                            {/* 플로팅 저장 버튼 (스크롤 시 나타남) */}
                            {isFloatingSaveButton && (
                                <div className="fixed bottom-4 right-4 z-50">
                                    <button
                                        onClick={handleSubmit}
                                        disabled={isPending}
                                        className="bg-orange-500 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all disabled:opacity-50"
                                    >
                                        {isPending ? "저장 중..." : "최종 저장하기"}
                                    </button>
                                </div>
                            )}

                            {/* 카테고리 탭 */}
                            <nav className="flex flex-wrap gap-2 p-1.5 bg-white rounded-2xl border border-gray-200 shadow-sm">
                                {["MIRACLEON소개", "설립목적", "주요사업", "철학가치관"].map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat as ContentCategory)}
                                        className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${selectedCategory === cat ? "bg-gray-900 text-white shadow-md" : "text-gray-500 hover:bg-gray-50"
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </nav>
                            {/* 섹션 추가 도구 */}
                            <div className="p-8 border-2 border-dashed border-gray-200 rounded-[32px] bg-white/50 flex flex-col items-center gap-6">
                                <p className="text-gray-400 font-bold flex items-center gap-2">
                                    <Plus size={20} /> 원하는 섹션을 클릭하여 추가하세요
                                </p>
                                <div className="flex flex-wrap justify-center gap-3">
                                    {[
                                        { type: "text", label: "텍스트 전용", icon: <FontIcon size={16} /> },
                                        { type: "imageText", label: "이미지+텍스트", icon: <ImageIcon size={16} /> },
                                        { type: "cta", label: "CTA(버튼)", icon: <ArrowRightCircle size={16} /> },
                                        { type: "titleImage", label: "타이틀+배경이미지", icon: <ImageIcon size={16} /> },
                                        { type: "cardGrid", label: "카드 그리드", icon: <Grid size={16} /> }
                                    ].map((btn) => (
                                        <button
                                            key={btn.type}
                                            onClick={() => addSection(btn.type as SectionType)}
                                            className="flex items-center gap-2 bg-white border border-gray-200 px-5 py-2.5 rounded-2xl text-sm font-bold text-gray-700 hover:border-orange-500 hover:text-orange-600 transition-all shadow-sm hover:shadow-orange-100"
                                        >
                                            {btn.icon} {btn.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {/* 섹션 편집 리스트 */}
                            <div className="space-y-4">
                                {sections.map((section) => (
                                    <div
                                        key={section.id}

                                        className={`bg-white border-2 rounded-[32px] transition-all overflow-hidden ${draggingId === section.id ? "border-orange-500 opacity-50 shadow-2xl" : "border-gray-100 shadow-sm hover:shadow-md"}`}
                                    >

                                        <div className="flex items-center justify-between px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                                            <div className="flex items-center gap-3">
                                                {/* <div className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-200 rounded text-gray-400">
                                                    <MoveVertical size={20} />
                                                </div> */}
                                                <span className="bg-orange-100 text-orange-600 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                                                    {section.type}
                                                </span>
                                            </div>
                                            <div>
                                                <button
                                                    type="button"
                                                    onClick={() => moveSection(section.id, 'up')}
                                                    disabled={sections.indexOf(section) === 0} // 첫 번째 요소면 위로 버튼 비활성화
                                                    className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 disabled:opacity-20 disabled:hover:bg-transparent transition-colors"
                                                    title="위로 이동"
                                                >
                                                    <ChevronUp size={18} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => moveSection(section.id, 'down')}
                                                    disabled={sections.indexOf(section) === sections.length - 1} // 마지막 요소면 아래로 버튼 비활성화
                                                    className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 disabled:opacity-20 disabled:hover:bg-transparent transition-colors"
                                                    title="아래로 이동"
                                                >
                                                    <ChevronDown size={18} />
                                                </button>
                                                <button
                                                    onClick={() => removeSection(section.id)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>

                                        </div>
                                        <div className="p-6">
                                            {renderSectionEditor(section)}
                                        </div>


                                    </div>
                                ))}


                            </div>
                        </div>



                        <div className="sticky top-24 space-y-4 mt-10">
                            <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
                                <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
                                    <h2 className="font-black text-gray-900 flex items-center gap-2">
                                        <span className="w-2 h-5 bg-orange-500 rounded-full" /> 실시간 미리보기
                                    </h2>
                                    <div className="flex bg-gray-100 p-1 rounded-xl">
                                        <button onClick={() => setPreviewDevice("desktop")} className={`p-2 rounded-lg transition-all ${previewDevice === "desktop" ? "bg-white shadow-sm text-orange-600" : "text-gray-400"}`}><Monitor size={18} /></button>
                                        <button onClick={() => setPreviewDevice("tablet")} className={`p-2 rounded-lg transition-all ${previewDevice === "tablet" ? "bg-white shadow-sm text-orange-600" : "text-gray-400"}`}><Tablet size={18} /></button>
                                        <button onClick={() => setPreviewDevice("mobile")} className={`p-2 rounded-lg transition-all ${previewDevice === "mobile" ? "bg-white shadow-sm text-orange-600" : "text-gray-400"}`}><Smartphone size={18} /></button>
                                    </div>
                                </div>

                                {/* 프리뷰 프레임 */}
                                <div className={`mx-auto bg-white transition-all duration-500 overflow-y-auto border-4 border-gray-900 rounded-[2rem] shadow-2xl ${previewDevice === "desktop" ? "w-full aspect-video" : previewDevice === "tablet" ? "w-[380px] h-[600px]" : "w-[280px] h-[550px]"
                                    }`}>
                                    <div className="p-0">
                                        <SectionPreview sections={sections} />
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 text-[11px] text-orange-700 leading-relaxed font-medium">
                                💡 팁: 설정을 변경하면 미리보기 화면에 즉시 반영됩니다. 텍스트 컬러와 이미지 배치를 조정하여 최적의 디자인을 찾아보세요!
                            </div>
                        </div>

                    </div>
                </main>
            </div>
            {/* 이미지 확대 모달 */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-w-5xl w-full h-full flex items-center justify-center">
                        <button
                            className="absolute top-0 right-0 m-4 text-white hover:text-gray-300 z-[110]"
                            onClick={() => setSelectedImage(null)}
                        >
                            <X size={32} /> {/* 또는 X 아이콘 */}
                        </button>
                        <img
                            src={selectedImage}
                            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-transform"
                            alt="확대보기"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

// --- 미리보기 전용 컴포넌트 ---
function SectionPreview({ sections }: { sections: Section[] }) {
    const getTextAlignClass = (align: TextAlign) => {
        if (align === "left") return "text-left items-start";
        if (align === "right") return "text-right items-end";
        return "text-center items-center";
    };

    return (
        <div className="w-full">
            {sections.map((section) => {
                const alignClass = getTextAlignClass(section.align);

                if (section.type === "text") {
                    return (
                        <section key={section.id} className="py-12 px-6" style={{ backgroundColor: section.backgroundColor }}>
                            <div className={`max-w-4xl mx-auto flex flex-col ${alignClass}`}>
                                <h2 className="text-2xl font-bold mb-4" style={{ color: section.titleColor }}>{section.title || "제목 없음"}</h2>
                                <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: section.descriptionColor }}>{section.description}</p>
                            </div>
                        </section>
                    );
                }

                if (section.type === "imageText") {
                    const isLeft = section.imagePosition === "left";
                    const isTop = section.imagePosition === "top";

                    return (
                        <section key={section.id} className="py-12 px-6" style={{ backgroundColor: section.backgroundColor }}>
                            <div className={`max-w-4xl mx-auto flex gap-6 ${isTop ? "flex-col" : isLeft ? "flex-col md:flex-row" : "flex-col md:flex-row-reverse"} items-center`}>
                                <div className="flex-1 w-full aspect-video relative rounded-2xl overflow-hidden bg-gray-100">
                                    {section.imageUrl ? <Image src={section.imageUrl} alt="이미지" fill className="object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon size={40} /></div>}
                                </div>
                                <div className={`flex-1 flex flex-col ${alignClass}`}>
                                    <h2 className="text-2xl font-bold mb-4" style={{ color: section.titleColor }}>{section.title}</h2>
                                    <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: section.descriptionColor }}>{section.description}</p>
                                </div>
                            </div>
                        </section>
                    );
                }

                if (section.type === "cta") {
                    return (
                        <section key={section.id} className="py-12 px-6" style={{ backgroundColor: section.backgroundColor }}>
                            <div className={`max-w-4xl mx-auto flex flex-col ${alignClass} gap-6`}>
                                <h2 className="text-2xl font-bold" style={{ color: section.titleColor }}>{section.title}</h2>
                                <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: section.descriptionColor }}>
                                    {section.description}
                                </p>
                                <button
                                    className="px-8 py-3 rounded-full font-bold transition-transform hover:scale-105"
                                    style={{ backgroundColor: section.buttonColor, color: section.buttonTextColor }}
                                >
                                    {section.buttonText}
                                </button>
                            </div>
                        </section>
                    );
                }

                if (section.type === "titleImage") {
                    return (
                        <section key={section.id} className="relative py-24 px-6 overflow-hidden min-h-[300px] flex items-center">
                            {section.imageUrl && <Image src={section.imageUrl} alt="배경" fill className="object-cover z-0" />}
                            <div className="absolute inset-0 bg-black/40 z-0" />
                            <div className={`relative z-10 max-w-4xl mx-auto w-full flex flex-col ${alignClass}`} >
                                <h2 className="text-3xl font-black mb-4" style={{ color: section.titleColor }}>{section.title}</h2>
                                <p className="text-sm font-medium leading-relaxed whitespace-pre-line" style={{ color: section.descriptionColor }}>{section.description}</p>
                            </div>
                        </section>
                    );
                }

                if (section.type === "cardGrid") {
                    return (
                        <section
                            key={section.id}
                            className="py-12 px-6"
                            style={{ backgroundColor: section.backgroundColor }}
                        >
                            <div className={`max-w-4xl mx-auto flex flex-col ${alignClass} mb-10`}>
                                <h2 className="text-2xl font-bold mb-4" style={{ color: section.titleColor }}>{section.title}/</h2>
                                <p className="text-sm opacity-80" style={{ color: section.descriptionColor }}>{section.description}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 max-w-4xl mx-auto">
                                {section.items.map((item) => (
                                    <div key={item.id} className={`p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center`} style={{ backgroundColor: item.cardBgColor }}>
                                        <div className="w-12 h-12 relative mb-3 rounded-lg overflow-hidden">
                                            {item.iconUrl ? <Image src={item.iconUrl} alt="아이콘" fill className="object-cover" /> : <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300"><ImageIcon size={20} /></div>}
                                        </div>
                                        <h3 className="font-bold text-sm mb-2" style={{ color: item.titleColor }}>{item.title}</h3>
                                        <p className="text-[10px] leading-relaxed" style={{ color: item.descriptionColor }}>{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    );
                }
                return null;
            })}
        </div>
    );
}

export default AdminContentsPage;