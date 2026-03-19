import { api } from "@/lib/api";
import {
  CreateGalleryPayload,
  GalleryDetail,
  GetGalleriesParams,
  GetGalleriesResponse,
  UpdateGalleryPayload,
} from "@/types/gallery";

export const getGalleries = async (
  params: GetGalleriesParams = {}
): Promise<GetGalleriesResponse> => {
  const { data } = await api.get<GetGalleriesResponse>("/galleries", {
    params: {
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 12,
      q: params.q ?? "",
    },
  });

  return data;
};

export const getGalleryDetail = async (id: number): Promise<GalleryDetail> => {
  const { data } = await api.get<GalleryDetail>(`/galleries/${id}`);
  return data;
};

export const createGallery = async (
  payload: CreateGalleryPayload
): Promise<GalleryDetail> => {
  const formData = new FormData();

  formData.append("title", payload.title);
  formData.append("description", payload.description ?? "");

  payload.images.forEach((file) => {
    formData.append("images", file);
  });

  if (payload.thumbnailIndex !== undefined) {
    formData.append("thumbnailIndex", String(payload.thumbnailIndex));
  }

  const { data } = await api.post<GalleryDetail>("/galleries", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

export const updateGallery = async (
  payload: UpdateGalleryPayload
): Promise<GalleryDetail> => {
  const formData = new FormData();

  if (payload.title !== undefined) {
    formData.append("title", payload.title);
  }

  if (payload.description !== undefined) {
    formData.append("description", payload.description);
  }

  if (payload.deleteImageIds && payload.deleteImageIds.length > 0) {
    formData.append("deleteImageIds", JSON.stringify(payload.deleteImageIds));
  }

  if (payload.thumbnailImageId !== undefined) {
    formData.append("thumbnailImageId", String(payload.thumbnailImageId));
  }

  if (payload.thumbnailNewIndex !== undefined) {
    formData.append("thumbnailNewIndex", String(payload.thumbnailNewIndex));
  }

  (payload.images ?? []).forEach((file) => {
    formData.append("images", file);
  });

  const { data } = await api.put<GalleryDetail>(
    `/galleries/${payload.id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};

export const deleteGallery = async (id: number): Promise<{ ok: boolean }> => {
  const { data } = await api.delete<{ ok: boolean }>(`/galleries/${id}`);
  return data;
};

export const deleteManyGalleries = async (ids: number[]): Promise<void> => {
  await Promise.all(ids.map((id) => api.delete(`/galleries/${id}`)));
};