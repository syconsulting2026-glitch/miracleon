"use client";

import SectionBanner from "@/components/SectionBanner";
import { motion, Variants } from "framer-motion";
import {
  Sparkles,
  Code2,
  HeartHandshake,
  Recycle,
  ArrowRight,
  Cpu,
  Users,
  Lightbulb,
} from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const stagger: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const values = [
  {
    icon: HeartHandshake,
    title: "함께하는 가치",
    desc: "혼자가 아닌 함께 배우고, 함께 성장하는 연결의 힘을 중요하게 생각합니다.",
  },
  {
    icon: Cpu,
    title: "기술의 선한 활용",
    desc: "기술은 더 많은 사람에게 기회를 주고, 사회를 따뜻하게 만드는 방향으로 쓰여야 합니다.",
  },
  {
    icon: Users,
    title: "지역과 사람 중심",
    desc: "모든 활동은 지역사회와 사람을 중심에 두고, 실질적인 도움이 되도록 설계합니다.",
  },
  {
    icon: Lightbulb,
    title: "작은 실천의 변화",
    desc: "작은 배움과 작은 행동이 결국 더 큰 변화로 이어진다고 믿습니다.",
  },
];

const Home = () => {
  return (
    <div className="-mt-16 bg-white text-gray-900">
      <SectionBanner category="메인" showNavigation={false} showPagination={false}/>
      {/* HERO */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.07),transparent_30%),radial-gradient(circle_at_top_right,rgba(251,146,60,0.06),transparent_30%),linear-gradient(to_bottom,rgba(249,250,251,0.7),rgba(255,255,255,0))]" />
        <div className="absolute left-1/2 top-24 h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-purple-100/60 blur-3xl" />

        <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-6 pt-28 pb-20 md:px-10">
          <motion.div
            className="grid w-full items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={fadeUp} className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white px-4 py-2 text-sm text-purple-700 shadow-sm">
                <Sparkles className="h-4 w-4 text-purple-500" />
                재능 기부로 기적을 연결하는 Miracle ON
              </div>

              <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl md:text-5xl">
                재능을 ON하면
                <br />
                따뜻함이 켜집니다.
                <br />
                <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                  따뜻함으로 만들어지는 기적
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-gray-600 sm:text-lg">
                Miracle ON은 재능기부를 통해 기술과 작은 실천이 사회를 바꾸고<br/>
                따뜻함을 나눌 수 있도록 만드는 커뮤니티입니다.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <a
                  href="#programs"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-purple-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-600"
                >
                  주요 활동 보기
                  <ArrowRight className="h-4 w-4" />
                </a>

                <a
                  href="#about"
                  className="inline-flex items-center justify-center rounded-2xl border border-purple-300 bg-white px-6 py-3 text-sm font-semibold text-purple-600 transition hover:bg-purple-50"
                >
                  UNBOX 소개
                </a>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="relative">
              <div className="relative mx-auto max-w-xl rounded-[32px] border border-gray-200 bg-white p-5 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
                    <Sparkles className="mb-4 h-8 w-8 text-purple-500" />
                    <h3 className="text-lg font-bold text-gray-900">스마트폰 활용 수업</h3>
                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      쉽게 배우고 활용할 수 있는 교육
                    </p>
                  </div>

                  <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
                    <Code2 className="mb-4 h-8 w-8 text-purple-500" />
                    <h3 className="text-lg font-bold text-gray-900">AI 활용 응용</h3>
                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      GPT, 제미나이, 코딩 등을 활용 응용 교육
                    </p>
                  </div>

                  <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:col-span-2">
                    <Recycle className="mb-4 h-8 w-8 text-purple-500" />
                    <h3 className="text-lg font-bold text-gray-900">생활 체육과 문화생활</h3>
                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      탁구, 캘리그라피 등 
                      생활 체육과 문화생활을 통해<br/>
                      건강한 삶을 위한 계획
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-3xl border border-gray-200 bg-gray-50 p-5">
                  <p className="text-sm leading-7 text-gray-600">
                    “기술은 더 멀리 가기 위한 도구가 아니라,
                    <br className="hidden sm:block" />
                    더 많은 사람과 함께 가기 위한 다리여야 합니다.”
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="relative border-t border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-24 md:px-10">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]"
          >
            <motion.div variants={fadeUp}>
              <p className="text-sm font-semibold tracking-[0.2em] text-purple-500">
                ABOUT Miracle ON
              </p>
              <h2 className="mt-4 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
                배움과 나눔,
                <br />
                따뜻한 기적을 만드는 곳
              </h2>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="rounded-[28px] border border-gray-200 bg-white p-7 shadow-sm"
            >
              <p className="text-base leading-8 text-gray-600">
                Miracle ON은 단순히 지식을 전달하는 곳이 아니라, 사람과 기술,
                지역사회와 환경을 연결하는 활동을 만들어 갑니다. 
                교육에서 끝나는 것이 아니라, 배운 기술을 이웃과 나누고 실제
                사회를 위한 실천으로 이어지게 하는 것이 Miracle ON이 지향하는
                방향입니다.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
      {/* VALUES */}
      <section className="relative border-y border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-24 md:px-10">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
          >
            <motion.div variants={fadeUp} className="mb-12">
              <p className="text-sm font-semibold tracking-[0.2em] text-purple-500">
                CORE VALUES
              </p>
              <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
                Miracle ON이 중요하게 생각하는 가치
              </h2>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {values.map((item, idx) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={idx}
                    variants={fadeUp}
                    className="rounded-[24px] border border-gray-200 bg-white p-6 shadow-sm"
                  >
                    <Icon className="mb-4 h-7 w-7 text-purple-500" />
                    <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-gray-600">
                      {item.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-gray-50">
        <div className="mx-auto max-w-5xl px-6 py-24 md:px-10">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            className="rounded-[32px] border border-gray-200 bg-white p-8 text-center shadow-sm md:p-12"
          >
            <p className="text-sm font-semibold tracking-[0.2em] text-purple-500">
              Miracle ON MESSAGE
            </p>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
              기술은 사람을 향할 때
              <br />
              가장 큰 가치를 만듭니다
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-gray-600">
              Miracle ON은 배우는 것에서 끝나지 않고, 나누고 실천하는 움직임으로
              이어지는 커뮤니티를 만들어 갑니다.
            </p>

            {/* <div className="mt-8 flex justify-center">
              <a
                href="#programs"
                className="inline-flex items-center gap-2 rounded-2xl bg-purple-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-600"
              >
                활동 살펴보기
                <ArrowRight className="h-4 w-4" />
              </a>
            </div> */}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;