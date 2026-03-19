import { api } from "@/lib/api";
import {
  ApplyDetail,
  ApplyListResponse,
  CreateApplyPayload,
  GetApplyListParams,
  ApplyStatus,
} from "@/types/apply";

export const getApplyList = async (
  params: GetApplyListParams = {}
): Promise<ApplyListResponse> => {
  const { data } = await api.get<ApplyListResponse>("/apply", {
    params: {
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 10,
      q: params.q ?? "",
      classType: params.classType ?? "",
      status: params.status ?? "",
      district: params.district ?? "",
      order: params.order ?? "new",
    },
  });
  return data;
};

export const getApplyDetail = async (id: number): Promise<ApplyDetail> => {
  const { data } = await api.get<{ item: ApplyDetail }>(`/apply/${id}`);
  return data.item;
};

export const createApply = async (payload: CreateApplyPayload) => {
  const { data } = await api.post("/apply", payload);
  return data;
};

export const deleteApply = async (id: number) => {
  const { data } = await api.delete(`/apply/${id}`);
  return data;
};

export const bulkDeleteApply = async (ids: number[]) => {
  const { data } = await api.post("/apply/bulk-delete", { ids });
  return data;
};

export const updateApplyStatus = async (id: number, status: ApplyStatus) => {
  const { data } = await api.patch(`/apply/${id}/status`, { status });
  return data;
};

export const bulkUpdateApplyStatus = async (
  ids: number[],
  status: ApplyStatus
) => {
  const { data } = await api.patch("/apply/bulk-status", { ids, status });
  return data;
};