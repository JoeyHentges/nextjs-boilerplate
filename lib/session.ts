import { User } from "next-auth"
import { getServerSession } from "next-auth/next"

import { authOptions } from "@/lib/auth"

type ServerSessionUser = User & {
  id: string
  provider?: string | null | undefined
  emailVerified?: Date | null | undefined
}

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)

  return session?.user as ServerSessionUser
}

export async function getSession() {
  return await getServerSession(authOptions)
}
