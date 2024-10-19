import { Metadata } from "next"
import React from "react"
import { I18nProviderClient } from "~/lib/locales/client"
import { getScopedI18n } from "~/lib/locales/server"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getScopedI18n("dashboard.metadata")

  return {
    title: t("title"),
    description: t("desc"),
  }
}

export default function DashboardLayout({
  params: { locale },
  children,
}: Readonly<{
  params: { locale: string }
  children: React.ReactNode
}>) {
  return <I18nProviderClient locale={locale}>{children}</I18nProviderClient>
}
