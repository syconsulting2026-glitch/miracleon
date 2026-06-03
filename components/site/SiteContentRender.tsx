"use client";

import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { useSiteContents } from "@/hooks/useSiteContents";
import { ContentCategory } from "@/types/siteContent";

type Props = {
  category: ContentCategory;
};

type TextAlign = "left" | "center" | "right";
type AnimationType =
  | "none"
  | "fadeUp"
  | "fadeIn"
  | "slideLeft"
  | "slideRight"
  | "zoomIn";

const animationVariantsMap: Record<AnimationType, Variants> = {
  none: {
    hidden: { opacity: 1, x: 0, y: 0, scale: 1 },
    show: { opacity: 1, x: 0, y: 0, scale: 1, transition: { duration: 0 } },
  },
  fadeUp: {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
  },
  slideLeft: {
    hidden: { opacity: 0, x: -40 },
    show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
  },
  slideRight: {
    hidden: { opacity: 0, x: 40 },
    show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
  },
  zoomIn: {
    hidden: { opacity: 0, scale: 0.94 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.55, ease: "easeOut" } },
  },
};

const textAlignClassMap: Record<TextAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const contentAlignClassMap: Record<TextAlign, string> = {
  left: "items-start",
  center: "items-center",
  right: "items-end",
};

function AnimatedSection({
  animation,
  children,
}: {
  animation: AnimationType;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={animationVariantsMap[animation] ?? animationVariantsMap.fadeUp}
    >
      {children}
    </motion.div>
  );
}

