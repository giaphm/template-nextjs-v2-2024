'use client'

import { Loader2Icon } from 'lucide-react'

export function HeaderActionsFallback() {
  return (
    <div className="flex w-40 items-center justify-center">
      <Loader2Icon className="h-4 w-4 animate-spin" />
    </div>
  )
}
