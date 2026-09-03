import { DefaultSession } from "next-auth";

export type AccountType = "CUSTOMER" | "ADMIN";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      accountType: AccountType;
      role?: string; // present only for ADMIN accounts (SUPER_ADMIN | ADMIN | MANAGER)
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    accountType: AccountType;
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    accountType: AccountType;
    role?: string;
  }
}
