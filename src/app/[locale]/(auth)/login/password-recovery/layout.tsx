import React from 'react'
import { I18nProviderClient } from '~/lib/locales/client'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication forms built using the components.',
}

export default function PasswordRecoveryLayout({
  params: { locale },
  children,
}: {
  params: { locale: string }
  children: React.ReactNode
}): React.JSX.Element {
  return <I18nProviderClient locale={locale}>{children}</I18nProviderClient>
}
