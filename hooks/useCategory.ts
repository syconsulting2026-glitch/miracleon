import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// 프로젝트의 환경 변수 또는 백엔드 주소에 맞게 설정하세요.
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export type Category = {
  id: number;
  name: string;
  description: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

// 1. 과목 목록 조회 훅 (?activeOnly=true 대응)
export function useCategories(activeOnly = false) {
  return useQuery<Category[]>({
    queryKey: ["categories", activeOnly],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/category`, {
        params: { activeOnly },
      });
      return response.data.items;
    },
  });
}

// 2. 과목 등록 훅
export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<Category, "id" | "createdAt" | "updatedAt">) => {
      const response = await axios.post(`${API_URL}/category`, data);
      return response.data;
    },
    onSuccess: () => {
      // 목록 갱신 트리거
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

// 3. 과목 수정 훅
export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Category> }) => {
      const response = await axios.patch(`${API_URL}/category/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

// 4. 과목 삭제 훅
export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await axios.delete(`${API_URL}/category/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}