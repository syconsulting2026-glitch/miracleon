"use client";

import SectionBanner from "@/components/SectionBanner";
import SiteContentRenderer from "@/components/site/SiteContentRender";
import { motion, Variants } from "framer-motion";


const BusinessPage = () => {
  return (
    <div className="-mt-16 bg-white text-gray-900">
      <SectionBanner category="주요사업" showNavigation={false} showPagination={false}/>
      <SiteContentRenderer category="주요사업" />
    </div>
  );
};

export default BusinessPage;