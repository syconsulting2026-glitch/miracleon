"use client";

import { useMutation } from "@tanstack/react-query";
import { saveSiteBanner } from "@/services/siteBanner";
import { SaveBannerPayload, SaveBannerResponse } from "@/types/siteBanner";

export const useSaveSiteBanner = () => {
  return useMutation<SaveBannerResponse, Error, SaveBannerPayload>({
    mutationFn: saveSiteBanner,
  });
};