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

          if (!adminId || !password) return null;

          const r = await fetch(`${process.env.BACKEND_URL}/auth/admin/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ adminId, password }),
          });

          console.log(r);

          if (!r.ok) return null;
          const data = await r.json();

          return {
            id: String(data.user.id),
            adminId: data.user.adminId,
            name: data.user.name,
            role: data.user.role,
            accessToken: data.accessToken,
          } as any;
        } catch (e) {
          console.error("[NextAuth] authorize error:", e);
          return null;
        }
      },
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