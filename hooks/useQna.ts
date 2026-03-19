"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getQnaCaptcha } from "@/services/qna";
import { QnaCaptchaResponse } from "@/types/qna";
import {
  createQna,
  createQnaAnswer,
  deleteQna,
  deleteQnaAnswer,
  getQnaDetail,
  getQnas,
  updateQna,
  updateQnaAnswer,
  verifyQnaPassword,
} from "@/services/qna";
import {
  CreateQnaAnswerPayload,
  CreateQnaPayload,
  DeleteQnaAnswerPayload,
  DeleteQnaPayload,
  GetQnasParams,
  GetQnasResponse,
  QnaAnswerItem,
  QnaDetail,
  UpdateQnaAnswerPayload,
  UpdateQnaPayload,
  VerifyQnaPasswordPayload,
} from "@/types/qna";

export const useQnas = (params: GetQnasParams) => {
  return useQuery<GetQnasResponse, Error>({
    queryKey: ["qnas", params],
    queryFn: () => getQnas(params),
    staleTime: 1000 * 30,
  });
};

export const useQnaDetail = (id: number, password?: string) => {
  return useQuery<QnaDetail, Error>({
    queryKey: ["qna-detail", id, password ?? ""],
    queryFn: () => getQnaDetail(id, password),
    enabled: Number.isFinite(id) && id > 0,
  });
};

export const useVerifyQnaPassword = () => {
  return useMutation<{ ok: boolean }, Error, VerifyQnaPasswordPayload>({
    mutationFn: verifyQnaPassword,
  });
};

export const useCreateQna = () => {
  const queryClient = useQueryClient();

  return useMutation<
    {
      id: number;
      title: string;
      authorName: string;
      isSecret: boolean;
      views: number;
      createdAt: string;
      updatedAt: string;
      answerStatus: "answered" | "pending";
      hasAnswer: boolean;
    },
    Error,
    CreateQnaPayload
  >({
    mutationFn: createQna,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["qnas"] });
    },
  });
};

export const useUpdateQna = () => {
  const queryClient = useQueryClient();

  return useMutation<QnaDetail, Error, UpdateQnaPayload>({
    mutationFn: updateQna,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["qnas"] });
      queryClient.invalidateQueries({
        queryKey: ["qna-detail", variables.id],
      });
    },
  });
};

export const useDeleteQna = () => {
  const queryClient = useQueryClient();

  return useMutation<{ ok: boolean }, Error, DeleteQnaPayload>({
    mutationFn: deleteQna,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["qnas"] });
      queryClient.removeQueries({
        queryKey: ["qna-detail", variables.id],
      });
    },
  });
};

export const useCreateQnaAnswer = () => {
  const queryClient = useQueryClient();

  return useMutation<
    QnaAnswerItem & { qnaId: number },
    Error,
    CreateQnaAnswerPayload
  >({
    mutationFn: createQnaAnswer,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["qnas"] });
      queryClient.invalidateQueries({
        queryKey: ["qna-detail", variables.qnaId],
      });
    },
  });
};

export const useUpdateQnaAnswer = () => {
  const queryClient = useQueryClient();

  return useMutation<
    QnaAnswerItem & { qnaId: number },
    Error,
    UpdateQnaAnswerPayload
  >({
    mutationFn: updateQnaAnswer,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["qnas"] });
      queryClient.invalidateQueries({
        queryKey: ["qna-detail", variables.qnaId],
      });
    },
  });
};

export const useDeleteQnaAnswer = () => {
  const queryClient = useQueryClient();

  return useMutation<{ ok: boolean }, Error, DeleteQnaAnswerPayload>({
    mutationFn: deleteQnaAnswer,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["qnas"] });
      queryClient.invalidateQueries({
        queryKey: ["qna-detail", variables.qnaId],
      });
    },
  });
};

export const useQnaCaptcha = () => {
  return useMutation<QnaCaptchaResponse, Error, void>({
    mutationFn: () => getQnaCaptcha(),
  });
};