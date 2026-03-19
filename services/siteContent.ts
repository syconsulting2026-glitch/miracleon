import { api } from "@/lib/api";
import {
  GetSiteContentsResponse,
  SaveSiteContentPayload,
  SaveSiteContentResponse,
} from "@/types/siteContent";

export const getSiteContents = async (): Promise<GetSiteContentsResponse> => {
  const { data } = await api.get<GetSiteContentsResponse>("/site-contents");
  return data;
};

export const saveSiteContent = async (
  payload: SaveSiteContentPayload
): Promise<SaveSiteContentResponse> => {
  const formData = new FormData();

  formData.append("category", payload.category);

  formData.append(
    "sections",
    JSON.stringify(
      payload.sections.map((section) => ({
        type: section.type,
        name: section.name,
        animation: section.animation,

        eyebrow: section.eyebrow ?? null,
        title: section.title ?? null,
        description: section.description ?? null,

        titleColor: section.titleColor ?? null,
        descriptionColor: section.descriptionColor ?? null,

        align: section.align ?? null,
        background: section.background ?? null,

        existingImageUrl: section.existingImageUrl ?? null,
        existingImageName: section.existingImageName ?? null,
        layout: section.layout ?? null,

        buttonText: section.buttonText ?? null,
        buttonLink: section.buttonLink ?? null,
        buttonTextColor: section.buttonTextColor ?? null,
        buttonBgColor: section.buttonBgColor ?? null,

        theme: section.theme ?? null,

        pcColumns:
          section.pcColumns !== undefined && section.pcColumns !== null
            ? Number(section.pcColumns)
            : null,
        tabletColumns:
          section.tabletColumns !== undefined && section.tabletColumns !== null
            ? Number(section.tabletColumns)
            : null,
        mobileColumns:
          section.mobileColumns !== undefined && section.mobileColumns !== null
            ? Number(section.mobileColumns)
            : null,

        rowGap:
          section.rowGap !== undefined && section.rowGap !== null
            ? Number(section.rowGap)
            : null,
        columnGap:
          section.columnGap !== undefined && section.columnGap !== null
            ? Number(section.columnGap)
            : null,

        items:
          section.items?.map((item) => ({
            title: item.title,
            description: item.description ?? null,
            existingIconUrl: item.existingIconUrl ?? null,
            existingIconName: item.existingIconName ?? null,
            titleColor: item.titleColor ?? null,
            descriptionColor: item.descriptionColor ?? null,
            cardBgColor: item.cardBgColor ?? null,
          })) ?? [],
      }))
    )
  );

  payload.sections.forEach((section, sectionIndex) => {
    if (section.imageFile) {
      formData.append(`sectionImage_${sectionIndex}`, section.imageFile);
    }

    section.items?.forEach((item, itemIndex) => {
      if (item.iconFile) {
        formData.append(
          `sectionCardIcon_${sectionIndex}_${itemIndex}`,
          item.iconFile
        );
      }
    });
  });

  const { data } = await api.post<SaveSiteContentResponse>(
    "/site-contents/save",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};