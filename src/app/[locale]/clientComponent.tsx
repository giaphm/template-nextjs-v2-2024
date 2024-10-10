'use client'

import { useScopedI18n } from '~/libs/locales/client'

export default function ClientComponent() {
  const scopedT = useScopedI18n('hello')

  return <div>I am the Client Component! {scopedT('world')}</div>
}
