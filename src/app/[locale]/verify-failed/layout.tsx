import React from 'react'
import { I18nProviderClient } from '~/lib/locales/client'
import { getScopedI18n } from '~/lib/locales/server'

export async function generateMetadata() {
  const scopedT = await getScopedI18n('verify-failed')

  return {
    title: scopedT('metadata.title'),
    description: scopedT('metadata.desc'),
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
