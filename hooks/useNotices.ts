"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createNotice,
  deleteManyNotices,
  deleteNotice,
  getNoticeDetail,
  getNotices,
  updateNotice,
} from "@/services/notice";
import {
  CreateNoticePayload,
  GetNoticesParams,
  GetNoticesResponse,
  NoticeDetail,
  UpdateNoticePayload,
} from "@/types/notice";

/** 목록 조회 */
export const useNotices = (params: GetNoticesParams) => {
  return useQuery<GetNoticesResponse, Error>({
    queryKey: ["notices", params],
    queryFn: () => getNotices(params),
    staleTime: 1000 * 30,
  });
};

/** 상세 조회 */
export const useNoticeDetail = (id: number) => {
  return useQuery<NoticeDetail, Error>({
    queryKey: ["notice-detail", id],
    queryFn: () => getNoticeDetail(id),
    enabled: Number.isFinite(id) && id > 0,
  });
};

/** 등록 */
export const useCreateNotice = () => {
  const queryClient = useQueryClient();

  return useMutation<NoticeDetail, Error, CreateNoticePayload>({
    mutationFn: createNotice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notices"] });
    },
  });
};

/** 수정 */
export const useUpdateNotice = () => {
  const queryClient = useQueryClient();

  return useMutation<NoticeDetail, Error, UpdateNoticePayload>({
    mutationFn: updateNotice,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["notices"] });
      queryClient.invalidateQueries({ queryKey: ["notice-detail", data.id] });
    },
  });
};

/** 단건 삭제 */
export const useDeleteNotice = () => {
  const queryClient = useQueryClient();

  return useMutation<{ ok: boolean }, Error, { id: number }>({
    mutationFn: deleteNotice,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["notices"] });
      queryClient.removeQueries({
        queryKey: ["notice-detail", variables.id],
      });
    },
  });
};

/** 다건 삭제 */
export const useDeleteManyNotices = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { ids: number[] }>({
    mutationFn: deleteManyNotices,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notices"] });
    },
  });
};