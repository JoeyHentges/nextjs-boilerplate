import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components"

import { env } from "@/env.mjs"
import { siteConfig } from "@/config/site"

interface AuthEmailTemplateProps {
  preview: string
  title: string
  description: string
  buttonText: string
  actionUrl: string
}

export const AuthEmailTemplate: React.FC<AuthEmailTemplateProps> = (props) => {
  const { preview, title, description, buttonText, actionUrl } = props

  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Tailwind>
        <Body className="m-auto bg-white font-sans">
          <Container className="max-w-[500px]">
            <Section className="flex justify-center">
              <Img
                src={`${env.NEXT_PUBLIC_APP_URL}/logo.svg`}
                width="45"
                height="45"
                alt="logo"
              />
            </Section>
            <Section className="my-5 flex rounded-md border border-solid border-[#d1d1d1] px-5">
              <Container className="text-center">
                <Heading
                  as="h2"
                  className="text-[21px] font-bold text-[#292929]"
                >
                  {title}
                </Heading>
                <Text className="text-[15px] text-[#3c3f44]">
                  {description}
                </Text>
                <Section className="mt-6">
                  <Button
                    className="rounded-[4px] bg-[#292929] px-6 py-3 text-[15px] font-medium text-white"
                    href={actionUrl}
                  >
                    {buttonText}
                  </Button>
                </Section>
                <Text className="text-[12px] text-[#3c3f44]">
                  If you didn&apos;t request this, please ignore this email.
                </Text>
              </Container>
            </Section>
            <Text className="text-center text-sm text-black">
              <Link href={`${env.NEXT_PUBLIC_APP_URL}`}>Help center</Link>・
              <Link href={`${env.NEXT_PUBLIC_APP_URL}`}>Contact us</Link>・
              <Link href={`${env.NEXT_PUBLIC_APP_URL}`}>Privacy policy</Link>
            </Text>
            <Text className="text-center text-[#828282]">
              © 2023 {siteConfig.name} ・ Minneapolis, MN 55401
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
