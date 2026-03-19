"use client";

import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";

type CaptchaResponse = {
  captchaId: string;
  image: string;
};

export const useCaptcha = () => {
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.get<CaptchaResponse>("/captcha");
      return data;
    },
  });
};