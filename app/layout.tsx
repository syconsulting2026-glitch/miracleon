import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "./providers";
import LayoutShell from "@/components/LayoutShell";

/**
 * ✅ 서버 측에서 백엔드 API 데이터를 가져오는 함수
 * (generateMetadata는 서버에서 실행되므로 표준 fetch를 사용합니다)
 */
async function getSiteBasicData() {
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL; // 백엔드 주소 (예: http://localhost:4000)
  
  try {
    const res = await fetch(`${API_URL}/site-basic`, {
      cache: "no-store", // SSR처럼 매번 최신 정보를 가져오도록 설정
    });

    if (!res.ok) return null;
    const result = await res.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error("Failed to fetch site basic info:", error);
    return null;
  }
}

/**
 * ✅ 동적 메타데이터 생성
 */
export async function generateMetadata(): Promise<Metadata> {
  const siteInfo = await getSiteBasicData();
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  // 기본값 설정
  const title = siteInfo?.siteName || "미라클온";
  const description = siteInfo?.siteDescription || "미라클온 재능기부단체로서 당신에게 기적이 되어주겠습니다.";
  const favicon = siteInfo?.faviconImageUrl ? `${baseUrl}${siteInfo.faviconImageUrl}` : "/icon.ico";
  const ogImage = siteInfo?.ogImageUrl ? `${baseUrl}${siteInfo.ogImageUrl}` : "/og-image.png";

  return {
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description: description,
    icons: {
      icon: favicon,
      shortcut: favicon,
    },
    robots: {
      index: siteInfo?.isPublic ?? true,
      follow: siteInfo?.isPublic ?? true,
    },
    openGraph: {
      title: title,
      description: description,
      url: siteInfo?.siteUrl || "https://miracleon.org",
      images: [{ url: ogImage }],
      type: "website",
    },
  };
}

/**
 * ✅ 뷰포트 설정
 */
export const viewport: Viewport = {
  themeColor: "#7dd3fc",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-[#070b14] text-white">
        {/* Providers 내부에서 QueryClient가 설정되어 있으므로 하위 컴포넌트에서 useQuery 사용 가능 */}
        <Providers>
          <LayoutShell>{children}</LayoutShell>
        </Providers>
      </body>
    </html>
  );
}