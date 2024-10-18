import React from 'react'
import { Metadata } from 'next'
import { Button } from '~/components/ui/button'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication forms built using the components.',
}

export default async function SignUpPage() {
  return (
    <div className="mx-auto max-w-[400px] space-y-6 py-24">
      <h1 className="text-4xl font-bold">Email failed verified!</h1>
      <p className="text-xl">You need verify your email again to log in!</p>

      <Button asChild>
        <Link href="/login">Log In</Link>
      </Button>
    </div>
  )
}
