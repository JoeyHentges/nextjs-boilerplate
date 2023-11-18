"use client"

import { Session } from "next-auth"
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react"

interface SessionProviderProps {
  children: React.ReactNode
  session: Session
}

export function SessionProvider(props: SessionProviderProps) {
  const { children, session } = props
  return (
    <NextAuthSessionProvider session={session}>
      {children}
    </NextAuthSessionProvider>
  )
}
