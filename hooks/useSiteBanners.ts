"use client";

import { useQuery } from "@tanstack/react-query";
import { getSiteBanners } from "@/services/siteBanner";
import { GetSiteBannersResponse } from "@/types/siteBanner";

export const useSiteBanners = () => {
  return useQuery<GetSiteBannersResponse, Error>({
    queryKey: ["site-banners"],
    queryFn: getSiteBanners,
    staleTime: 1000 * 60,
  });
};