export default function SiteContentRenderer({ category }: Props) {
  const { data, isLoading, isError } = useSiteContents();
  console.log(data);

  if (isLoading) {
    return (
      <section className="px-6 py-16 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl text-sm text-gray-500">
          내용을 불러오는 중입니다...
        </div>
      </section>
    );
  }

  if (isError || !data?.success) {
    return (
      <section className="px-6 py-16 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl text-sm text-red-500">
          내용을 불러오지 못했습니다.
        </div>
      </section>
    );
  }
  const getTextAlignClass = (align: TextAlign) => {
        if (align === "left") return "text-left items-start";
        if (align === "right") return "text-right items-end";
        return "text-center items-center";
    };
  const page = data.data.find((item) => item.category === category);

  if (!page || !page.sections?.length) {
    return null;
  }

  return (
    <div className="bg-white">
      {page.sections.map((section) => {
        const align = (section.align ?? "left") as TextAlign;
        const animation = (section.animation ?? "fadeUp") as AnimationType;


        if (section.type === "text") {
          

          return (
            <AnimatedSection key={section.id} animation={animation}>
              <section className={`px-6 py-16 sm:px-10 lg:px-16`} style={{backgroundColor:section.backgroundColor??'#ffffff'}}>
                <div
                  className={[
                    "mx-auto flex max-w-4xl flex-col",
                    textAlignClassMap[align],
                    contentAlignClassMap[align],
                    align === "center" ? "mx-auto" : "",
                    align === "right" ? "ml-auto" : "",
                  ].join(" ")}
                >
                  {section.eyebrow && (
                    <p
                      className="mb-3 text-xs font-semibold uppercase tracking-[0.24em]"
                      style={{
                        color: section.backgroundColor === "dark" ? "#FFFFFF99" : "#F97316",
                      }}
                    >
                      {section.eyebrow}
                    </p>
                  )}

                  <h2
                    className="text-3xl font-bold tracking-tight sm:text-4xl"
                    style={{ color: section.titleColor ?? "#111827" }}
                  >
                    {section.title}
                  </h2>

                  <p
                    className="mt-4 whitespace-pre-line text-base leading-7"
                    style={{ color: section.descriptionColor ?? "#4B5563" }}
                  >
                    {section.description}
                  </p>
                </div>
              </section>
            </AnimatedSection>
          );
        }

       if (section.type === "imageText") {
          const textAlignClass =
            align === "center"
              ? "text-center items-center"
              : align === "right"
              ? "text-right items-end"
              : "text-left items-start";
              
          // imagePosition 설정값 가져오기
          const isLeft = section.imagePosition === "left";
          const isTop = section.imagePosition === "top";

          // flex-1과 aspect-video(또는 min-h)를 추가하여 비율 유지
          const imageBlock = (
            <div className="relative flex-1 w-full min-h-[280px] overflow-hidden rounded-3xl bg-gray-100 aspect-video lg:aspect-auto">
              {section.imageUrl ? (
                <Image
                  src={section.imageUrl}
                  alt={section.title || "section image"}
                  fill
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full min-h-[280px] items-center justify-center text-sm text-gray-400">
                  이미지가 없습니다
                </div>
              )}
            </div>
          );

          // flex-1을 추가하여 이미지와 텍스트가 공간을 반씩 나눠 가지도록 설정
          const textBlock = (
            <div className={`flex flex-1 flex-col justify-center w-full ${textAlignClass}`}>
              <h3
                className="text-2xl font-bold break-keep sm:text-3xl"
                style={{ color: section.titleColor ?? "#111827" }}
              >
                {section.title}
              </h3>

              <p
                className="mt-4 whitespace-pre-line break-keep leading-7"
                style={{ color: section.descriptionColor ?? "#4B5563" }}
              >
                {section.description}
              </p>

              {section.buttonText && (
                <a
                  href={section.buttonLink || "#"}
                  className="mt-6 inline-flex w-fit rounded-xl px-5 py-3 text-sm font-semibold"
                  style={{
                    backgroundColor: section.buttonBgColor ?? "#F97316",
                    color: section.buttonTextColor ?? "#FFFFFF",
                  }}
                >
                  {section.buttonText}
                </a>
              )}
            </div>
          );

          // 프리뷰 화면과 동일하게 imagePosition에 따른 flex 클래스 동적 생성
          const containerLayoutClass = isTop
            ? "flex-col" // 이미지가 위 (수직 정렬)
            : isLeft
            ? "flex-col lg:flex-row" // 이미지가 왼쪽 (모바일은 수직, PC는 좌우)
            : "flex-col lg:flex-row-reverse"; // 이미지가 오른쪽 (모바일은 수직, PC는 우좌)

          return (
            <AnimatedSection key={section.id} animation={animation}>
              <section className="px-6 py-16 sm:px-10 lg:px-16" style={{ backgroundColor: section.backgroundColor ?? '#ffffff' }}>
                {/* 기존 grid 대신 flex와 동적 layout 클래스 적용 */}
                <div className={`mx-auto flex max-w-6xl gap-8 items-center ${containerLayoutClass}`}>
                  {/* flex-row-reverse가 순서를 뒤집어주므로 항상 image -> text 순으로 배치해도 됩니다 */}
                  {imageBlock}
                  {textBlock}
                </div>
              </section>
            </AnimatedSection>
          );
        }

        if (section.type === "cta") {
          const themeClass =
            section.theme === "orange" ? "bg-orange-500" : "bg-gray-900";

          return (
            <AnimatedSection key={section.id} animation={animation}>
              <section className="bg-white px-6 py-16 sm:px-10 lg:px-16">
                <div className="mx-auto max-w-6xl">
                  <div className={`rounded-3xl px-6 py-10 sm:px-10 `} style={{backgroundColor:section.backgroundColor??'#ffffff'}}>
                    <div
                      className={[
                        "flex flex-col",
                        textAlignClassMap[align],
                        contentAlignClassMap[align],
                      ].join(" ")}
                    >
                      <h3
                        className="text-2xl font-bold sm:text-3xl"
                        style={{ color: section.titleColor ?? "#FFFFFF" }}
                      >
                        {section.title}
                      </h3>

                      <p
                        className="mt-4 max-w-2xl leading-7"
                        style={{ color: section.descriptionColor ?? "#F3F4F6" }}
                      >
                        {section.description}
                      </p>

                      {section.buttonText && (
                        <a
                          href={section.buttonLink || "#"}
                          className="mt-6 inline-flex rounded-xl px-5 py-3 text-sm font-semibold"
                          style={{
                            backgroundColor: section.buttonBgColor ?? "#FFFFFF",
                            color: section.buttonTextColor ?? "#111827",
                          }}
                        >
                          {section.buttonText}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            </AnimatedSection>
          );
        }

        if (section.type === "titleImage") {
          const textAlignClass =
            align === "center"
              ? "text-center items-center"
              : align === "right"
              ? "text-right items-end"
              : "text-left items-start";


          return (
            <AnimatedSection key={section.id} animation={animation}>
              <section key={section.id} className="relative py-24 px-6 overflow-hidden min-h-[300px] flex items-center">
                  {section.imageUrl && <Image src={section.imageUrl} alt="배경" fill className="object-cover z-0" />}
                  <div className="absolute inset-0 bg-black/40 z-0" />
                  <div className={`relative z-10 max-w-4xl mx-auto w-full flex flex-col ${textAlignClass}`} >
                      <h2 className="text-3xl font-black mb-4" style={{ color: section.titleColor ?? undefined }}>{section.title}</h2>
                      <p className="text-sm font-medium leading-relaxed whitespace-pre-line" style={{ color: section.descriptionColor ?? undefined }}>{section.description}</p>
                  </div>
              </section>
            </AnimatedSection>
          );
        }

        if (section.type === "cardGrid") {
          

          const columns =
            "grid-cols-1 md:grid-cols-2 lg:grid-cols-" +
            Math.min(Math.max(section.pcColumns ?? 4, 1), 4);

          return (
            <AnimatedSection key={section.id} animation={animation}>
              <section className={`px-6 py-16 sm:px-10 lg:px-16`} style={{backgroundColor:section.backgroundColor??'#ffffff'}}>
                <div
                  className={[
                    "mx-auto flex max-w-6xl flex-col",
                    textAlignClassMap[align],
                    contentAlignClassMap[align],
                  ].join(" ")}
                >
                  {section.eyebrow && (
                    <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                      {section.eyebrow}
                    </p>
                  )}

                  <h2
                    className="text-3xl font-bold sm:text-4xl"
                    style={{ color: section.titleColor ?? "#1D4ED8" }}
                  >
                    {section.title}
                  </h2>

                  <p
                    className="mt-4 max-w-3xl whitespace-pre-line leading-7"
                    style={{ color: section.descriptionColor ?? "#475569" }}
                  >
                    {section.description}
                  </p>
                </div>

                <div
                  className={`mx-auto mt-8 grid max-w-6xl ${columns}`}
                  style={{
                    rowGap: `${section.rowGap ?? 24}px`,
                    columnGap: `${section.columnGap ?? 24}px`,
                  }}
                >
                  {(section.items ?? []).map((item) => (
                    <div
                      key={item.id}
                      className="rounded-3xl border border-gray-200 p-6 shadow-sm"
                      style={{ backgroundColor: item.cardBgColor ?? "#FFFFFF" }}
                    >
                      {item.iconUrl ? (
                        <div className="mb-5 flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-gray-100">
                          <img
                            src={item.iconUrl}
                            alt={item.title || "icon"}
                            className="h-8 w-8 object-contain"
                          />
                        </div>
                      ) : null}

                      <h3
                        className="text-xl font-bold"
                        style={{ color: item.titleColor ?? "#0F172A" }}
                      >
                        {item.title}
                      </h3>

                      <p
                        className="mt-4 whitespace-pre-line leading-7"
                        style={{ color: item.descriptionColor ?? "#475569" }}
                      >
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </AnimatedSection>
          );
        }

        return null;
      })}
    </div>
  );
}