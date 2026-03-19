import { api } from "@/lib/api";
import {
  CreateFaqPayload,
  DeleteFaqPayload,
  DeleteManyFaqsPayload,
  FaqDetail,
  GetFaqsParams,
  GetFaqsResponse,
  UpdateFaqPayload,
} from "@/types/faq";

export const getFaqs = async (
  params: GetFaqsParams = {}
): Promise<GetFaqsResponse> => {
  const url = params.admin ? "/faq/admin" : "/faq";

  const { data } = await api.get<GetFaqsResponse>(url, {
    params: {
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 10,
      q: params.q ?? "",
      category: params.category ?? "",
      isVisible:
        params.isVisible === undefined ? undefined : String(params.isVisible),
    },
  });

  return data;
};

export const getFaqDetail = async (id: number): Promise<FaqDetail> => {
  const { data } = await api.get<FaqDetail>(`/faq/${id}`);
  return data;
};

export const createFaq = async (
  payload: CreateFaqPayload
): Promise<FaqDetail> => {
  const { data } = await api.post<FaqDetail>("/faq", payload);
  return data;
};

export const updateFaq = async (
  payload: UpdateFaqPayload
): Promise<FaqDetail> => {
  const { data } = await api.put<FaqDetail>(`/faq/${payload.id}`, payload);
  return data;
};

export const deleteFaq = async ({
  id,
}: DeleteFaqPayload): Promise<{ ok: boolean }> => {
  const { data } = await api.delete<{ ok: boolean }>(`/faq/${id}`);
  return data;
};

export const deleteManyFaqs = async ({
  ids,
}: DeleteManyFaqsPayload): Promise<{ ok: boolean }> => {
  const { data } = await api.delete<{ ok: boolean }>("/faq", {
    data: { ids },
  });
  return data;
};