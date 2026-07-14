import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const handler = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "admin-credentials",
      credentials: {
        adminId: { label: "아이디", type: "text" },
        password: { label: "비밀번호", type: "password" },
      },
      async authorize(credentials) {
        try {
          const adminId = credentials?.adminId ?? "";
          const password = credentials?.password ?? "";

          if (!adminId || !password) {
            console.error("[NextAuth] 아이디나 비밀번호가 비어있음");
            return null;
          }

          const res = await fetch(`${process.env.BACKEND_URL}/auth/admin/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ adminId, password }),
          });

          console.log("[NextAuth] 백엔드 응답 상태코드:", res.status);

          if (!res.ok) {
            // 에러 원인을 파악하기 위해 백엔드가 보낸 에러 메시지를 확인합니다.
            const errorText = await res.text(); 
            console.error("[NextAuth] 백엔드 에러 내용:", errorText);
            return null;
          }

          const data = await res.json();
          console.log("[NextAuth] 백엔드에서 받은 데이터:", data);

          // data.user가 존재하는지 방어 로직 추가
          if (!data || !data.user) {
             console.error("[NextAuth] 백엔드 응답에 user 객체가 없습니다.");
             return null;
          }

          return {
            id: String(data.user.id),
            adminId: data.user.adminId,
            name: data.user.name,
            role: data.user.role,
            accessToken: data.accessToken,
          } as any;
          
        } catch (e) {
          console.error("[NextAuth] authorize 내부 예외 발생:", e);
          return null;
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.adminId = (user as any).adminId;
        token.role = (user as any).role;
        token.accessToken = (user as any).accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).user.id = token.id;
      (session as any).user.adminId = token.adminId;
      (session as any).user.role = token.role;
      (session as any).accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };