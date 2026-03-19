export type ApplyClassType = "AI" | "CODING";
export type ApplyStatus = "NEW" | "CONTACTED" | "DONE" | "CANCELLED";

export interface ApplyItem {
  id: number;
  classType: ApplyClassType;
  name: string;
  phone: string;
  phoneDigits: string;
  district: string;
  neighborhoodDetail: string;
  address: string;
  howFound: string;
  recommender: string | null;
  privacyAgree: boolean;
  status: ApplyStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ApplyDetail extends ApplyItem {
  motivation: string;
}

export interface ApplyListResponse {
  items: ApplyItem[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface GetApplyListParams {
  page?: number;
  pageSize?: number;
  q?: string;
  classType?: ApplyClassType | "";
  status?: ApplyStatus | "";
  district?: string;
  order?: "new" | "old";
}

export interface CreateApplyPayload {
  classType: ApplyClassType;
  name: string;
  phone: string;
  phoneDigits: string;
  district: string;
  neighborhoodDetail: string;
  address: string;
  motivation: string;
  howFound: string;
  recommender?: string;
  privacyAgree: boolean;

  // ✅ 자동입력방지
  captchaId: string;
  captchaText: string;
  captchaStartedAt: number;
}