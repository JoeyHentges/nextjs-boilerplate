import * as React from "react"
import { NextResponse } from "next/server"
import dayjs from "dayjs"
import { getServerSession } from "next-auth/next"
import { Resend } from "resend"
import { v4 as uuidv4 } from "uuid"
import * as z from "zod"

import { env } from "@/env.mjs"
import { siteConfig } from "@/config/site"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { AuthEmailTemplate } from "@/components/email-templates/auth-template"

const resend = new Resend(process.env.RESEND_API_KEY)

const postEmailSchema = z.object({
  to: z.string().email(),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    const json = await req.json()
    const body = postEmailSchema.parse(json)

    // create verificaiton token
    const tokenResp = await db.verificationToken.create({
      data: {
        identifier: body.to,
        token: uuidv4(),
        expires: dayjs().add(10, "minutes").toDate(),
      },
      select: {
        token: true,
      },
    })

    const data = await resend.emails.send({
      to: body.to,
      from: env.RESEND_SMTP_FROM,
      subject: `Verify your ${siteConfig.name} account email`,
      react: React.createElement(AuthEmailTemplate, {
        preview: `Verify your ${siteConfig.name} account email`,
        title: `Verify your ${siteConfig.name} account email`,
        description:
          "Your email verification link is below - click it and we'll help you get verified.",
        buttonText: "Verify email",
        actionUrl: `${env.NEXT_PUBLIC_APP_URL}/verify&token=${tokenResp.token}`,
      }),
    })

    return NextResponse.json(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.issues, { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}
