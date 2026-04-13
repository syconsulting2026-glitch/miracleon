// hooks/useSiteBasic.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { SiteBasicForm } from "@/lib/variable";
import { api } from "@/lib/api";

// 1. 데이터 조회 훅
export const useSiteBasic = () => {
  return useQuery({
    queryKey: ["site-basic"],
    queryFn: async () => {
      const { data } = await api.get("/site-basic"); // 실제 API 엔드포인트
      return data.data; // 백엔드 응답 구조에 맞춰 조정
    },
  });
};

// 2. 데이터 저장 훅
export const useSaveSiteBasic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await api.post("/site-basic", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: (data) => {
      alert(data.message || "사이트 정보가 성공적으로 저장되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["site-basic"] }); // 데이터 동기화
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || "저장 중 오류가 발생했습니다.");
    },
  });
};