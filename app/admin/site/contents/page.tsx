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
type ContentCategory = "UNBOX소개" | "설립목적" | "주요사업" | "철학가치관";
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
    name: string;
    animation: AnimationType;
};

type TextSection = BaseSection & {
    type: "text";
    eyebrow: string;
    title: string;
    description: string;
    titleColor: string;
    descriptionColor: string;
    align: TextAlign;
    background: "white" | "gray" | "dark";
};

type ImageTextSection = BaseSection & {
    type: "imageText";
    title: string;
    description: string;
    titleColor: string;
    descriptionColor: string;
    imageUrl: string;
    imageFile?: File | null;
    imageName?: string;
    layout: "left" | "right";
    buttonText: string;
    buttonLink: string;
    buttonTextColor: string;
    buttonBgColor: string;
    align: TextAlign;
    background: "white" | "gray";
};

type CtaSection = BaseSection & {
    type: "cta";
    title: string;
    description: string;
    titleColor: string;
    descriptionColor: string;
    buttonText: string;
    buttonLink: string;
    buttonTextColor: string;
    buttonBgColor: string;
    align: TextAlign;
    theme: "orange" | "dark";
};
type TitleImageSection = BaseSection & {
    type: "titleImage";
    title: string;
    titleColor: string;
    align: TextAlign;
    imageUrl: string;
    imageFile?: File | null;
    imageName?: string;
    background: "white" | "gray" | "dark";
};
type CardGridSection = BaseSection & {
    type: "cardGrid";
    eyebrow: string;
    title: string;
    description: string;
    titleColor: string;
    descriptionColor: string;
    align: TextAlign;
    background: "white" | "gray" | "dark";

    pcColumns: number;
    tabletColumns: number;
    mobileColumns: number;

    rowGap: number;
    columnGap: number;

    items: CardGridItem[];
};
type ContentSection =
    | TextSection
    | ImageTextSection
    | CtaSection
    | TitleImageSection
    | CardGridSection;
type CategoryState = Record<ContentCategory, ContentSection[]>;

const CATEGORY_OPTIONS: ContentCategory[] = [
    "UNBOX소개",
    "설립목적",
    "주요사업",
    "철학가치관",
];

const createTextSection = (id: number): TextSection => ({
    id,
    type: "text",
    name: "텍스트 섹션",
    animation: "fadeUp",
    eyebrow: "SECTION",
    title: "제목을 입력하세요",
    description: "설명을 입력하세요.",
    titleColor: "#111827",
    descriptionColor: "#4B5563",
    align: "left",
    background: "white",
});

const createImageTextSection = (id: number): ImageTextSection => ({
    id,
    type: "imageText",
    name: "이미지 + 텍스트",
    animation: "fadeUp",
    title: "이미지 섹션 제목",
    description: "이미지와 함께 보여줄 설명을 입력하세요.",
    titleColor: "#111827",
    descriptionColor: "#4B5563",
    imageUrl: "",
    layout: "left",
    buttonText: "자세히 보기",
    buttonLink: "/",
    buttonTextColor: "#FFFFFF",
    buttonBgColor: "#F97316",
    align: "left",
    background: "gray",

    imageFile: null,
    imageName: "",
});

const createCtaSection = (id: number): CtaSection => ({
    id,
    type: "cta",
    name: "버튼 유도 섹션",
    animation: "zoomIn",
    title: "함께할 준비가 되셨나요?",
    description: "사용자가 자연스럽게 다음 행동을 할 수 있도록 유도하는 섹션입니다.",
    titleColor: "#FFFFFF",
    descriptionColor: "#F3F4F6",
    buttonText: "문의하기",
    buttonLink: "/contact",
    buttonTextColor: "#111827",
    buttonBgColor: "#FFFFFF",
    align: "center",
    theme: "orange",
});
const createTitleImageSection = (id: number): TitleImageSection => ({
    id,
    type: "titleImage",
    name: "제목 + 이미지 섹션",
    animation: "fadeUp",
    title: "제목을 입력하세요",
    titleColor: "#111827",
    align: "center",
    imageUrl: "",
    imageFile: null,
    imageName: "",
    background: "white",
});
const createCardGridSection = (id: number): CardGridSection => ({
    id,
    type: "cardGrid",
    name: "카드 그리드 섹션",
    animation: "fadeUp",
    eyebrow: "Core Values",
    title: "우리가 중요하게 생각하는 4가지",
    description: "설명을 입력하세요.",
    titleColor: "#1D4ED8",
    descriptionColor: "#475569",
    align: "left",
    background: "white",

    pcColumns: 4,
    tabletColumns: 2,
    mobileColumns: 1,

    rowGap: 24,
    columnGap: 24,

    items: [
        {
            id: 1,
            title: "정확성",
            description: "설명을 입력하세요.",
            iconUrl: "",
            titleColor: "#0F172A",
            descriptionColor: "#475569",
            cardBgColor: "#FFFFFF",
        },
        {
            id: 2,
            title: "현실성",
            description: "설명을 입력하세요.",
            iconUrl: "",
            titleColor: "#0F172A",
            descriptionColor: "#475569",
            cardBgColor: "#FFFFFF",
        },
    ],
});
const createInitialState = (): CategoryState => ({
    UNBOX소개: [
        {
            ...createTextSection(1),
            name: "소개 상단 문구",
            eyebrow: "UNBOX",
            title: "함께 배우고 함께 나누는 UNBOX",
            description:
                "UNBOX는 AI 활용 수업, 코딩 재능기부, 플로깅 활동을 통해 지역사회와 연결되는 가치를 만들어 갑니다.",
            align: "center",
            background: "white",
        },
        {
            ...createImageTextSection(2),
            name: "소개 이미지 섹션",
            title: "배움과 실천이 연결되는 공간",
            description:
                "단순한 교육을 넘어 실제 삶에 도움이 되는 디지털 활용과 사회참여를 함께 고민합니다.",
            layout: "left",
            background: "gray",
        },
    ],
    설립목적: [
        {
            ...createTextSection(3),
            name: "설립목적 핵심",
            eyebrow: "MISSION",
            title: "기술을 더 가깝게, 배움을 더 따뜻하게",
            description:
                "누구나 AI와 디지털 도구를 이해하고 활용할 수 있도록 돕고, 배움을 지역사회 공헌으로 확장하는 것이 목적입니다.",
            align: "center",
            background: "gray",
        },
    ],
    주요사업: [
        {
            ...createImageTextSection(4),
            name: "주요사업 설명",
            title: "AI 활용 교육과 코딩 재능기부",
            description:
                "실생활에 바로 적용할 수 있는 AI 활용 수업과 디지털 교육을 진행하며, 재능기부 활동을 통해 지역사회와 연결됩니다.",
            layout: "right",
            background: "white",
        },
        {
            ...createCtaSection(5),
            name: "주요사업 CTA",
            title: "UNBOX의 활동을 더 알고 싶다면",
            description: "주요사업과 활동 내용을 더 자세히 소개하는 페이지로 연결할 수 있습니다.",
            buttonText: "자세히 보기",
            buttonLink: "/business",
            theme: "dark",
        },
    ],
    철학가치관: [
        {
            ...createTextSection(6),
            name: "철학가치관 문구",
            eyebrow: "VALUE",
            title: "함께 비우고, 함께 채우는 성장",
            description:
                "기술은 사람을 위한 것이어야 하며, 배움은 개인의 성장을 넘어 공동체의 변화를 만드는 힘이 된다고 믿습니다.",
            align: "center",
            background: "dark",
            titleColor: "#FFFFFF",
            descriptionColor: "#E5E7EB",
        },
    ],
});

const inputClass =
    "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

const textareaClass =
    "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

const selectClass =
    "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

const getSectionLabel = (section: ContentSection) => {
    return section.title || section.name;
};

const animationOptions: { value: AnimationType; label: string }[] = [
    { value: "none", label: "없음" },
    { value: "fadeUp", label: "위로 나타남" },
    { value: "fadeIn", label: "서서히 나타남" },
    { value: "slideLeft", label: "왼쪽에서 등장" },
    { value: "slideRight", label: "오른쪽에서 등장" },
    { value: "zoomIn", label: "확대 등장" },
];

const animationVariantsMap: Record<AnimationType, Variants> = {
    none: {
        hidden: { opacity: 1, x: 0, y: 0, scale: 1 },
        show: { opacity: 1, x: 0, y: 0, scale: 1, transition: { duration: 0 } },
    },
    fadeUp: {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    },
    fadeIn: {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
    },
    slideLeft: {
        hidden: { opacity: 0, x: -40 },
        show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
    },
    slideRight: {
        hidden: { opacity: 0, x: 40 },
        show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
    },
    zoomIn: {
        hidden: { opacity: 0, scale: 0.94 },
        show: { opacity: 1, scale: 1, transition: { duration: 0.55, ease: "easeOut" } },
    },
};

