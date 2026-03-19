import { api } from "@/lib/api";
import {
  GetSiteBannersResponse,
  SaveBannerPayload,
  SaveBannerResponse,
} from "@/types/siteBanner";

export const saveSiteBanner = async (
  payload: SaveBannerPayload
): Promise<SaveBannerResponse> => {
  const formData = new FormData();

  formData.append("category", payload.category);
  formData.append("effect", payload.effect);

  formData.append(
    "slides",
    JSON.stringify(
      payload.slides.map((slide) => ({
        title: slide.title ?? null,
        description: slide.description ?? null,
        existingImageUrl: slide.existingImageUrl ?? null,
        existingImageName: slide.existingImageName ?? null,
        fontSize: Number(slide.fontSize),
        fontColor: slide.fontColor,
        fontFamily: slide.fontFamily,
        textAlign: slide.textAlign,
        verticalAlign: slide.verticalAlign,
        duration: Number(slide.duration),
        isActive: slide.isActive ?? true,
      }))
    )
  );

  payload.slides.forEach((slide, index) => {
    if (slide.imageFile) {
      formData.append(`slideImage_${index}`, slide.imageFile);
    }
  });

  const { data } = await api.post<SaveBannerResponse>(
    "/site-banners/save",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};

export const getSiteBanners = async (): Promise<GetSiteBannersResponse> => {
  const { data } = await api.get<GetSiteBannersResponse>("/site-banners");
  return data;
};