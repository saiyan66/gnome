import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"

export const { handlers, signIn, signOut, auth } = NextAuth({
  
  adapter: PrismaAdapter(db),   // adapter allows creating/reading/deleting session, account, and user rows.

  // stores session in DB, sends only the token to browser
  session: {
    strategy: "database",
  },


  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      // authorize() runs when the user submits the login form & return the user object if credentials are valid.

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Find the user by email
        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        })
        

          if (!user || !user.hashedPassword) {
          return null
        }


        // Compare submitted password against the stored hash
        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.hashedPassword
        )

        if (!passwordMatch) {
          return null
        }

        // Return the user — NextAuth creates the session from this
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],


  callbacks: {
    async session({ session, user }) {
 
      if (session.user) {
        session.user.id = user.id
        session.user.role = (user as any).role
      }
      return session
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",      // redirect auth errors to login page
  },
})