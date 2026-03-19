export type QnaAnswerStatus = "answered" | "pending";

export interface QnaAnswerItem {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface QnaListItem {
  id: number;
  title: string;
  authorName: string;
  isSecret: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
  answerStatus: QnaAnswerStatus;
  hasAnswer: boolean;
}

export interface GetQnasParams {
  page?: number;
  pageSize?: number;
  q?: string;
}

export interface GetQnasResponse {
  items: QnaListItem[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface QnaDetail {
  id: number;
  title: string;
  content: string;
  authorName: string;
  isSecret: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
  answerStatus: QnaAnswerStatus;
  hasAnswer: boolean;
  answer: QnaAnswerItem | null;
  secretBlocked: boolean;
}
export interface CreateQnaPayload {
  title: string;
  content: string;
  authorName: string;
  password: string;
  isSecret?: boolean;
  captchaId: string;
  captchaText: string;
  honeypot?: string;
  startedAt: number;
}

export interface QnaCaptchaResponse {
  captchaId: string;
  image: string;
}

export interface UpdateQnaPayload {
  id: number;
  title?: string;
  content?: string;
  authorName?: string;
  password: string;
  isSecret?: boolean;
}

export interface DeleteQnaPayload {
  id: number;
  password: string;
}

export interface VerifyQnaPasswordPayload {
  id: number;
  password: string;
}

export interface CreateQnaAnswerPayload {
  qnaId: number;
  content: string;
}

export interface UpdateQnaAnswerPayload {
  qnaId: number;
  content: string;
}

export interface DeleteQnaAnswerPayload {
  qnaId: number;
}