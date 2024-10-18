import React from 'react'
import { Metadata } from 'next'
import { getCurrentUser } from '~/lib/auth'
import { redirect } from 'next/navigation'
import { PATHS } from '~/app-config'
import LogIn from './_components/log-in'

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication forms built using the components.',
}

export default async function LogInPage() {
  const user = await getCurrentUser()
  console.log('user', user)
  if (user) {
    redirect(PATHS.Dashboard)
  }

  return <LogIn />
}
