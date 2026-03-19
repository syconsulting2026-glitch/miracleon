import { api } from "@/lib/api";
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
  QnaCaptchaResponse
} from "@/types/qna";

export const getQnas = async (
  params: GetQnasParams = {}
): Promise<GetQnasResponse> => {
  const { data } = await api.get<GetQnasResponse>("/qnas", {
    params: {
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 10,
      q: params.q ?? "",
    },
  });

  return data;
};

export const getQnaDetail = async (
  id: number,
  password?: string
): Promise<QnaDetail> => {
  const { data } = await api.get<QnaDetail>(`/qnas/${id}`, {
    params: password ? { password } : undefined,
  });

  return data;
};

export const verifyQnaPassword = async ({
  id,
  password,
}: VerifyQnaPasswordPayload): Promise<{ ok: boolean }> => {
  const { data } = await api.post<{ ok: boolean }>(
    `/qnas/${id}/verify-password`,
    { password }
  );
  return data;
};

export const createQna = async (
  payload: CreateQnaPayload
): Promise<QnaListItemLike> => {
  const { data } = await api.post<QnaListItemLike>("/qnas", payload);
  return data;
};

export const updateQna = async (
  payload: UpdateQnaPayload
): Promise<QnaDetail> => {
  const { data } = await api.put<QnaDetail>(`/qnas/${payload.id}`, payload);
  return data;
};

export const deleteQna = async ({
  id,
  password,
}: DeleteQnaPayload): Promise<{ ok: boolean }> => {
  const { data } = await api.delete<{ ok: boolean }>(`/qnas/${id}`, {
    data: { password },
  });
  return data;
};

export const createQnaAnswer = async ({
  qnaId,
  content,
}: CreateQnaAnswerPayload): Promise<QnaAnswerItem & { qnaId: number }> => {
  const { data } = await api.post<QnaAnswerItem & { qnaId: number }>(
    `/qnas/${qnaId}/answer`,
    { content }
  );
  return data;
};

export const updateQnaAnswer = async ({
  qnaId,
  content,
}: UpdateQnaAnswerPayload): Promise<QnaAnswerItem & { qnaId: number }> => {
  const { data } = await api.put<QnaAnswerItem & { qnaId: number }>(
    `/qnas/${qnaId}/answer`,
    { content }
  );
  return data;
};

export const deleteQnaAnswer = async ({
  qnaId,
}: DeleteQnaAnswerPayload): Promise<{ ok: boolean }> => {
  const { data } = await api.delete<{ ok: boolean }>(`/qnas/${qnaId}/answer`);
  return data;
};

type QnaListItemLike = {
  id: number;
  title: string;
  authorName: string;
  isSecret: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
  answerStatus: "answered" | "pending";
  hasAnswer: boolean;
};

export const getQnaCaptcha = async (): Promise<QnaCaptchaResponse> => {
  const { data } = await api.get<QnaCaptchaResponse>("/qnas/captcha");
  return data;
};