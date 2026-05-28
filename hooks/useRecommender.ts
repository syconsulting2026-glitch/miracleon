import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export type Recommender = {
  id: number;
  name: string;
  phone: string;
  phoneDigits: string;
  last4Digits?: string; // 백엔드에서 가공해 주는 뒤 4자리 번호
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

// 1. 추천인 목록 조회 훅 (?activeOnly=true 및 검색어 ?q= 대응)
export function useRecommenders(params?: { activeOnly?: boolean; q?: string }) {
  return useQuery<Recommender[]>({
    queryKey: ["recommenders", params],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/recommender`, { params });
      return response.data.items;
    },
  });
}

// 2. 추천인 등록 훅
export function useCreateRecommender() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<Recommender, "id" | "createdAt" | "updatedAt" | "phoneDigits">) => {
      const response = await axios.post(`${API_URL}/recommender`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recommenders"] });
    },
  });
}

// 3. 추천인 수정 훅
export function useUpdateRecommender() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Recommender> }) => {
      const response = await axios.patch(`${API_URL}/recommender/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recommenders"] });
    },
  });
}

// 4. 추천인 삭제 훅
export function useDeleteRecommender() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await axios.delete(`${API_URL}/recommender/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recommenders"] });
    },
  });
}