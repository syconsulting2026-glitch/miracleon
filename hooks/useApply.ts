"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  bulkDeleteApply,
  bulkUpdateApplyStatus,
  createApply,
  deleteApply,
  getApplyDetail,
  getApplyList,
  updateApplyStatus,
} from "@/services/apply";
import {
  ApplyDetail,
  ApplyListResponse,
  CreateApplyPayload,
  GetApplyListParams,
  ApplyStatus,
} from "@/types/apply";

export const useApplyList = (params: GetApplyListParams) => {
  return useQuery<ApplyListResponse, Error>({
    queryKey: ["apply-list", params],
    queryFn: () => getApplyList(params),
    staleTime: 1000 * 30,
  });
};

export const useApplyDetail = (id: number) => {
  return useQuery<ApplyDetail, Error>({
    queryKey: ["apply-detail", id],
    queryFn: () => getApplyDetail(id),
    enabled: Number.isFinite(id) && id > 0,
  });
};

export const useCreateApply = () => {
  return useMutation({
    mutationFn: (payload: CreateApplyPayload) => createApply(payload),
  });
};

export const useDeleteApply = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteApply(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["apply-list"] });
    },
  });
};

export const useBulkDeleteApply = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ids: number[]) => bulkDeleteApply(ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["apply-list"] });
    },
  });
};

export const useUpdateApplyStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: ApplyStatus }) =>
      updateApplyStatus(id, status),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["apply-list"] });
      qc.invalidateQueries({ queryKey: ["apply-detail", variables.id] });
    },
  });
};

export const useBulkUpdateApplyStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, status }: { ids: number[]; status: ApplyStatus }) =>
      bulkUpdateApplyStatus(ids, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["apply-list"] });
    },
  });
};