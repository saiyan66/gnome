import { DefaultSession } from "next-auth"

// Extend the built-in NextAuth session type to include fields added in session callback

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: "CUSTOMER" | "ADMIN"
    } & DefaultSession["user"]
  }
}