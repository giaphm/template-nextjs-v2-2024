import React from 'react'
import { Metadata } from 'next'
import { getCurrentUser } from '~/lib/auth'
import { redirect } from 'next/navigation'
import { PATHS } from '~/app-config'
import SignUp from './_components/sign-up'

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication forms built using the components.',
}

export default async function SignUpPage() {
  const user = await getCurrentUser()
  if (user) {
    redirect(PATHS.Dashboard)
  }

  return <SignUp />
}
