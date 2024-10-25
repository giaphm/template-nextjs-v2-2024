import { setStaticParamsLocale } from "next-international/server"
import React from "react"
import { I18nProviderClient } from "~/lib/locales/client"
import { getScopedI18n, getStaticParams } from "~/lib/locales/server"

export async function generateMetadata() {
  const scopedT = await getScopedI18n("verify-success")

  return {
    title: scopedT("metadata.title"),
    description: scopedT("metadata.desc"),
  }
}

export function generateStaticParams() {
  return getStaticParams()
}

export default function SignupLayout({
  params: { locale },
  children,
}: Readonly<{
  params: { locale: string }
  children: React.ReactNode
}>) {
  setStaticParamsLocale(locale)

  return <I18nProviderClient locale={locale}>{children}</I18nProviderClient>
}
