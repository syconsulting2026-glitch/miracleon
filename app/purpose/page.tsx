"use client";

import SectionBanner from "@/components/SectionBanner";
import SiteContentRenderer from "@/components/site/SiteContentRender";
import { motion, Variants } from "framer-motion";


const PurposePage = () => {
  return (
    <div className="-mt-16 bg-white text-gray-900">
      <SectionBanner category="설립목적" showNavigation={false} showPagination={false}/>
      <SiteContentRenderer category="설립목적" />
    </div>
  );
};

export default PurposePage;