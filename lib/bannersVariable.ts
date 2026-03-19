export type BannerCategory =
  | "메인"
  | "UNBOX소개"
  | "설립목적"
  | "주요사업"
  | "철학가치관"
  | "커뮤니티";

export type TextAlign = "left" | "center" | "right";
export type VerticalAlign = "top" | "center" | "bottom";
export type BannerEffect =
  | "slide"
  | "fade"
  | "coverflow"
  | "flip"
  | "cards"
  | "creative";
export type BannerSlide = {
  id: number;
  title: string;
  description: string;
  imageFile: File | null;
  previewUrl: string | null;
  fontSize: number;
  fontColor: string;
  fontFamily: string;
  textAlign: TextAlign;
  verticalAlign: VerticalAlign;
  duration: number;
};

export type BannerCategoryState = {
  effect: BannerEffect;
  slides: BannerSlide[];
};

export const CATEGORY_OPTIONS: BannerCategory[] = [
  "메인",
  "UNBOX소개",
  "설립목적",
  "주요사업",
  "철학가치관",
  "커뮤니티",
];
export const createEmptySlide = (id: number): BannerSlide => ({
  id,
  title: "",
  description: "",
  imageFile: null,
  previewUrl: null,
  fontSize: 48,
  fontColor: "#ffffff",
  fontFamily: "Pretendard",
  textAlign: "center",
  verticalAlign: "center",
  duration: 5,
});
export const createCategoryState = (): BannerCategoryState => ({
  effect: "slide",
  slides: [createEmptySlide(1)],
});