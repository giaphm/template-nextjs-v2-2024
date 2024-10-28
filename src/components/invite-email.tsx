import * as React from "react"

import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components"

import env from "~/env"
import { Group } from "~/lib/db/schema"
import { applicationName } from "~/app-config"

export const BASE_URL = env.HOST_NAME

export function InviteEmail({ group, token }: { group: Group; token: string }) {
  const previewText = `You're been invted to a group!`
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <React.Fragment>
          <Body className="mx-auto my-auto bg-white font-sans">
            <Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
              <Section className="mt-[32px]">
                <Img
                  src={`${BASE_URL}/group.jpeg`}
                  width="160"
                  height="48"
                  alt="StarterKit"
                  className="mx-auto my-0"
                />
              </Section>

              <Section className="mb-[32px] mt-[32px] text-center">
                <Text className="mb-8 text-[14px] font-medium leading-[24px] text-black">
                  You&apos; been invited to a group on groupfinder.com called{" "}
                  {group.name}. Click the link below to login and access your
                  group.
                </Text>

                <Text className="text-[14px] font-medium leading-[24px] text-black">
                  <Link
                    href={`${BASE_URL}/invites/${token}`}
                    target="_blank"
                    className="text-[#2754C5] underline"
                  >
                    Login to View Group
                  </Link>
                </Text>
              </Section>

              <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />

              <Text className="flex items-center justify-center text-[12px] leading-[24px] text-[#666666]">
                © 2024 {applicationName}. All rights reserved.
              </Text>
            </Container>
          </Body>
        </React.Fragment>
      </Tailwind>
    </Html>
  )
}