const textAlignClassMap: Record<TextAlign, string> = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
};

const contentAlignClassMap: Record<TextAlign, string> = {
    left: "items-start",
    center: "items-center",
    right: "items-end",
};

const AdminContentsPage = () => {
    const { data: siteContentsData, isLoading } = useSiteContents();
    const initializedRef = useRef(false);
    const { mutateAsync: saveSiteContent, isPending: isSaving } = useSaveSiteContent();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<ContentCategory>("UNBOX소개");
    const [contents, setContents] = useState<CategoryState>(createInitialState);
    const [selectedSectionId, setSelectedSectionId] = useState<number | null>(1);
    const [nextId, setNextId] = useState(7);
    const [previewDevice, setPreviewDevice] = useState<PreviewDevice>("desktop");
    const [draggingId, setDraggingId] = useState<number | null>(null);

    const toggleSidebar = () => setSidebarOpen((prev) => !prev);
    const stripApiBaseUrl = (url: string | null) => {
        if (!url) return null;

        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        if (baseUrl && url.startsWith(baseUrl)) {
            return url.replace(baseUrl, "");
        }

        return url;
    };
    const currentSections = useMemo(() => {
        return contents[selectedCategory] ?? [];
    }, [contents, selectedCategory]);

    const selectedSection = useMemo(() => {
        return currentSections.find((section) => section.id === selectedSectionId) ?? null;
    }, [currentSections, selectedSectionId]);

    useEffect(() => {
        if (!currentSections.length) {
            setSelectedSectionId(null);
            return;
        }
        const exists = currentSections.some((section) => section.id === selectedSectionId);
        if (!exists) setSelectedSectionId(currentSections[0].id);
    }, [currentSections, selectedSectionId]);

    const updateSelectedSection = (updater: (prev: ContentSection) => ContentSection) => {
        if (!selectedSectionId) return;

        setContents((prev) => ({
            ...prev,
            [selectedCategory]: prev[selectedCategory].map((section) =>
                section.id === selectedSectionId ? updater(section) : section
            ),
        }));
    };

    const handleCategoryChange = (category: ContentCategory) => {
        setSelectedCategory(category);
    };

    const handleAddSection = (type: SectionType) => {
        const id = nextId;
        setNextId((prev) => prev + 1);

        let section: ContentSection;
        if (type === "text") section = createTextSection(id);
        else if (type === "imageText") section = createImageTextSection(id);
        else if (type === "cta") section = createCtaSection(id);
        else if (type === "titleImage") section = createTitleImageSection(id);
        else section = createCardGridSection(id);

        setContents((prev) => ({
            ...prev,
            [selectedCategory]: [...prev[selectedCategory], section],
        }));

        setSelectedSectionId(id);
    };

    const handleDeleteSection = (sectionId: number) => {
        const filtered = currentSections.filter((section) => section.id !== sectionId);

        setContents((prev) => ({
            ...prev,
            [selectedCategory]: filtered,
        }));

        if (selectedSectionId === sectionId) {
            setSelectedSectionId(filtered[0]?.id ?? null);
        }
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        if (!file || !selectedSection) return;

        const previewUrl = URL.createObjectURL(file);

        updateSelectedSection((prev) => {
            if (prev.type === "imageText") {
                return {
                    ...prev,
                    imageUrl: previewUrl,
                    imageFile: file,
                    imageName: file.name,
                };
            }

            if (prev.type === "titleImage") {
                return {
                    ...prev,
                    imageUrl: previewUrl,
                    imageFile: file,
                    imageName: file.name,
                };
            }

            return prev;
        });
    };

    const moveSection = (dragId: number, targetId: number) => {
        if (dragId === targetId) return;

        const list = [...currentSections];
        const dragIndex = list.findIndex((item) => item.id === dragId);
        const targetIndex = list.findIndex((item) => item.id === targetId);

        if (dragIndex === -1 || targetIndex === -1) return;

        const [moved] = list.splice(dragIndex, 1);
        list.splice(targetIndex, 0, moved);

        setContents((prev) => ({
            ...prev,
            [selectedCategory]: list,
        }));
    };

    const handleDragStart = (sectionId: number) => {
        setDraggingId(sectionId);
    };
    const handleCardIconChange = (
        e: ChangeEvent<HTMLInputElement>,
        itemId: number
    ) => {
        const file = e.target.files?.[0] ?? null;
        if (!file || !selectedSection || selectedSection.type !== "cardGrid") return;

        const previewUrl = URL.createObjectURL(file);

        updateSelectedSection((prev) => {
            if (prev.type !== "cardGrid") return prev;

            return {
                ...prev,
                items: prev.items.map((item) =>
                    item.id === itemId
                        ? {
                            ...item,
                            iconUrl: previewUrl,
                            iconFile: file,
                            iconName: file.name,
                        }
                        : item
                ),
            };
        });
    };
    const addCardItem = () => {
        if (!selectedSection || selectedSection.type !== "cardGrid") return;

        const newItem: CardGridItem = {
            id: Date.now(),
            title: "새 카드 제목",
            description: "새 카드 설명",
            iconUrl: "",
            iconFile: null,
            iconName: "",
            titleColor: "#0F172A",
            descriptionColor: "#475569",
            cardBgColor: "#FFFFFF",
        };

        updateSelectedSection((prev) => {
            if (prev.type !== "cardGrid") return prev;
            return {
                ...prev,
                items: [...prev.items, newItem],
            };
        });
    };
    const removeCardItem = (itemId: number) => {
        updateSelectedSection((prev) => {
            if (prev.type !== "cardGrid") return prev;
            return {
                ...prev,
                items: prev.items.filter((item) => item.id !== itemId),
            };
        });
    };
    const handleDrop = (e: DragEvent<HTMLButtonElement>, targetId: number) => {
        e.preventDefault();
        if (draggingId == null) return;
        moveSection(draggingId, targetId);
        setDraggingId(null);
    };

    const handleDragOver = (e: DragEvent<HTMLButtonElement>) => {
        e.preventDefault();
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const payload: SaveSiteContentPayload = {
                category: selectedCategory,
                sections: contents[selectedCategory].map((section) => {
                    if (section.type === "text") {
                        return {
                            type: section.type,
                            name: section.name,
                            animation: section.animation,
                            eyebrow: section.eyebrow || null,
                            title: section.title || null,
                            description: section.description || null,
                            titleColor: section.titleColor || null,
                            descriptionColor: section.descriptionColor || null,
                            align: section.align || null,
                            background: section.background || null,
                            items: [],
                        };
                    }

                    if (section.type === "imageText") {

                        return {
                            type: section.type,
                            name: section.name,
                            animation: section.animation,
                            title: section.title || null,
                            description: section.description || null,
                            titleColor: section.titleColor || null,
                            descriptionColor: section.descriptionColor || null,
                            align: section.align || null,
                            background: section.background || null,
                            existingImageUrl:
                                section.imageUrl && !section.imageUrl.startsWith("blob:")
                                    ? stripApiBaseUrl(section.imageUrl)
                                    : null,
                            existingImageName:
                                section.imageUrl && !section.imageUrl.startsWith("blob:")
                                    ? "existing-image"
                                    : null,
                            imageFile: section.imageFile ?? null,
                            layout: section.layout || null,
                            buttonText: section.buttonText || null,
                            buttonLink: section.buttonLink || null,
                            buttonTextColor: section.buttonTextColor || null,
                            buttonBgColor: section.buttonBgColor || null,
                            items: [],
                        };
                    }

                    if (section.type === "cta") {
                        return {
                            type: section.type,
                            name: section.name,
                            animation: section.animation,
                            title: section.title || null,
                            description: section.description || null,
                            titleColor: section.titleColor || null,
                            descriptionColor: section.descriptionColor || null,
                            align: section.align || null,
                            buttonText: section.buttonText || null,
                            buttonLink: section.buttonLink || null,
                            buttonTextColor: section.buttonTextColor || null,
                            buttonBgColor: section.buttonBgColor || null,
                            theme: section.theme || null,
                            items: [],
                        };
                    }

                    if (section.type === "titleImage") {
                        return {
                            type: section.type,
                            name: section.name,
                            animation: section.animation,
                            title: section.title || null,
                            titleColor: section.titleColor || null,
                            align: section.align || null,
                            background: section.background || null,
                            existingImageUrl:
                                section.imageUrl && !section.imageUrl.startsWith("blob:")
                                    ? stripApiBaseUrl(section.imageUrl)
                                    : null,
                            existingImageName:
                                section.imageUrl && !section.imageUrl.startsWith("blob:")
                                    ? "existing-image"
                                    : null,
                            imageFile: section.imageFile ?? null,
                            items: [],
                        };
                    }

                    return {
                        type: section.type,
                        name: section.name,
                        animation: section.animation,
                        eyebrow: section.eyebrow || null,
                        title: section.title || null,
                        description: section.description || null,
                        titleColor: section.titleColor || null,
                        descriptionColor: section.descriptionColor || null,
                        align: section.align || null,
                        background: section.background || null,
                        pcColumns: Number(section.pcColumns),
                        tabletColumns: Number(section.tabletColumns),
                        mobileColumns: Number(section.mobileColumns),
                        rowGap: Number(section.rowGap),
                        columnGap: Number(section.columnGap),
                        items: section.items.map((item) => ({
                            title: item.title,
                            description: item.description || null,
                            existingIconUrl:
                                item.iconUrl && !item.iconUrl.startsWith("blob:")
                                    ? stripApiBaseUrl(item.iconUrl)
                                    : null,
                            existingIconName:
                                item.iconUrl && !item.iconUrl.startsWith("blob:")
                                    ? "existing-icon"
                                    : null,
                            iconFile: item.iconFile ?? null,
                            titleColor: item.titleColor || null,
                            descriptionColor: item.descriptionColor || null,
                            cardBgColor: item.cardBgColor || null,
                        })),
                    };
                }),
            };

            const result = await saveSiteContent(payload);

            if (result.success) {
                alert(result.message || "저장되었습니다.");
                return;
            }

            alert("저장에 실패했습니다.");
        } catch (error: any) {
            console.error(error);
            alert(error?.response?.data?.message || "저장 중 오류가 발생했습니다.");
        }
    };
    const mapServerDataToCategoryState = (pages: SiteContentPageItem[]): CategoryState => {
        const baseState = createInitialState();

        const mappedState: CategoryState = {
            UNBOX소개: [],
            설립목적: [],
            주요사업: [],
            철학가치관: [],
        };

        pages.forEach((page) => {
            mappedState[page.category] = page.sections.map((section) => {
                if (section.type === "text") {
                    return {
                        id: section.id,
                        type: "text",
                        name: section.name ?? "텍스트 섹션",
                        animation: section.animation ?? "fadeUp",
                        eyebrow: section.eyebrow ?? "",
                        title: section.title ?? "",
                        description: section.description ?? "",
                        titleColor: section.titleColor ?? "#111827",
                        descriptionColor: section.descriptionColor ?? "#4B5563",
                        align: (section.align ?? "left") as TextAlign,
                        background: (section.background ?? "white") as TextSection["background"],
                    };
                }

                if (section.type === "imageText") {
                    return {
                        id: section.id,
                        type: "imageText",
                        name: section.name ?? "이미지 + 텍스트",
                        animation: section.animation ?? "fadeUp",
                        title: section.title ?? "",
                        description: section.description ?? "",
                        titleColor: section.titleColor ?? "#111827",
                        descriptionColor: section.descriptionColor ?? "#4B5563",
                        imageUrl: section.imageUrl ?? "",
                        imageFile: null,
                        imageName: section.imageName ?? "",
                        layout: (section.layout ?? "left") as ImageTextSection["layout"],
                        buttonText: section.buttonText ?? "",
                        buttonLink: section.buttonLink ?? "",
                        buttonTextColor: section.buttonTextColor ?? "#FFFFFF",
                        buttonBgColor: section.buttonBgColor ?? "#F97316",
                        align: (section.align ?? "left") as TextAlign,
                        background: (section.background ?? "gray") as ImageTextSection["background"],
                    };
                }

                if (section.type === "cta") {
                    return {
                        id: section.id,
                        type: "cta",
                        name: section.name ?? "버튼 유도 섹션",
                        animation: section.animation ?? "zoomIn",
                        title: section.title ?? "",
                        description: section.description ?? "",
                        titleColor: section.titleColor ?? "#FFFFFF",
                        descriptionColor: section.descriptionColor ?? "#F3F4F6",
                        buttonText: section.buttonText ?? "",
                        buttonLink: section.buttonLink ?? "",
                        buttonTextColor: section.buttonTextColor ?? "#111827",
                        buttonBgColor: section.buttonBgColor ?? "#FFFFFF",
                        align: (section.align ?? "center") as TextAlign,
                        theme: (section.theme ?? "orange") as CtaSection["theme"],
                    };
                }

                if (section.type === "titleImage") {
                    return {
                        id: section.id,
                        type: "titleImage",
                        name: section.name ?? "제목 + 이미지 섹션",
                        animation: section.animation ?? "fadeUp",
                        title: section.title ?? "",
                        titleColor: section.titleColor ?? "#111827",
                        align: (section.align ?? "center") as TextAlign,
                        imageUrl: section.imageUrl ?? "",
                        imageFile: null,
                        imageName: section.imageName ?? "",
                        background: (section.background ?? "white") as TitleImageSection["background"],
                    };
                }

                return {
                    id: section.id,
                    type: "cardGrid",
                    name: section.name ?? "카드 그리드 섹션",
                    animation: section.animation ?? "fadeUp",
                    eyebrow: section.eyebrow ?? "",
                    title: section.title ?? "",
                    description: section.description ?? "",
                    titleColor: section.titleColor ?? "#1D4ED8",
                    descriptionColor: section.descriptionColor ?? "#475569",
                    align: (section.align ?? "left") as TextAlign,
                    background: (section.background ?? "white") as CardGridSection["background"],
                    pcColumns: section.pcColumns ?? 4,
                    tabletColumns: section.tabletColumns ?? 2,
                    mobileColumns: section.mobileColumns ?? 1,
                    rowGap: section.rowGap ?? 24,
                    columnGap: section.columnGap ?? 24,
                    items: (section.items ?? []).map((item) => ({
                        id: item.id,
                        title: item.title ?? "",
                        description: item.description ?? "",
                        iconUrl: item.iconUrl ?? "",
                        iconFile: null,
                        iconName: item.iconName ?? "",
                        titleColor: item.titleColor ?? "#0F172A",
                        descriptionColor: item.descriptionColor ?? "#475569",
                        cardBgColor: item.cardBgColor ?? "#FFFFFF",
                    })),
                };
            });
        });

        return {
            UNBOX소개: mappedState.UNBOX소개.length ? mappedState.UNBOX소개 : baseState.UNBOX소개,
            설립목적: mappedState.설립목적.length ? mappedState.설립목적 : baseState.설립목적,
            주요사업: mappedState.주요사업.length ? mappedState.주요사업 : baseState.주요사업,
            철학가치관: mappedState.철학가치관.length ? mappedState.철학가치관 : baseState.철학가치관,
        };
    };
    useEffect(() => {
        if (initializedRef.current) return;
        if (!siteContentsData?.success || !siteContentsData.data) return;

        const mapped = mapServerDataToCategoryState(siteContentsData.data);
        setContents(mapped);

        const allSectionIds = Object.values(mapped)
            .flat()
            .map((section) => section.id);

        const maxId = allSectionIds.length > 0 ? Math.max(...allSectionIds) : 0;

        setNextId(maxId + 1);
        setSelectedSectionId(mapped[selectedCategory]?.[0]?.id ?? null);
        initializedRef.current = true;
    }, [siteContentsData, selectedCategory]);
    const previewWidthClass =
        previewDevice === "desktop"
            ? "w-full max-w-6xl"
            : previewDevice === "tablet"
                ? "w-[820px] max-w-full"
                : "w-[390px] max-w-full";

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

                <main className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
                    {isLoading && (
                        <section className="rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-500 shadow-sm sm:p-6">
                            내용관리 데이터를 불러오는 중입니다...
                        </section>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6">


                        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
                            <div className="mb-4 border-b border-gray-100 pb-4">
                                <h2 className="text-lg font-semibold">카테고리 선택</h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    메인 배너를 제외한 소개 콘텐츠를 관리합니다.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
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
                        </section>

                        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[320px_minmax(420px,1fr)]">
                            {/* 왼쪽 */}
                            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                                <div className="border-b border-gray-100 p-4 sm:p-5">
                                    <h3 className="text-base font-semibold">섹션 목록</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        드래그로 순서를 변경하고, 원하는 섹션을 추가하세요.
                                    </p>
                                </div>

                                <div className="space-y-4 p-4 sm:p-5">
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleAddSection("text")}
                                            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                        >
                                            + 텍스트
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleAddSection("imageText")}
                                            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                        >
                                            + 이미지+텍스트
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleAddSection("cta")}
                                            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                        >
                                            + 버튼유도
                                        </button>
                                        <button type="button" onClick={() => handleAddSection("titleImage")}
                                            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"

                                        >
                                            + 제목+이미지
                                        </button>

                                        <button type="button" onClick={() => handleAddSection("cardGrid")}
                                            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"

                                        >
                                            + 카드그리드
                                        </button>
                                    </div>

                                    <div className="space-y-2">
                                        {currentSections.length === 0 ? (
                                            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
                                                섹션이 없습니다.
                                            </div>
                                        ) : (
                                            currentSections.map((section, index) => {
                                                const active = section.id === selectedSectionId;

                                                return (
                                                    <button
                                                        key={section.id}
                                                        type="button"
                                                        draggable
                                                        onDragStart={() => handleDragStart(section.id)}
                                                        onDragOver={handleDragOver}
                                                        onDrop={(e) => handleDrop(e, section.id)}
                                                        onClick={() => setSelectedSectionId(section.id)}
                                                        className={[
                                                            "w-full rounded-xl border px-4 py-3 text-left transition",
                                                            active
                                                                ? "border-orange-500 bg-orange-50"
                                                                : "border-gray-200 bg-white hover:bg-gray-50",
                                                        ].join(" ")}
                                                    >
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div className="min-w-0">
                                                                <p className="text-xs font-semibold text-gray-400">
                                                                    {index + 1}. {section.type}
                                                                </p>
                                                                <p className="truncate text-sm font-semibold text-gray-900">
                                                                    {getSectionLabel(section)}
                                                                </p>
                                                                <p className="mt-1 text-xs text-gray-500">{section.name}</p>
                                                            </div>
                                                            <span className="shrink-0 text-xs text-gray-400">⋮⋮</span>
                                                        </div>
                                                    </button>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* 가운데 */}
                            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                                <div className="border-b border-gray-100 p-4 sm:p-5">
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <h3 className="text-base font-semibold">섹션 설정</h3>
                                            <p className="mt-1 text-sm text-gray-500">
                                                제목, 설명, 색상, 정렬, 애니메이션을 설정합니다.
                                            </p>
                                        </div>

                                        {selectedSection && (
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteSection(selectedSection.id)}
                                                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                                            >
                                                삭제
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="p-4 sm:p-5">
                                    {!selectedSection ? (
                                        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-10 text-center text-sm text-gray-500">
                                            왼쪽에서 섹션을 선택해 주세요.
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <Field label="관리용 섹션 이름">
                                                <input
                                                    type="text"
                                                    value={selectedSection.name}
                                                    onChange={(e) =>
                                                        updateSelectedSection((prev) => ({
                                                            ...prev,
                                                            name: e.target.value,
                                                        }))
                                                    }
                                                    className={inputClass}
                                                />
                                            </Field>

                                            <Field label="애니메이션 효과">
                                                <select
                                                    value={selectedSection.animation}
                                                    onChange={(e) =>
                                                        updateSelectedSection((prev) => ({
                                                            ...prev,
                                                            animation: e.target.value as AnimationType,
                                                        }))
                                                    }
                                                    className={selectClass}
                                                >
                                                    {animationOptions.map((option) => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </Field>

                                            {selectedSection.type === "text" && (
                                                <>
                                                    <Field label="상단 소제목">
                                                        <input
                                                            type="text"
                                                            value={selectedSection.eyebrow}
                                                            onChange={(e) =>
                                                                updateSelectedSection((prev) => {
                                                                    if (prev.type !== "text") return prev;
                                                                    return { ...prev, eyebrow: e.target.value };
                                                                })
                                                            }
                                                            className={inputClass}
                                                        />
                                                    </Field>

                                                    <Field label="제목">
                                                        <input
                                                            type="text"
                                                            value={selectedSection.title}
                                                            onChange={(e) =>
                                                                updateSelectedSection((prev) => {
                                                                    if (prev.type !== "text") return prev;
                                                                    return { ...prev, title: e.target.value };
                                                                })
                                                            }
                                                            className={inputClass}
                                                        />
                                                    </Field>

                                                    <Field label="설명">
                                                        <textarea
                                                            rows={8}
                                                            value={selectedSection.description}
                                                            onChange={(e) =>
                                                                updateSelectedSection((prev) => {
                                                                    if (prev.type !== "text") return prev;
                                                                    return { ...prev, description: e.target.value };
                                                                })
                                                            }
                                                            className={textareaClass}
                                                        />
                                                    </Field>

                                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                        <Field label="제목 색상">
                                                            <input
                                                                type="color"
                                                                value={selectedSection.titleColor}
                                                                onChange={(e) =>
                                                                    updateSelectedSection((prev) => {
                                                                        if (prev.type !== "text") return prev;
                                                                        return { ...prev, titleColor: e.target.value };
                                                                    })
                                                                }
                                                                className="h-12 w-full cursor-pointer rounded-xl border border-gray-300 bg-white p-2"
                                                            />
                                                        </Field>

                                                        <Field label="설명 색상">
                                                            <input
                                                                type="color"
                                                                value={selectedSection.descriptionColor}
                                                                onChange={(e) =>
                                                                    updateSelectedSection((prev) => {
                                                                        if (prev.type !== "text") return prev;
                                                                        return { ...prev, descriptionColor: e.target.value };
                                                                    })
                                                                }
                                                                className="h-12 w-full cursor-pointer rounded-xl border border-gray-300 bg-white p-2"
                                                            />
                                                        </Field>
                                                    </div>

                                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                        <Field label="정렬">
                                                            <select
                                                                value={selectedSection.align}
                                                                onChange={(e) =>
                                                                    updateSelectedSection((prev) => {
                                                                        if (prev.type !== "text") return prev;
                                                                        return {
                                                                            ...prev,
                                                                            align: e.target.value as TextAlign,
                                                                        };
                                                                    })
                                                                }
                                                                className={selectClass}
                                                            >
                                                                <option value="left">좌측 정렬</option>
                                                                <option value="center">가운데 정렬</option>
                                                                <option value="right">우측 정렬</option>
                                                            </select>
                                                        </Field>

                                                        <Field label="배경">
                                                            <select
                                                                value={selectedSection.background}
                                                                onChange={(e) =>
                                                                    updateSelectedSection((prev) => {
                                                                        if (prev.type !== "text") return prev;
                                                                        return {
                                                                            ...prev,
                                                                            background: e.target.value as TextSection["background"],
                                                                        };
                                                                    })
                                                                }
                                                                className={selectClass}
                                                            >
                                                                <option value="white">화이트</option>
                                                                <option value="gray">연회색</option>
                                                                <option value="dark">다크</option>
                                                            </select>
                                                        </Field>
                                                    </div>
                                                </>
                                            )}

                                            {selectedSection.type === "imageText" && (
                                                <>
                                                    <Field label="제목">
                                                        <input
                                                            type="text"
                                                            value={selectedSection.title}
                                                            onChange={(e) =>
                                                                updateSelectedSection((prev) => {
                                                                    if (prev.type !== "imageText") return prev;
                                                                    return { ...prev, title: e.target.value };
                                                                })
                                                            }
                                                            className={inputClass}
                                                        />
                                                    </Field>

                                                    <Field label="설명">
                                                        <textarea
                                                            rows={7}
                                                            value={selectedSection.description}
                                                            onChange={(e) =>
                                                                updateSelectedSection((prev) => {
                                                                    if (prev.type !== "imageText") return prev;
                                                                    return { ...prev, description: e.target.value };
                                                                })
                                                            }
                                                            className={textareaClass}
                                                        />
                                                    </Field>

                                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                        <Field label="제목 색상">
                                                            <input
                                                                type="color"
                                                                value={selectedSection.titleColor}
                                                                onChange={(e) =>
                                                                    updateSelectedSection((prev) => {
                                                                        if (prev.type !== "imageText") return prev;
                                                                        return { ...prev, titleColor: e.target.value };
                                                                    })
                                                                }
                                                                className="h-12 w-full cursor-pointer rounded-xl border border-gray-300 bg-white p-2"
                                                            />
                                                        </Field>

                                                        <Field label="설명 색상">
                                                            <input
                                                                type="color"
                                                                value={selectedSection.descriptionColor}
                                                                onChange={(e) =>
                                                                    updateSelectedSection((prev) => {
                                                                        if (prev.type !== "imageText") return prev;
                                                                        return { ...prev, descriptionColor: e.target.value };
                                                                    })
                                                                }
                                                                className="h-12 w-full cursor-pointer rounded-xl border border-gray-300 bg-white p-2"
                                                            />
                                                        </Field>
                                                    </div>

                                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                        <Field label="버튼 배경색">
                                                            <input
                                                                type="color"
                                                                value={selectedSection.buttonBgColor}
                                                                onChange={(e) =>
                                                                    updateSelectedSection((prev) => {
                                                                        if (prev.type !== "imageText") return prev;
                                                                        return { ...prev, buttonBgColor: e.target.value };
                                                                    })
                                                                }
                                                                className="h-12 w-full cursor-pointer rounded-xl border border-gray-300 bg-white p-2"
                                                            />
                                                        </Field>

                                                        <Field label="버튼 글자색">
                                                            <input
                                                                type="color"
                                                                value={selectedSection.buttonTextColor}
                                                                onChange={(e) =>
                                                                    updateSelectedSection((prev) => {
                                                                        if (prev.type !== "imageText") return prev;
                                                                        return { ...prev, buttonTextColor: e.target.value };
                                                                    })
                                                                }
                                                                className="h-12 w-full cursor-pointer rounded-xl border border-gray-300 bg-white p-2"
                                                            />
                                                        </Field>
                                                    </div>

                                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                        <Field label="이미지 위치">
                                                            <select
                                                                value={selectedSection.layout}
                                                                onChange={(e) =>
                                                                    updateSelectedSection((prev) => {
                                                                        if (prev.type !== "imageText") return prev;
                                                                        return {
                                                                            ...prev,
                                                                            layout: e.target.value as ImageTextSection["layout"],
                                                                        };
                                                                    })
                                                                }
                                                                className={selectClass}
                                                            >
                                                                <option value="left">왼쪽 이미지</option>
                                                                <option value="right">오른쪽 이미지</option>
                                                            </select>
                                                        </Field>

                                                        <Field label="정렬">
                                                            <select
                                                                value={selectedSection.align}
                                                                onChange={(e) =>
                                                                    updateSelectedSection((prev) => {
                                                                        if (prev.type !== "imageText") return prev;
                                                                        return {
                                                                            ...prev,
                                                                            align: e.target.value as TextAlign,
                                                                        };
                                                                    })
                                                                }
                                                                className={selectClass}
                                                            >
                                                                <option value="left">좌측 정렬</option>
                                                                <option value="center">가운데 정렬</option>
                                                                <option value="right">우측 정렬</option>
                                                            </select>
                                                        </Field>
                                                    </div>

                                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                        <Field label="버튼 문구">
                                                            <input
                                                                type="text"
                                                                value={selectedSection.buttonText}
                                                                onChange={(e) =>
                                                                    updateSelectedSection((prev) => {
                                                                        if (prev.type !== "imageText") return prev;
                                                                        return { ...prev, buttonText: e.target.value };
                                                                    })
                                                                }
                                                                className={inputClass}
                                                            />
                                                        </Field>

                                                        <Field label="버튼 링크">
                                                            <input
                                                                type="text"
                                                                value={selectedSection.buttonLink}
                                                                onChange={(e) =>
                                                                    updateSelectedSection((prev) => {
                                                                        if (prev.type !== "imageText") return prev;
                                                                        return { ...prev, buttonLink: e.target.value };
                                                                    })
                                                                }
                                                                className={inputClass}
                                                            />
                                                        </Field>
                                                    </div>

                                                    <Field label="배경">
                                                        <select
                                                            value={selectedSection.background}
                                                            onChange={(e) =>
                                                                updateSelectedSection((prev) => {
                                                                    if (prev.type !== "imageText") return prev;
                                                                    return {
                                                                        ...prev,
                                                                        background: e.target.value as ImageTextSection["background"],
                                                                    };
                                                                })
                                                            }
                                                            className={selectClass}
                                                        >
                                                            <option value="white">화이트</option>
                                                            <option value="gray">연회색</option>
                                                        </select>
                                                    </Field>

                                                    <Field label="이미지 업로드">
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleImageChange}
                                                            className="block w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 file:mr-3 file:rounded-lg file:border-0 file:bg-orange-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-orange-600 hover:file:bg-orange-100"
                                                        />
                                                    </Field>

                                                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                                                        <p className="mb-3 text-sm font-medium text-gray-700">이미지 미리보기</p>
                                                        <div className="relative h-56 overflow-hidden rounded-xl bg-white">
                                                            {selectedSection.imageUrl ? (
                                                                <Image
                                                                    src={selectedSection.imageUrl}
                                                                    alt="preview"
                                                                    fill
                                                                    unoptimized
                                                                    className="object-cover"
                                                                />
                                                            ) : (
                                                                <div className="flex h-full items-center justify-center text-sm text-gray-400">
                                                                    업로드된 이미지가 없습니다
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </>
                                            )}

                                            {selectedSection.type === "cta" && (
                                                <>
                                                    <Field label="제목">
                                                        <input
                                                            type="text"
                                                            value={selectedSection.title}
                                                            onChange={(e) =>
                                                                updateSelectedSection((prev) => {
                                                                    if (prev.type !== "cta") return prev;
                                                                    return { ...prev, title: e.target.value };
                                                                })
                                                            }
                                                            className={inputClass}
                                                        />
                                                    </Field>

                                                    <Field label="설명">
                                                        <textarea
                                                            rows={6}
                                                            value={selectedSection.description}
                                                            onChange={(e) =>
                                                                updateSelectedSection((prev) => {
                                                                    if (prev.type !== "cta") return prev;
                                                                    return { ...prev, description: e.target.value };
                                                                })
                                                            }
                                                            className={textareaClass}
                                                        />
                                                    </Field>

                                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                        <Field label="제목 색상">
                                                            <input
                                                                type="color"
                                                                value={selectedSection.titleColor}
                                                                onChange={(e) =>
                                                                    updateSelectedSection((prev) => {
                                                                        if (prev.type !== "cta") return prev;
                                                                        return { ...prev, titleColor: e.target.value };
                                                                    })
                                                                }
                                                                className="h-12 w-full cursor-pointer rounded-xl border border-gray-300 bg-white p-2"
                                                            />
                                                        </Field>

                                                        <Field label="설명 색상">
                                                            <input
                                                                type="color"
                                                                value={selectedSection.descriptionColor}
                                                                onChange={(e) =>
                                                                    updateSelectedSection((prev) => {
                                                                        if (prev.type !== "cta") return prev;
                                                                        return { ...prev, descriptionColor: e.target.value };
                                                                    })
                                                                }
                                                                className="h-12 w-full cursor-pointer rounded-xl border border-gray-300 bg-white p-2"
                                                            />
                                                        </Field>
                                                    </div>

                                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                        <Field label="버튼 배경색">
                                                            <input
                                                                type="color"
                                                                value={selectedSection.buttonBgColor}
                                                                onChange={(e) =>
                                                                    updateSelectedSection((prev) => {
                                                                        if (prev.type !== "cta") return prev;
                                                                        return { ...prev, buttonBgColor: e.target.value };
                                                                    })
                                                                }
                                                                className="h-12 w-full cursor-pointer rounded-xl border border-gray-300 bg-white p-2"
                                                            />
                                                        </Field>

                                                        <Field label="버튼 글자색">
                                                            <input
                                                                type="color"
                                                                value={selectedSection.buttonTextColor}
                                                                onChange={(e) =>
                                                                    updateSelectedSection((prev) => {
                                                                        if (prev.type !== "cta") return prev;
                                                                        return { ...prev, buttonTextColor: e.target.value };
                                                                    })
                                                                }
                                                                className="h-12 w-full cursor-pointer rounded-xl border border-gray-300 bg-white p-2"
                                                            />
                                                        </Field>
                                                    </div>

                                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                        <Field label="버튼 문구">
                                                            <input
                                                                type="text"
                                                                value={selectedSection.buttonText}
                                                                onChange={(e) =>
                                                                    updateSelectedSection((prev) => {
                                                                        if (prev.type !== "cta") return prev;
                                                                        return { ...prev, buttonText: e.target.value };
                                                                    })
                                                                }
                                                                className={inputClass}
                                                            />
                                                        </Field>

                                                        <Field label="버튼 링크">
                                                            <input
                                                                type="text"
                                                                value={selectedSection.buttonLink}
                                                                onChange={(e) =>
                                                                    updateSelectedSection((prev) => {
                                                                        if (prev.type !== "cta") return prev;
                                                                        return { ...prev, buttonLink: e.target.value };
                                                                    })
                                                                }
                                                                className={inputClass}
                                                            />
                                                        </Field>
                                                    </div>

                                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                        <Field label="정렬">
                                                            <select
                                                                value={selectedSection.align}
                                                                onChange={(e) =>
                                                                    updateSelectedSection((prev) => {
                                                                        if (prev.type !== "cta") return prev;
                                                                        return {
                                                                            ...prev,
                                                                            align: e.target.value as TextAlign,
                                                                        };
                                                                    })
                                                                }
                                                                className={selectClass}
                                                            >
                                                                <option value="left">좌측 정렬</option>
                                                                <option value="center">가운데 정렬</option>
                                                                <option value="right">우측 정렬</option>
                                                            </select>
                                                        </Field>

                                                        <Field label="테마">
                                                            <select
                                                                value={selectedSection.theme}
                                                                onChange={(e) =>
                                                                    updateSelectedSection((prev) => {
                                                                        if (prev.type !== "cta") return prev;
                                                                        return {
                                                                            ...prev,
                                                                            theme: e.target.value as CtaSection["theme"],
                                                                        };
                                                                    })
                                                                }
                                                                className={selectClass}
                                                            >
                                                                <option value="orange">오렌지</option>
                                                                <option value="dark">다크</option>
                                                            </select>
                                                        </Field>
                                                    </div>
                                                </>
                                            )}
                                            {selectedSection.type === "titleImage" && (
                                                <>
                                                    <Field label="제목">
                                                        <input
                                                            type="text"
                                                            value={selectedSection.title}
                                                            onChange={(e) =>
                                                                updateSelectedSection((prev) => {
                                                                    if (prev.type !== "titleImage") return prev;
                                                                    return { ...prev, title: e.target.value };
                                                                })
                                                            }
                                                            className={inputClass}
                                                        />
                                                    </Field>

                                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                        <Field label="제목 색상">
                                                            <input
                                                                type="color"
                                                                value={selectedSection.titleColor}
                                                                onChange={(e) =>
                                                                    updateSelectedSection((prev) => {
                                                                        if (prev.type !== "titleImage") return prev;
                                                                        return { ...prev, titleColor: e.target.value };
                                                                    })
                                                                }
                                                                className="h-12 w-full cursor-pointer rounded-xl border border-gray-300 bg-white p-2"
                                                            />
                                                        </Field>

                                                        <Field label="정렬">
                                                            <select
                                                                value={selectedSection.align}
                                                                onChange={(e) =>
                                                                    updateSelectedSection((prev) => {
                                                                        if (prev.type !== "titleImage") return prev;
                                                                        return { ...prev, align: e.target.value as TextAlign };
                                                                    })
                                                                }
                                                                className={selectClass}
                                                            >
                                                                <option value="left">좌측 정렬</option>
                                                                <option value="center">가운데 정렬</option>
                                                                <option value="right">우측 정렬</option>
                                                            </select>
                                                        </Field>
                                                    </div>

                                                    <Field label="이미지 업로드">
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleImageChange}
                                                            className="block w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm"
                                                        />
                                                    </Field>
                                                </>
                                            )}
                                            {selectedSection.type === "cardGrid" && (
                                                <>
                                                    <Field label="상단 소제목">
                                                        <input
                                                            type="text"
                                                            value={selectedSection.eyebrow}
                                                            onChange={(e) =>
                                                                updateSelectedSection((prev) => {
                                                                    if (prev.type !== "cardGrid") return prev;
                                                                    return { ...prev, eyebrow: e.target.value };
                                                                })
                                                            }
                                                            className={inputClass}
                                                        />
                                                    </Field>

                                                    <Field label="제목">
                                                        <input
                                                            type="text"
                                                            value={selectedSection.title}
                                                            onChange={(e) =>
                                                                updateSelectedSection((prev) => {
                                                                    if (prev.type !== "cardGrid") return prev;
                                                                    return { ...prev, title: e.target.value };
                                                                })
                                                            }
                                                            className={inputClass}
                                                        />
                                                    </Field>

                                                    <Field label="설명">
                                                        <textarea
                                                            rows={5}
                                                            value={selectedSection.description}
                                                            onChange={(e) =>
                                                                updateSelectedSection((prev) => {
                                                                    if (prev.type !== "cardGrid") return prev;
                                                                    return { ...prev, description: e.target.value };
                                                                })
                                                            }
                                                            className={textareaClass}
                                                        />
                                                    </Field>

                                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                        <Field label="제목 색상">
                                                            <input
                                                                type="color"
                                                                value={selectedSection.titleColor}
                                                                onChange={(e) =>
                                                                    updateSelectedSection((prev) => {
                                                                        if (prev.type !== "cardGrid") return prev;
                                                                        return { ...prev, titleColor: e.target.value };
                                                                    })
                                                                }
                                                                className="h-12 w-full rounded-xl border border-gray-300 bg-white p-2"
                                                            />
                                                        </Field>

                                                        <Field label="설명 색상">
                                                            <input
                                                                type="color"
                                                                value={selectedSection.descriptionColor}
                                                                onChange={(e) =>
                                                                    updateSelectedSection((prev) => {
                                                                        if (prev.type !== "cardGrid") return prev;
                                                                        return { ...prev, descriptionColor: e.target.value };
                                                                    })
                                                                }
                                                                className="h-12 w-full rounded-xl border border-gray-300 bg-white p-2"
                                                            />
                                                        </Field>
                                                    </div>

                                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                                        <Field label="PC 열 수">
                                                            <input
                                                                type="number"
                                                                min={1}
                                                                max={6}
                                                                value={selectedSection.pcColumns}
                                                                onChange={(e) =>
                                                                    updateSelectedSection((prev) => {
                                                                        if (prev.type !== "cardGrid") return prev;
                                                                        return { ...prev, pcColumns: Number(e.target.value) };
                                                                    })
                                                                }
                                                                className={inputClass}
                                                            />
                                                        </Field>

                                                        <Field label="태블릿 열 수">
                                                            <input
                                                                type="number"
                                                                min={1}
                                                                max={4}
                                                                value={selectedSection.tabletColumns}
                                                                onChange={(e) =>
                                                                    updateSelectedSection((prev) => {
                                                                        if (prev.type !== "cardGrid") return prev;
                                                                        return { ...prev, tabletColumns: Number(e.target.value) };
                                                                    })
                                                                }
                                                                className={inputClass}
                                                            />
                                                        </Field>

                                                        <Field label="모바일 열 수">
                                                            <input
                                                                type="number"
                                                                min={1}
                                                                max={2}
                                                                value={selectedSection.mobileColumns}
                                                                onChange={(e) =>
                                                                    updateSelectedSection((prev) => {
                                                                        if (prev.type !== "cardGrid") return prev;
                                                                        return { ...prev, mobileColumns: Number(e.target.value) };
                                                                    })
                                                                }
                                                                className={inputClass}
                                                            />
                                                        </Field>
                                                    </div>

                                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                        <Field label="카드 세로 간격(row gap)">
                                                            <input
                                                                type="number"
                                                                min={0}
                                                                max={80}
                                                                value={selectedSection.rowGap}
                                                                onChange={(e) =>
                                                                    updateSelectedSection((prev) => {
                                                                        if (prev.type !== "cardGrid") return prev;
                                                                        return { ...prev, rowGap: Number(e.target.value) };
                                                                    })
                                                                }
                                                                className={inputClass}
                                                            />
                                                        </Field>

                                                        <Field label="카드 가로 간격(column gap)">
                                                            <input
                                                                type="number"
                                                                min={0}
                                                                max={80}
                                                                value={selectedSection.columnGap}
                                                                onChange={(e) =>
                                                                    updateSelectedSection((prev) => {
                                                                        if (prev.type !== "cardGrid") return prev;
                                                                        return { ...prev, columnGap: Number(e.target.value) };
                                                                    })
                                                                }
                                                                className={inputClass}
                                                            />
                                                        </Field>
                                                    </div>

                                                    <div className="flex justify-end">
                                                        <button
                                                            type="button"
                                                            onClick={addCardItem}
                                                            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                                                        >
                                                            + 카드 추가
                                                        </button>
                                                    </div>

                                                    <div className="space-y-4">
                                                        {selectedSection.items.map((item, index) => (
                                                            <div key={item.id} className="rounded-2xl border border-gray-200 p-4 space-y-4">
                                                                <div className="flex items-center justify-between">
                                                                    <h4 className="text-sm font-semibold">카드 {index + 1}</h4>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeCardItem(item.id)}
                                                                        className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm text-red-600"
                                                                    >
                                                                        삭제
                                                                    </button>
                                                                </div>

                                                                <Field label="카드 제목">
                                                                    <input
                                                                        type="text"
                                                                        value={item.title}
                                                                        onChange={(e) =>
                                                                            updateSelectedSection((prev) => {
                                                                                if (prev.type !== "cardGrid") return prev;
                                                                                return {
                                                                                    ...prev,
                                                                                    items: prev.items.map((card) =>
                                                                                        card.id === item.id ? { ...card, title: e.target.value } : card
                                                                                    ),
                                                                                };
                                                                            })
                                                                        }
                                                                        className={inputClass}
                                                                    />
                                                                </Field>

                                                                <Field label="카드 설명">
                                                                    <textarea
                                                                        rows={4}
                                                                        value={item.description}
                                                                        onChange={(e) =>
                                                                            updateSelectedSection((prev) => {
                                                                                if (prev.type !== "cardGrid") return prev;
                                                                                return {
                                                                                    ...prev,
                                                                                    items: prev.items.map((card) =>
                                                                                        card.id === item.id ? { ...card, description: e.target.value } : card
                                                                                    ),
                                                                                };
                                                                            })
                                                                        }
                                                                        className={textareaClass}
                                                                    />
                                                                </Field>

                                                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                                                    <Field label="제목 색상">
                                                                        <input
                                                                            type="color"
                                                                            value={item.titleColor}
                                                                            onChange={(e) =>
                                                                                updateSelectedSection((prev) => {
                                                                                    if (prev.type !== "cardGrid") return prev;
                                                                                    return {
                                                                                        ...prev,
                                                                                        items: prev.items.map((card) =>
                                                                                            card.id === item.id ? { ...card, titleColor: e.target.value } : card
                                                                                        ),
                                                                                    };
                                                                                })
                                                                            }
                                                                            className="h-12 w-full rounded-xl border border-gray-300 bg-white p-2"
                                                                        />
                                                                    </Field>

                                                                    <Field label="설명 색상">
                                                                        <input
                                                                            type="color"
                                                                            value={item.descriptionColor}
                                                                            onChange={(e) =>
                                                                                updateSelectedSection((prev) => {
                                                                                    if (prev.type !== "cardGrid") return prev;
                                                                                    return {
                                                                                        ...prev,
                                                                                        items: prev.items.map((card) =>
                                                                                            card.id === item.id ? { ...card, descriptionColor: e.target.value } : card
                                                                                        ),
                                                                                    };
                                                                                })
                                                                            }
                                                                            className="h-12 w-full rounded-xl border border-gray-300 bg-white p-2"
                                                                        />
                                                                    </Field>

                                                                    <Field label="카드 배경색">
                                                                        <input
                                                                            type="color"
                                                                            value={item.cardBgColor}
                                                                            onChange={(e) =>
                                                                                updateSelectedSection((prev) => {
                                                                                    if (prev.type !== "cardGrid") return prev;
                                                                                    return {
                                                                                        ...prev,
                                                                                        items: prev.items.map((card) =>
                                                                                            card.id === item.id ? { ...card, cardBgColor: e.target.value } : card
                                                                                        ),
                                                                                    };
                                                                                })
                                                                            }
                                                                            className="h-12 w-full rounded-xl border border-gray-300 bg-white p-2"
                                                                        />
                                                                    </Field>
                                                                </div>

                                                                <Field label="아이콘 업로드">
                                                                    <input
                                                                        type="file"
                                                                        accept="image/*"
                                                                        onChange={(e) => handleCardIconChange(e, item.id)}
                                                                        className="block w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm"
                                                                    />
                                                                </Field>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>

                        <section className="flex flex-wrap items-center justify-end gap-3">
                            <button
                                type="button"
                                className="inline-flex items-center rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                취소
                            </button>
                            <button
                                type="button"
                                onClick={() => setPreviewOpen(true)}
                                className="inline-flex items-center rounded-xl border border-blue-300 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-700 hover:bg-blue-100"
                            >
                                미리보기
                            </button>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className={[
                                    "inline-flex items-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white",
                                    isSaving
                                        ? "cursor-not-allowed bg-orange-300"
                                        : "bg-orange-500 hover:bg-orange-600",
                                ].join(" ")}
                            >
                                {isSaving ? "저장 중..." : "저장하기"}
                            </button>
                        </section>
                    </form>
                </main>
            </div>

            {previewOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 px-4 py-6">
                    <div className="mx-auto flex h-full max-w-7xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
                        <div className="flex flex-col gap-3 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-lg font-semibold">실시간 미리보기</h2>
                                <p className="text-sm text-gray-500">{selectedCategory} 페이지 미리보기</p>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <div className="inline-flex rounded-xl border border-gray-200 bg-gray-50 p-1">
                                    <button
                                        type="button"
                                        onClick={() => setPreviewDevice("desktop")}
                                        className={[
                                            "rounded-lg px-3 py-2 text-sm font-medium transition",
                                            previewDevice === "desktop"
                                                ? "bg-white text-gray-900 shadow-sm"
                                                : "text-gray-500",
                                        ].join(" ")}
                                    >
                                        PC
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPreviewDevice("tablet")}
                                        className={[
                                            "rounded-lg px-3 py-2 text-sm font-medium transition",
                                            previewDevice === "tablet"
                                                ? "bg-white text-gray-900 shadow-sm"
                                                : "text-gray-500",
                                        ].join(" ")}
                                    >
                                        태블릿
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPreviewDevice("mobile")}
                                        className={[
                                            "rounded-lg px-3 py-2 text-sm font-medium transition",
                                            previewDevice === "mobile"
                                                ? "bg-white text-gray-900 shadow-sm"
                                                : "text-gray-500",
                                        ].join(" ")}
                                    >
                                        모바일
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setPreviewOpen(false)}
                                    className="rounded-xl border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
                                >
                                    닫기
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-auto bg-gray-100 p-4 sm:p-6">
                            <div className={`mx-auto transition-all duration-300 ${previewWidthClass}`}>
                                <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
                                    <PagePreview sections={currentSections} device={previewDevice} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

function Field({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <label className="block space-y-2">
            <span className="text-sm font-medium text-gray-700">{label}</span>
            {children}
        </label>
    );
}

function AnimatedSection({
    animation,
    children,
}: {
    animation: AnimationType;
    children: React.ReactNode;
}) {
    return (
        <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={animationVariantsMap[animation]}
        >
            {children}
        </motion.div>
    );
}
function PagePreview({
    sections,
    device,
}: {
    sections: ContentSection[];
    device: PreviewDevice;
}) {
    return (
        <div className="w-full bg-gray-100 p-4 sm:p-5">
            {sections.map((section) => {
                if (section.type === "text") {
                    const sectionBg =
                        section.background === "white"
                            ? "bg-white"
                            : section.background === "gray"
                                ? "bg-gray-50"
                                : "bg-gray-900";

                    return (
                        <PreviewCard key={section.id}>
                            <AnimatedSection animation={section.animation}>
                                <section className={`px-6 py-14 sm:px-10 lg:px-16 ${sectionBg}`}>
                                    <div
                                        className={[
                                            "max-w-3xl flex flex-col",
                                            textAlignClassMap[section.align],
                                            contentAlignClassMap[section.align],
                                            section.align === "center" ? "mx-auto" : "",
                                            section.align === "right" ? "ml-auto" : "",
                                        ].join(" ")}
                                    >
                                        {section.eyebrow && (
                                            <p
                                                className="mb-3 text-xs font-semibold uppercase tracking-[0.24em]"
                                                style={{
                                                    color:
                                                        section.background === "dark" ? "#FFFFFF99" : "#F97316",
                                                }}
                                            >
                                                {section.eyebrow}
                                            </p>
                                        )}
                                        <h2
                                            className="text-3xl font-bold tracking-tight sm:text-4xl"
                                            style={{ color: section.titleColor }}
                                        >
                                            {section.title}
                                        </h2>
                                        <p
                                            className="mt-4 whitespace-pre-line text-base"
                                            style={{ color: section.descriptionColor }}
                                        >
                                            {section.description}
                                        </p>
                                    </div>
                                </section>
                            </AnimatedSection>
                        </PreviewCard>
                    );
                }

                if (section.type === "imageText") {
                    const bgClass = section.background === "gray" ? "bg-gray-50" : "bg-white";
                    const isMobile = device === "mobile";

                    const textAlignClass =
                        section.align === "center"
                            ? "text-center items-center"
                            : section.align === "right"
                                ? "text-right items-end"
                                : "text-left items-start";

                    if (isMobile) {
                        return (
                            <PreviewCard key={section.id}>
                                <AnimatedSection animation={section.animation}>
                                    <section className={`px-6 py-14 sm:px-10 lg:px-16 ${bgClass}`}>
                                        <div className="flex flex-col gap-6">
                                            <div className="relative min-h-[260px] overflow-hidden rounded-2xl bg-gray-100">
                                                {section.imageUrl ? (
                                                    <Image
                                                        src={section.imageUrl}
                                                        alt={section.title}
                                                        fill
                                                        unoptimized
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full min-h-[260px] items-center justify-center text-sm text-gray-400">
                                                        이미지가 없습니다
                                                    </div>
                                                )}
                                            </div>

                                            <div className={`flex flex-col ${textAlignClass}`}>
                                                <h3
                                                    className="text-2xl font-bold break-keep sm:text-3xl"
                                                    style={{ color: section.titleColor }}
                                                >
                                                    {section.title}
                                                </h3>

                                                <p
                                                    className="mt-4 whitespace-pre-line break-keep"
                                                    style={{ color: section.descriptionColor }}
                                                >
                                                    {section.description}
                                                </p>

                                                {section.buttonText && (
                                                    <a
                                                        href={section.buttonLink || "#"}
                                                        className="mt-6 inline-flex w-fit rounded-xl px-5 py-3 text-sm font-semibold"
                                                        style={{
                                                            backgroundColor: section.buttonBgColor,
                                                            color: section.buttonTextColor,
                                                        }}
                                                    >
                                                        {section.buttonText}
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </section>
                                </AnimatedSection>
                            </PreviewCard>
                        );
                    }

                    const imageBlock = (
                        <div className="relative min-h-[260px] overflow-hidden rounded-2xl bg-gray-100">
                            {section.imageUrl ? (
                                <Image
                                    src={section.imageUrl}
                                    alt={section.title}
                                    fill
                                    unoptimized
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex h-full min-h-[260px] items-center justify-center text-sm text-gray-400">
                                    이미지가 없습니다
                                </div>
                            )}
                        </div>
                    );

                    const textBlock = (
                        <div className={`flex flex-col justify-center ${textAlignClass}`}>
                            <h3
                                className="text-2xl font-bold break-keep sm:text-3xl"
                                style={{ color: section.titleColor }}
                            >
                                {section.title}
                            </h3>

                            <p
                                className="mt-4 whitespace-pre-line break-keep"
                                style={{ color: section.descriptionColor }}
                            >
                                {section.description}
                            </p>

                            {section.buttonText && (
                                <a
                                    href={section.buttonLink || "#"}
                                    className="mt-6 inline-flex w-fit rounded-xl px-5 py-3 text-sm font-semibold"
                                    style={{
                                        backgroundColor: section.buttonBgColor,
                                        color: section.buttonTextColor,
                                    }}
                                >
                                    {section.buttonText}
                                </a>
                            )}
                        </div>
                    );

                    return (
                        <PreviewCard key={section.id}>
                            <AnimatedSection animation={section.animation}>
                                <section className={`px-6 py-14 sm:px-10 lg:px-16 ${bgClass}`}>
                                    <div className="grid grid-cols-2 items-center gap-8">
                                        {section.layout === "left" ? (
                                            <>
                                                {imageBlock}
                                                {textBlock}
                                            </>
                                        ) : (
                                            <>
                                                {textBlock}
                                                {imageBlock}
                                            </>
                                        )}
                                    </div>
                                </section>
                            </AnimatedSection>
                        </PreviewCard>
                    );
                }

                if (section.type === "cta") {
                    const themeClass =
                        section.theme === "orange" ? "bg-orange-500" : "bg-gray-900";

                    return (
                        <PreviewCard key={section.id}>
                            <AnimatedSection animation={section.animation}>
                                <section className="bg-white px-6 py-14 sm:px-10 lg:px-16">
                                    <div className={`rounded-3xl px-6 py-10 sm:px-10 ${themeClass}`}>
                                        <div
                                            className={[
                                                "flex flex-col",
                                                textAlignClassMap[section.align],
                                                contentAlignClassMap[section.align],
                                            ].join(" ")}
                                        >
                                            <h3
                                                className="text-2xl font-bold sm:text-3xl"
                                                style={{ color: section.titleColor }}
                                            >
                                                {section.title}
                                            </h3>
                                            <p
                                                className="mt-4 max-w-2xl"
                                                style={{ color: section.descriptionColor }}
                                            >
                                                {section.description}
                                            </p>
                                            <a
                                                href={section.buttonLink || "#"}
                                                className="mt-6 inline-flex rounded-xl px-5 py-3 text-sm font-semibold"
                                                style={{
                                                    backgroundColor: section.buttonBgColor,
                                                    color: section.buttonTextColor,
                                                }}
                                            >
                                                {section.buttonText}
                                            </a>
                                        </div>
                                    </div>
                                </section>
                            </AnimatedSection>
                        </PreviewCard>
                    );
                }

                if (section.type === "titleImage") {
                    const bgClass =
                        section.background === "white"
                            ? "bg-white"
                            : section.background === "gray"
                                ? "bg-gray-50"
                                : "bg-gray-900";

                    return (
                        <PreviewCard key={section.id}>
                            <AnimatedSection animation={section.animation}>
                                <section className={`px-6 py-14 sm:px-10 lg:px-16 ${bgClass}`}>
                                    <div
                                        className={[
                                            "flex flex-col gap-8",
                                            textAlignClassMap[section.align],
                                            contentAlignClassMap[section.align],
                                        ].join(" ")}
                                    >
                                        <h2
                                            className="text-3xl font-bold sm:text-4xl"
                                            style={{ color: section.titleColor }}
                                        >
                                            {section.title}
                                        </h2>

                                        <div className="relative w-full overflow-hidden rounded-3xl bg-gray-100 min-h-[280px]">
                                            {section.imageUrl ? (
                                                <Image
                                                    src={section.imageUrl}
                                                    alt={section.title}
                                                    fill
                                                    unoptimized
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="flex min-h-[280px] items-center justify-center text-sm text-gray-400">
                                                    이미지가 없습니다
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </section>
                            </AnimatedSection>
                        </PreviewCard>
                    );
                }

                if (section.type === "cardGrid") {
                    const bgClass =
                        section.background === "white"
                            ? "bg-white"
                            : section.background === "gray"
                                ? "bg-gray-50"
                                : "bg-gray-900";

                    const currentColumns =
                        device === "desktop"
                            ? section.pcColumns
                            : device === "tablet"
                                ? section.tabletColumns
                                : section.mobileColumns;

                    return (
                        <PreviewCard key={section.id}>
                            <AnimatedSection animation={section.animation}>
                                <section className={`px-6 py-14 sm:px-10 lg:px-16 ${bgClass}`}>
                                    <div
                                        className={[
                                            "flex flex-col",
                                            textAlignClassMap[section.align],
                                            contentAlignClassMap[section.align],
                                        ].join(" ")}
                                    >
                                        {section.eyebrow && (
                                            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                                                {section.eyebrow}
                                            </p>
                                        )}

                                        <h2
                                            className="text-3xl font-bold sm:text-4xl"
                                            style={{ color: section.titleColor }}
                                        >
                                            {section.title}
                                        </h2>

                                        <p
                                            className="mt-4 max-w-3xl whitespace-pre-line"
                                            style={{ color: section.descriptionColor }}
                                        >
                                            {section.description}
                                        </p>
                                    </div>

                                    <div
                                        className="mt-8 grid"
                                        style={{
                                            rowGap: `${section.rowGap}px`,
                                            columnGap: `${section.columnGap}px`,
                                            gridTemplateColumns: `repeat(${currentColumns}, minmax(0, 1fr))`,
                                        }}
                                    >
                                        {section.items.map((item) => (
                                            <div
                                                key={item.id}
                                                className="rounded-3xl border border-gray-200 p-6 shadow-sm"
                                                style={{ backgroundColor: item.cardBgColor }}
                                            >
                                                {item.iconUrl ? (
                                                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 overflow-hidden">
                                                        <img
                                                            src={item.iconUrl}
                                                            alt={item.title}
                                                            className="h-8 w-8 object-contain"
                                                        />
                                                    </div>
                                                ) : null}

                                                <h3
                                                    className="text-xl font-bold"
                                                    style={{ color: item.titleColor }}
                                                >
                                                    {item.title}
                                                </h3>

                                                <p
                                                    className="mt-4 whitespace-pre-line leading-7"
                                                    style={{ color: item.descriptionColor }}
                                                >
                                                    {item.description}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </AnimatedSection>
                        </PreviewCard>
                    );
                }

                return null;
            })}
        </div>
    );
    function PreviewCard({
        children,
    }: {
        children: React.ReactNode;
    }) {
        return (
            <div className="mb-5 overflow-hidden rounded-[32px] border border-gray-200 bg-white shadow-sm">
                {children}
            </div>
        );
    }
}

export default AdminContentsPage;