"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createFaq,
  deleteFaq,
  deleteManyFaqs,
  getFaqDetail,
  getFaqs,
  updateFaq,
} from "@/services/faq";
import {
  CreateFaqPayload,
  DeleteFaqPayload,
  DeleteManyFaqsPayload,
  FaqDetail,
  GetFaqsParams,
  GetFaqsResponse,
  UpdateFaqPayload,
} from "@/types/faq";

export const useFaqs = (params: GetFaqsParams) => {
  return useQuery<GetFaqsResponse, Error>({
    queryKey: ["faqs", params],
    queryFn: () => getFaqs(params),
    staleTime: 1000 * 30,
  });
};

export const useFaqDetail = (id: number) => {
  return useQuery<FaqDetail, Error>({
    queryKey: ["faq-detail", id],
    queryFn: () => getFaqDetail(id),
    enabled: Number.isFinite(id) && id > 0,
  });
};

export const useCreateFaq = () => {
  const queryClient = useQueryClient();

  return useMutation<FaqDetail, Error, CreateFaqPayload>({
    mutationFn: createFaq,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
    },
  });
};

export const useUpdateFaq = () => {
  const queryClient = useQueryClient();

  return useMutation<FaqDetail, Error, UpdateFaqPayload>({
    mutationFn: updateFaq,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      queryClient.invalidateQueries({ queryKey: ["faq-detail", data.id] });
    },
  });
};

export const useDeleteFaq = () => {
  const queryClient = useQueryClient();

  return useMutation<{ ok: boolean }, Error, DeleteFaqPayload>({
    mutationFn: deleteFaq,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      queryClient.removeQueries({ queryKey: ["faq-detail", variables.id] });
    },
  });
};

export const useDeleteManyFaqs = () => {
  const queryClient = useQueryClient();

  return useMutation<{ ok: boolean }, Error, DeleteManyFaqsPayload>({
    mutationFn: deleteManyFaqs,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
    },
  });
};