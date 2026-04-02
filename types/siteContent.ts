export type ContentCategory =
  | "미라클온소개"
  | "설립목적"
  | "주요사업"
  | "철학가치관";

export type SectionType =
  | "text"
  | "imageText"
  | "cta"
  | "titleImage"
  | "cardGrid";

export type TextAlign = "left" | "center" | "right";

export type AnimationType =
  | "none"
  | "fadeUp"
  | "fadeIn"
  | "slideLeft"
  | "slideRight"
  | "zoomIn";

export type SectionBackground = "white" | "gray" | "dark";
export type ImageLayout = "left" | "right";
export type CtaTheme = "orange" | "dark";

export interface SaveContentCardItemPayload {
  title: string;
  description?: string | null;
  existingIconUrl?: string | null;
  existingIconName?: string | null;
  iconFile?: File | null;
  titleColor?: string | null;
  descriptionColor?: string | null;
  cardBgColor?: string | null;
}

export interface SaveContentSectionPayload {
  type: SectionType;
  name: string;
  animation: AnimationType;

  eyebrow?: string | null;
  title?: string | null;
  description?: string | null;

  titleColor?: string | null;
  descriptionColor?: string | null;

  align?: TextAlign | null;
  background?: SectionBackground | null;

  imageUrl?: string | null;
  imageName?: string | null;
  existingImageUrl?: string | null;
  existingImageName?: string | null;
  imageFile?: File | null;
  layout?: ImageLayout | null;

  buttonText?: string | null;
  buttonLink?: string | null;
  buttonTextColor?: string | null;
  buttonBgColor?: string | null;

  theme?: CtaTheme | null;

  pcColumns?: number | null;
  tabletColumns?: number | null;
  mobileColumns?: number | null;

  rowGap?: number | null;
  columnGap?: number | null;

  items?: SaveContentCardItemPayload[];
}

export interface SaveSiteContentPayload {
  category: ContentCategory;
  sections: SaveContentSectionPayload[];
}

export interface SaveSiteContentResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

export interface SiteContentCardItem {
  id: number;
  title: string;
  description: string | null;
  iconUrl: string | null;
  iconName: string | null;
  titleColor: string | null;
  descriptionColor: string | null;
  cardBgColor: string | null;
}

export interface SiteContentSectionItem {
  id: number;
  type: SectionType;
  name: string;
  animation: AnimationType;

  eyebrow: string | null;
  title: string | null;
  description: string | null;

  titleColor: string | null;
  descriptionColor: string | null;

  align: TextAlign | null;
  background: SectionBackground | null;

  imageUrl: string | null;
  imageName: string | null;
  layout: ImageLayout | null;

  buttonText: string | null;
  buttonLink: string | null;
  buttonTextColor: string | null;
  buttonBgColor: string | null;

  theme: CtaTheme | null;

  pcColumns: number | null;
  tabletColumns: number | null;
  mobileColumns: number | null;

  rowGap: number | null;
  columnGap: number | null;

  items: SiteContentCardItem[];
}

export interface SiteContentPageItem {
  id: number;
  category: ContentCategory;
  isActive: boolean;
  sections: SiteContentSectionItem[];
}

export interface GetSiteContentsResponse {
  success: boolean;
  data: SiteContentPageItem[];
}