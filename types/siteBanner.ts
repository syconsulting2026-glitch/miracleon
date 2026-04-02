export type BannerCategory =
  | "메인"
  | "MIRACLEON소개"
  | "설립목적"
  | "주요사업"
  | "철학가치관"
  | "커뮤니티";

export type BannerEffect =
  | "slide"
  | "fade"
  | "coverflow"
  | "flip"
  | "cards"
  | "creative";

export type TextAlign = "left" | "center" | "right";
export type VerticalAlign = "top" | "center" | "bottom";

export interface SaveBannerSlidePayload {
  title?: string | null;
  description?: string | null;
  existingImageUrl?: string | null;
  existingImageName?: string | null;
  imageFile?: File | null;
  fontSize: number;
  fontColor: string;
  fontFamily: string;
  textAlign: TextAlign;
  verticalAlign: VerticalAlign;
  duration: number;
  isActive?: boolean;
}

export interface SaveBannerPayload {
  category: BannerCategory;
  effect: BannerEffect;
  slides: SaveBannerSlidePayload[];
}

export interface SiteBannerSlideItem {
  id: number;
  bannerId: number | null;
  sortOrder: number;
  title: string | null;
  description: string | null;
  imageUrl: string | null;
  imageName: string | null;
  fontSize: number;
  fontColor: string;
  fontFamily: string;
  textAlign: TextAlign;
  verticalAlign: VerticalAlign;
  duration: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SiteBannerItem {
  id: number;
  category: BannerCategory;
  effect: BannerEffect;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  slides: SiteBannerSlideItem[];
}

export interface GetSiteBannersResponse {
  success: boolean;
  message: string;
  data: SiteBannerItem[];
}

export interface SaveBannerResponse {
  success: boolean;
  message: string;
  data?: {
    banner: {
      id: number;
      category: BannerCategory;
      effect: BannerEffect;
    };
    slides: Array<{
      id: number;
      bannerId: number;
      sortOrder: number;
      title: string | null;
      description: string | null;
      imageUrl: string | null;
      imageName: string | null;
      fontSize: number;
      fontColor: string;
      fontFamily: string;
      textAlign: TextAlign;
      verticalAlign: VerticalAlign;
      duration: number;
      isActive: boolean;
    }>;
  };
}