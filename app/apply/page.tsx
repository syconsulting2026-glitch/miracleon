"use client";

import { useEffect, useMemo, useState } from "react";
import { useCreateApply } from "@/hooks/useApply";
import type { ApplyClassType } from "@/types/apply";
import { useCaptcha } from "@/hooks/useCaptcha";

type HowFound =
  | "홈페이지"
  | "지인추천"
  | "인스타그램"
  | "유튜브"
  | "검색"
  | "현수막·전단"
  | "기타";

const PRIVACY_POLICY_TEXT = `개인정보처리방침(수강 신청)

MIRACLE(이하 “회사”)은 「개인정보 보호법」 등 관련 법령을 준수하며, 수강 신청 및 상담 안내를 위해 이용자의 개인정보를 안전하게 처리합니다.

1. 수집하는 개인정보 항목
- 필수 항목: 이름, 연락처(휴대전화), 거주지역(구/군 및 동/읍/면), 지원동기, 유입경로(알게 된 계기)
- 자동 수집 항목(서비스 이용 과정에서 생성될 수 있음): 접속 로그, IP, 기기정보(브라우저/OS), 쿠키(사용 시)

2. 개인정보 수집 및 이용 목적
1) 수강 신청 접수 확인 및 본인 식별
2) 수업/상담 일정 안내 및 연락(전화, 문자, 메신저 등)
3) 수강 관련 안내, 공지, 운영을 위한 커뮤니케이션
4) 서비스 개선을 위한 통계 및 분석(개인 식별이 최소화된 형태)

3. 개인정보 보유 및 이용 기간
- 수집·이용 목적 달성 시까지 보유·이용 후 지체 없이 파기합니다.
- 다만, 수강 신청/상담 이력 관리를 위해 신청일로부터 1년 보관 후 파기할 수 있습니다.
- 관계 법령에 따라 보관이 필요한 경우 해당 법령에서 정한 기간 동안 보관합니다.

4. 개인정보 제3자 제공
회사는 이용자의 개인정보를 원칙적으로 제3자에게 제공하지 않습니다.
다만, 이용자가 사전에 동의한 경우 또는 법령에 근거한 요청이 있는 경우 예외로 합니다.

5. 개인정보 처리 위탁
회사는 원활한 서비스 제공을 위해 개인정보 처리 업무를 외부에 위탁할 수 있으며,
위탁 시 관련 법령에 따라 계약 및 관리·감독을 수행합니다.
(현재 위탁 여부/수탁사/업무는 운영 정책에 따라 별도 고지합니다.)

6. 이용자의 권리
이용자는 언제든지 개인정보 열람, 정정, 삭제, 처리정지를 요청할 수 있습니다.
요청은 회사의 문의 채널을 통해 접수할 수 있으며 지체 없이 조치합니다.
단, 법령에 따라 일부 권리 행사가 제한될 수 있습니다.

7. 파기 절차 및 방법
- 파기 절차: 보유기간 경과 또는 목적 달성 시 파기 대상 선정 후 파기
- 파기 방법: 전자 파일은 복구 불가능한 방식으로 삭제, 출력물은 분쇄 또는 소각

8. 안전성 확보 조치
접근 권한 최소화, 취급자 교육, 기술적 보호조치(보안프로그램/암호화 등)를 적용합니다.

9. 고지 및 개정
본 방침은 시행일로부터 적용되며, 내용 변경 시 홈페이지 등을 통해 고지합니다.
시행일: 2026-01-22
`;

type FormState = {
  classType: ApplyClassType | "";
  name: string;
  phone: string;
  district: string;
  neighborhoodDetail: string;
  motivation: string;
  recommender: string;
  howFound: HowFound | "";
  privacyAgree: boolean;
};

