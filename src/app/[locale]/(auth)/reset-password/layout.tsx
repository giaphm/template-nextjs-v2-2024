import { Metadata } from "next"
import { setStaticParamsLocale } from "next-international/server"
import React from "react"
import { I18nProviderClient } from "~/lib/locales/client"
import { getI18n, getStaticParams } from "~/lib/locales/server"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getI18n()

  return {
    title: t("hello"),
    description: t("hello.world"),
  }
}

export function generateStaticParams() {
  return getStaticParams()
}

export default function ResetPasswordLayout({
  params: { locale },
  children,
}: Readonly<{
  params: { locale: string }
  children: React.ReactNode
}>) {
  setStaticParamsLocale(locale)

  return <I18nProviderClient locale={locale}>{children}</I18nProviderClient>
}
