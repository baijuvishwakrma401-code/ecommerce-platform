import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { loginSchema } from "@/lib/validation/auth";

/**
 * Two entirely separate credential providers, deliberately not sharing a
 * lookup table or a login route:
 *   - "customer-login" reads from `users`
 *   - "admin-login"    reads from `admin_users` and attaches the role
 *
 * This keeps a compromised/weak customer account from ever being able to
 * reach an admin session, and lets /admin enforce accountType === "ADMIN"
 * everywhere (see src/middleware.ts).
 */
export const authOptions: AuthOptions = {
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 }, // 7 days
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      id: "customer-login",
      name: "Customer",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(raw) {
        const parsed = loginSchema.safeParse(raw);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.isActive) return null;

        const valid = await verifyPassword(password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          accountType: "CUSTOMER",
        };
      },
    }),
    CredentialsProvider({
      id: "admin-login",
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(raw) {
        const parsed = loginSchema.safeParse(raw);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;

        const admin = await prisma.adminUser.findUnique({
          where: { email },
          include: { role: true },
        });

        if (!admin || !admin.isActive) {
          await prisma.auditLog.create({
            data: { actorId: email, actorType: "ADMIN", action: "ADMIN_LOGIN_FAILED" },
          });
          return null;
        }

        const valid = await verifyPassword(password, admin.passwordHash);
        if (!valid) {
          await prisma.auditLog.create({
            data: { actorId: admin.id, actorType: "ADMIN", action: "ADMIN_LOGIN_FAILED" },
          });
          return null;
        }

        await prisma.adminUser.update({
          where: { id: admin.id },
          data: { lastLoginAt: new Date() },
        });
        await prisma.auditLog.create({
          data: { actorId: admin.id, actorType: "ADMIN", action: "ADMIN_LOGIN_SUCCESS" },
        });

        return {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          accountType: "ADMIN",
          role: admin.role.name,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.accountType = user.accountType;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.accountType = token.accountType;
      session.user.role = token.role;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
