import React from 'react'
import { I18nProviderClient } from '~/lib/locales/client'

export default function LoginLayout({
  params: { locale },
  children,
}: Readonly<{
  params: { locale: string }
  children: React.ReactNode
}>) {
  return <I18nProviderClient locale={locale}>{children}</I18nProviderClient>
}
