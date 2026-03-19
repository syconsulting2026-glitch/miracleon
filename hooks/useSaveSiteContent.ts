"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveSiteContent } from "@/services/siteContent";
import {
  SaveSiteContentPayload,
  SaveSiteContentResponse,
} from "@/types/siteContent";

export const useSaveSiteContent = () => {
  const queryClient = useQueryClient();

  return useMutation<SaveSiteContentResponse, Error, SaveSiteContentPayload>({
    mutationFn: saveSiteContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-contents"] });
    },
  });
};