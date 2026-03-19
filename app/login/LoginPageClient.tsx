"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";

export default function LoginPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();

  const callbackUrl = useMemo(
    () => searchParams.get("callbackUrl") || "/admin",
    [searchParams]
  );

  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      adminId,
      password,
      redirect: false,
      callbackUrl,
    });

    setLoading(false);

    if (!result || result.error) {
      setError("아이디 또는 비밀번호가 올바르지 않습니다.");
      return;
    }

    router.replace(result.url || callbackUrl);
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-white px-4 py-10 text-gray-900">
      <div className="mx-auto flex min-h-[80vh] max-w-md items-center justify-center">
        <div className="w-full rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">
          <div className="mb-8 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-gray-500">UNBOX ADMIN</p>
            <h1 className="mt-3 text-3xl font-semibold">관리자 로그인</h1>
            <p className="mt-2 text-sm text-gray-500">
              관리자 페이지 접근을 위해 로그인해 주세요.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="adminId" className="mb-2 block text-sm text-gray-600">
                아이디
              </label>
              <input
                id="adminId"
                type="text"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                autoComplete="username"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-sky-500"
                placeholder="관리자 아이디"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm text-gray-600">
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-sky-500"
                placeholder="비밀번호"
                required
              />
            </div>

            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-black px-4 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:opacity-60"
            >
              {loading ? "로그인 중..." : "로그인"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}