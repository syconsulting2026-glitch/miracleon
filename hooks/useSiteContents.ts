"use client";

import { useQuery } from "@tanstack/react-query";
import { getSiteContents } from "@/services/siteContent";
import { GetSiteContentsResponse } from "@/types/siteContent";

export const useSiteContents = () => {
  return useQuery<GetSiteContentsResponse, Error>({
    queryKey: ["site-contents"],
    queryFn: getSiteContents,
  });
};