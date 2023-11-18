import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import EmailProvider from "next-auth/providers/email"
import GoogleProvider from "next-auth/providers/google"

import { env } from "@/env.mjs"
import { db } from "@/lib/db"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    EmailProvider({
      from: env.RESEND_SMTP_FROM,
      sendVerificationRequest: async ({ identifier, url }) => {
        const user = await db.user.findUnique({
          where: {
            email: identifier,
          },
          select: {
            emailVerified: true,
          },
        })

        const template = user?.emailVerified ? "sign-in" : "activate"

        try {
          await fetch(`${env.NEXT_PUBLIC_APP_URL}/api/email/${template}`, {
            method: "POST",
            body: JSON.stringify({
              to: identifier,
              templateData: {
                actionUrl: url,
              },
            }),
          })
        } catch (error) {
          throw new Error("Authentication email error")
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, session, account, trigger }) {
      const dbUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
      })

      if (trigger === "update" && session?.name) {
        token.name = session.name
      }

      if (!dbUser || !account) {
        if (user) {
          token.id = user?.id
        }
        return token
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
        provider: account.provider,
      }
    },
    async session({ token, session }) {
      if (token) {
        session.user = {
          id: token.id,
          name: token.name,
          email: token.email,
          image: token.picture,
          provider: token.provider,
        }
      }

      return session
    },
  },
}
