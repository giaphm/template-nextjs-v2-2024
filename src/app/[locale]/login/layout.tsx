import React from 'react'
import { I18nProviderClient } from '~/libs/locales/client'

export default function SignInLayout({
  params: { locale },
  children,
}: Readonly<{
  params: { locale: string }
  children: React.ReactNode
}>) {
  // eslint-disable-next-line no-console
  console.log('layout _sign-in')

  return <I18nProviderClient locale={locale}>{children}</I18nProviderClient>
}