const formatPhone = (raw: string) => {
  const digits = raw.replace(/[^0-9]/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
};

export default function ApplyPage() {
  const createMutation = useCreateApply();
  const captchaMutation = useCaptcha();

  const busanAreas = useMemo(
    () => [
      "중구",
      "서구",
      "동구",
      "영도구",
      "부산진구",
      "동래구",
      "남구",
      "북구",
      "해운대구",
      "사하구",
      "금정구",
      "강서구",
      "연제구",
      "수영구",
      "사상구",
      "기장군",
    ],
    []
  );

  const howFoundOptions: HowFound[] = useMemo(
    () => ["홈페이지", "지인추천", "인스타그램", "유튜브", "검색", "현수막·전단", "기타"],
    []
  );

  const [form, setForm] = useState<FormState>({
    classType: "",
    name: "",
    phone: "",
    district: "",
    neighborhoodDetail: "",
    motivation: "",
    recommender: "",
    howFound: "",
    privacyAgree: false,
  });

  const [captchaImage, setCaptchaImage] = useState("");
  const [captchaId, setCaptchaId] = useState("");
  const [captchaText, setCaptchaText] = useState("");
  const [startedAt, setStartedAt] = useState(0);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const errors = useMemo(() => {
    const e: Partial<Record<keyof FormState | "captcha", string>> = {};

    if (!form.classType) e.classType = "수업 종류를 선택해 주세요.";
    if (!form.name.trim()) e.name = "이름을 입력해 주세요.";
    if (form.phone.replace(/[^0-9]/g, "").length < 10) e.phone = "연락처를 확인해 주세요.";
    if (!form.district) e.district = "구/군을 선택해 주세요.";
    if (!form.neighborhoodDetail.trim()) e.neighborhoodDetail = "동/읍/면을 입력해 주세요.";
    if (!form.motivation.trim()) e.motivation = "지원동기를 입력해 주세요.";
    if (!form.howFound) e.howFound = "알게 된 계기를 선택해 주세요.";

    if (form.howFound === "지인추천" && !form.recommender.trim()) {
      e.recommender = "추천인을 입력해 주세요.";
    }

    if (!form.privacyAgree) {
      e.privacyAgree = "개인정보 동의가 필요합니다.";
    }

    if (!captchaId) {
      e.captcha = "자동입력방지를 다시 불러와 주세요.";
    } else if (!captchaText.trim()) {
      e.captcha = "자동입력방지 문자를 입력해 주세요.";
    }

    return e;
  }, [form, captchaId, captchaText]);

  const loadCaptcha = async () => {
    try {
      const data = await captchaMutation.mutateAsync();
      setCaptchaId(data.captchaId);
      setCaptchaImage(data.image);
      setCaptchaText("");
      setStartedAt(Date.now());
    } catch (error: any) {
      alert(error?.response?.data?.message || "자동입력방지를 불러오지 못했습니다.");
    }
  };

  useEffect(() => {
    loadCaptcha();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (Object.keys(errors).length > 0) {
      alert("입력값을 확인해 주세요.");
      return;
    }

    if (!startedAt || Date.now() - startedAt < 1500) {
      alert("자동입력방지를 다시 확인해 주세요.");
      return;
    }

    try {
      await createMutation.mutateAsync({
        classType: form.classType as ApplyClassType,
        name: form.name.trim(),
        phone: form.phone,
        phoneDigits: form.phone.replace(/[^0-9]/g, ""),
        district: form.district,
        neighborhoodDetail: form.neighborhoodDetail.trim(),
        address: `${form.district} ${form.neighborhoodDetail}`.trim(),
        motivation: form.motivation.trim(),
        howFound: form.howFound,
        recommender: form.recommender.trim(),
        privacyAgree: form.privacyAgree,

        // ✅ 자동입력방지 전송
        captchaId,
        captchaText: captchaText.trim(),
        captchaStartedAt: startedAt,
      });

      alert("수강신청이 접수되었습니다.");

      setForm({
        classType: "",
        name: "",
        phone: "",
        district: "",
        neighborhoodDetail: "",
        motivation: "",
        recommender: "",
        howFound: "",
        privacyAgree: false,
      });

      await loadCaptcha();
    } catch (error: any) {
      alert(error?.response?.data?.message || "신청 접수에 실패했습니다.");
      await loadCaptcha();
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold text-blue-600">MIRACLEON</p>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">수강 신청</h1>
        <p className="mt-2 text-sm text-gray-500">AI 또는 CODING 수업 신청서를 작성해 주세요.</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-6">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="수업 종류" required error={errors.classType}>
              <select
                value={form.classType}
                onChange={(e) => setField("classType", e.target.value as ApplyClassType)}
                className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none"
              >
                <option value="">선택</option>
                <option value="AI">AI</option>
                <option value="CODING">코딩</option>
              </select>
            </Field>

            <Field label="이름" required error={errors.name}>
              <input
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none"
              />
            </Field>

            <Field label="연락처" required error={errors.phone}>
              <input
                value={form.phone}
                onChange={(e) => setField("phone", formatPhone(e.target.value))}
                placeholder="010-0000-0000"
                className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none"
              />
            </Field>

            <Field label="구/군" required error={errors.district}>
              <select
                value={form.district}
                onChange={(e) => setField("district", e.target.value)}
                className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none"
              >
                <option value="">선택</option>
                {busanAreas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="동/읍/면" required error={errors.neighborhoodDetail}>
              <input
                value={form.neighborhoodDetail}
                onChange={(e) => setField("neighborhoodDetail", e.target.value)}
                className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none"
              />
            </Field>

            <Field label="알게 된 계기" required error={errors.howFound}>
              <select
                value={form.howFound}
                onChange={(e) => setField("howFound", e.target.value as HowFound)}
                className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none"
              >
                <option value="">선택</option>
                {howFoundOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {form.howFound === "지인추천" && (
            <Field label="추천인" required error={errors.recommender}>
              <input
                value={form.recommender}
                onChange={(e) => setField("recommender", e.target.value)}
                className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none"
              />
            </Field>
          )}

          <Field label="지원동기" required error={errors.motivation}>
            <textarea
              value={form.motivation}
              onChange={(e) => setField("motivation", e.target.value)}
              rows={6}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none"
            />
          </Field>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded-xl border border-neutral-200 bg-white p-3 text-xs leading-relaxed text-neutral-700">
              {PRIVACY_POLICY_TEXT}
            </pre>

            <label className="mt-3 flex items-start gap-3 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.privacyAgree}
                onChange={(e) => setField("privacyAgree", e.target.checked)}
                className="mt-1 h-4 w-4"
              />
              <span>
                개인정보 수집 및 이용에 동의합니다.
                {errors.privacyAgree && (
                  <span className="mt-1 block text-xs text-red-500">{errors.privacyAgree}</span>
                )}
              </span>
            </label>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <label className="mb-3 block text-sm font-semibold text-gray-700">
              자동입력방지
            </label>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="overflow-hidden rounded-lg border border-gray-300 bg-white">
                {captchaImage ? (
                  <img
                    src={captchaImage}
                    alt="자동입력방지"
                    className="h-[60px] w-[180px]"
                  />
                ) : (
                  <div className="flex h-[60px] w-[180px] items-center justify-center text-sm text-gray-400">
                    로딩중...
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={loadCaptcha}
                className="inline-flex h-12 items-center justify-center rounded-xl border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700"
              >
                새로고침
              </button>
            </div>

            <input
              type="text"
              value={captchaText}
              onChange={(e) => setCaptchaText(e.target.value)}
              placeholder="보이는 문자를 입력하세요"
              className="mt-3 h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none focus:border-gray-400 sm:max-w-[260px]"
            />

            {"captcha" in errors && errors.captcha && (
              <p className="mt-2 text-xs text-red-500">{errors.captcha}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={createMutation.isPending}
            className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-gray-900 text-sm font-semibold text-white disabled:opacity-60"
          >
            {createMutation.isPending ? "접수 중..." : "수강 신청하기"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-800">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
}