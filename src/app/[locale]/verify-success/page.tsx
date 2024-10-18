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
    <div className="mx-auto max-w-[500px] space-y-6 py-24">
      <h1 className="text-4xl font-bold">Email successfully verified!</h1>
      <p className="text-xl">You can sign in to your account now!</p>

      <Button asChild className="text-center">
        <Link href="/login">Log In</Link>
      </Button>
    </div>
  )
}
