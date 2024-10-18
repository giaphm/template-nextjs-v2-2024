import { Metadata } from 'next'
import React from 'react'
import { I18nProviderClient } from '~/lib/locales/client'
import { getI18n } from '~/lib/locales/server'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getI18n()

  return {
    title: t('hello'),
    description: t('hello.world'),
  }
}

export default function SignupLayout({
  params: { locale },
  children,
}: Readonly<{
  params: { locale: string }
  children: React.ReactNode
}>) {
  return <I18nProviderClient locale={locale}>{children}</I18nProviderClient>
}
