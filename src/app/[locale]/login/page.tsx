'use client'

import React from 'react'
import { useScopedI18n } from '~/libs/locales/client'

export default function LoginPage() {
  const scopedT = useScopedI18n('hello')

  return <div>Login page - {scopedT('world')}</div>
}
