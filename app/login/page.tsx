import { Suspense } from "react";
import LoginPageClient from "./LoginPageClient";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageFallback />}>
      <LoginPageClient />
    </Suspense>
  );
}

function LoginPageFallback() {
  return (
    <main className="min-h-screen bg-white px-4 py-10 text-gray-900">
      <div className="mx-auto flex min-h-[80vh] max-w-md items-center justify-center">
        <div className="w-full rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">
          <div className="mb-8 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-gray-500">
              MIRACLEON ADMIN
            </p>
            <h1 className="mt-3 text-3xl font-semibold">관리자 로그인</h1>
            <p className="mt-2 text-sm text-gray-500">페이지를 불러오는 중입니다.</p>
          </div>
        </div>
      </div>
    </main>
  );
}