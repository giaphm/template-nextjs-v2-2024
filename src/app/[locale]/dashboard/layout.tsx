import { Metadata } from "next"
import { setStaticParamsLocale } from "next-international/server"
import React from "react"
import { I18nProviderClient } from "~/lib/locales/client"
import { getScopedI18n, getStaticParams } from "~/lib/locales/server"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getScopedI18n("dashboard.metadata")

  return {
    title: t("title"),
    description: t("desc"),
  }
}

export function generateStaticParams() {
  return getStaticParams()
}

export default function DashboardLayout({
  params: { locale },
  children,
}: Readonly<{
  params: { locale: string }
  children: React.ReactNode
}>) {
  setStaticParamsLocale(locale)

  return <I18nProviderClient locale={locale}>{children}</I18nProviderClient>
}
