import { User } from "next-auth"
import { JWT } from "next-auth/jwt"

type UserId = string
type Provider = string | null

declare module "next-auth/jwt" {
  interface JWT {
    id: UserId
    provider?: Provider
  }
}

declare module "next-auth" {
  interface Session {
    user: User & {
      id: UserId
      provider?: Provider
    }
  }
}
