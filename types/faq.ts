export interface FaqListItem {
  id: number;
  category: string;
  question: string;
  answer: string;
  isPinned: boolean;
  isVisible: boolean;
  views: number;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface GetFaqsParams {
  page?: number;
  pageSize?: number;
  q?: string;
  category?: string;
  isVisible?: boolean;
  admin?: boolean;
}

export interface GetFaqsResponse {
  items: FaqListItem[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface FaqDetail {
  id: number;
  category: string;
  question: string;
  answer: string;
  isPinned: boolean;
  isVisible: boolean;
  views: number;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFaqPayload {
  category: string;
  question: string;
  answer: string;
  isPinned?: boolean;
  isVisible?: boolean;
  sortOrder?: number;
}

export interface UpdateFaqPayload {
  id: number;
  category?: string;
  question?: string;
  answer?: string;
  isPinned?: boolean;
  isVisible?: boolean;
  sortOrder?: number;
}

export interface DeleteFaqPayload {
  id: number;
}

export interface DeleteManyFaqsPayload {
  ids: number[];
}