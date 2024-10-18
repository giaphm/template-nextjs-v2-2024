'use client'

import { Input } from '~/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { pageTitleStyles } from '~/styles/common'
import { cn } from '~/lib/utils'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { Terminal } from 'lucide-react'
import Link from 'next/link'
import { Button } from '~/components/ui/button'
import { LoaderButton } from '~/components/loader-button'
import { useServerAction } from 'zsa-react'
import { z } from 'zod'
import { useToast } from '~/hooks/use-toast'
import NProgress from 'nprogress'
import { changePasswordAction } from './actions'

const resetPasswordSchema = z
  .object({
    password: z.string().min(1),
    token: z.string(),
    passwordConfirmation: z.string().min(1),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ['passwordConfirmation'],
  })

type ResetPasswordInput = z.infer<typeof resetPasswordSchema>

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { token: string }
}) {
  const { toast } = useToast()
  const { execute, error, isSuccess, isPending } = useServerAction(
    changePasswordAction,
    {
      onError({ err }) {
        toast({
          title: 'Something went wrong',
          description: err.message,
          variant: 'destructive',
        })
      },
    }
  )

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: searchParams.token,
      password: '',
      passwordConfirmation: '',
    },
  })

  async function onSubmit(values: ResetPasswordInput) {
    NProgress.start()
    await execute({ token: values.token, password: values.password })
    NProgress.done()
  }

  return (
    <div className="mx-auto max-w-[400px] space-y-6 py-24">
      {isSuccess && (
        <>
          <h1 className={cn(pageTitleStyles, 'text-center')}>
            Password Updated
          </h1>
          <Alert variant="success">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Password updated</AlertTitle>
            <AlertDescription>
              Your password has been successfully updated.
            </AlertDescription>
          </Alert>

          <Button variant="default" asChild className="w-full">
            <Link href="/login/email">Login with New Password</Link>
          </Button>
        </>
      )}

      {!isSuccess && (
        <>
          <h1 className={cn(pageTitleStyles, 'text-center')}>
            Change Password
          </h1>

          {error && (
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Uh-oh, something went wrong</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="w-full"
                        placeholder="Enter your new password"
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="passwordConfirmation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="w-full"
                        placeholder="Enter Confirm your Password"
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <LoaderButton
                isLoading={isPending}
                className="w-full"
                type="submit"
              >
                Change Password
              </LoaderButton>
            </form>
          </Form>
        </>
      )}
    </div>
  )
}
