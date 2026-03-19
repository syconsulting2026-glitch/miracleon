"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createGallery,
  deleteGallery,
  deleteManyGalleries,
  getGalleryDetail,
  getGalleries,
  updateGallery,
} from "@/services/gallery";
import {
  CreateGalleryPayload,
  GalleryDetail,
  GetGalleriesParams,
  GetGalleriesResponse,
  UpdateGalleryPayload,
} from "@/types/gallery";

export const useGalleries = (params: GetGalleriesParams) => {
  return useQuery<GetGalleriesResponse, Error>({
    queryKey: ["galleries", params],
    queryFn: () => getGalleries(params),
    staleTime: 1000 * 30,
  });
};

export const useGalleryDetail = (id: number) => {
  return useQuery<GalleryDetail, Error>({
    queryKey: ["gallery-detail", id],
    queryFn: () => getGalleryDetail(id),
    enabled: Number.isFinite(id) && id > 0,
  });
};

export const useCreateGallery = () => {
  const queryClient = useQueryClient();

  return useMutation<GalleryDetail, Error, CreateGalleryPayload>({
    mutationFn: createGallery,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["galleries"] });
    },
  });
};

export const useUpdateGallery = () => {
  const queryClient = useQueryClient();

  return useMutation<GalleryDetail, Error, UpdateGalleryPayload>({
    mutationFn: updateGallery,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["galleries"] });
      queryClient.invalidateQueries({ queryKey: ["gallery-detail", data.id] });
    },
  });
};

export const useDeleteGallery = () => {
  const queryClient = useQueryClient();

  return useMutation<{ ok: boolean }, Error, { id: number }>({
    mutationFn: ({ id }) => deleteGallery(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["galleries"] });
      queryClient.removeQueries({ queryKey: ["gallery-detail", variables.id] });
    },
  });
};

export const useDeleteManyGalleries = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { ids: number[] }>({
    mutationFn: ({ ids }) => deleteManyGalleries(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["galleries"] });
    },
  });
};