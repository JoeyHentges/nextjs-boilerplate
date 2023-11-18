import * as React from "react"
import { NextResponse } from "next/server"
import { Resend } from "resend"
import * as z from "zod"

import { env } from "@/env.mjs"
import { siteConfig } from "@/config/site"
import { AuthEmailTemplate } from "@/components/email-templates/auth-template"

const resend = new Resend(process.env.RESEND_API_KEY)

const postEmailSchema = z.object({
  to: z.string().email(),
  templateData: z.object({
    actionUrl: z.string().url(),
  }),
})

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const body = postEmailSchema.parse(json)

    const data = await resend.emails.send({
      to: body.to,
      from: env.RESEND_SMTP_FROM,
      subject: `Activate your ${siteConfig.name} account`,
      react: React.createElement(AuthEmailTemplate, {
        preview: `Activate your ${siteConfig.name} account`,
        title: `Activate your ${siteConfig.name} account`,
        description:
          "Your account activation link is below - click it and we'll help you get signed in.",
        buttonText: `Activate ${siteConfig.name} account`,
        actionUrl: body.templateData.actionUrl,
      }),
    })
    console.log("data", data)

    return NextResponse.json(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.issues, { status: 422 })
    }
    console.log(error)

    return new Response(null, { status: 500 })
  }
}
