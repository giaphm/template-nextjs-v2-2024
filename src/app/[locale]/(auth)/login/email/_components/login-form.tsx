'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useServerAction } from 'zsa-react'
import { useToast } from '~/hooks/use-toast'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { Terminal } from 'lucide-react'
import { LoaderButton } from '~/components/loader-button'
import NProgress from 'nprogress'
import { logInAction } from '../actions'

export const logInFormSchema = z.object({
  email: z.string().min(1, {
    message: 'Username must be at least 1 characters.',
  }),
  password: z.string().min(1, {
    message: 'Username must be at least 1 characters.',
  }),
})

export type LogInFormDataType = z.infer<typeof logInFormSchema>

export default function LogInForm() {
  const { toast } = useToast()
  const { isPending, execute, error } = useServerAction(logInAction, {
    onError({ err }) {
      toast({
        title: 'Something went wrong',
        description: err.message,
        variant: 'destructive',
      })
    },
  })

  const form = useForm<z.infer<typeof logInFormSchema>>({
    resolver: zodResolver(logInFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: LogInFormDataType) {
    NProgress.start()
    await execute(values)
    NProgress.done()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter password</FormLabel>
              <FormControl>
                <Input placeholder="password" {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && (
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Uhoh, we couldn&apos;t log you in</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        <LoaderButton isLoading={isPending} className="w-full" type="submit">
          Log In
        </LoaderButton>
      </form>
    </Form>
  )
}
