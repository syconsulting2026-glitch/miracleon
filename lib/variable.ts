export type SiteBasicForm = {
  siteName: string;
  siteSubTitle: string;
  siteDescription: string;
  siteUrl: string;
  adminEmail: string;
  adminPhone: string;
  footerText: string;
  kakaoLink: string;
  youtubeLink: string;
  instagramLink: string;
  logoFile: File | null;
  faviconFile: File | null;
  ogImageFile: File | null;
  isPublic: boolean;
};

