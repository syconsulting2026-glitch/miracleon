"use client";

import SectionBanner from "@/components/SectionBanner";
import SiteContentRenderer from "@/components/site/SiteContentRender";
import { motion, Variants } from "framer-motion";


const AboutPage = () => {
  return (
    <div className="-mt-16 bg-white text-gray-900">
      <SectionBanner category="미라클온소개" showNavigation={false} showPagination={false}/>
      <SiteContentRenderer category="미라클온소개" />
    </div>
  );
};

export default AboutPage;