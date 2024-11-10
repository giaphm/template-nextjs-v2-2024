"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useServerAction } from "zsa-react"
import { useToast } from "~/hooks/use-toast"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert"
import { Terminal } from "lucide-react"
import { LoaderButton } from "~/components/loader-button"
import { signUpAction } from "../actions"

export const signUpSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  displayName: z.string().min(1, "Please provide your display name.").max(255),
  password: z.string().min(1, "Please provide your password.").max(255),
  passwordConfirm: z.string().min(1, {
    message: "Please provide your password confirm.",
  }),
})

export type SignUpInput = z.infer<typeof signUpSchema>

export default function SignUpForm() {
  const { toast } = useToast()
  const { isPending, execute, error } = useServerAction(signUpAction, {
    onError({ err }) {
      toast({
        title: "Something went wrong",
        description: err.message,
        variant: "destructive",
      })
    },
  })

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      displayName: "",
      password: "",
      passwordConfirm: "",
    },
  })

  async function onSubmit(values: SignUpInput) {
    const [data] = await execute(values)

    alert(
      `Sign up successfully! You can go to link: ${location.origin}/api/login/verifiy-email?token=${data?.token} to verify email. We disable emailing for development`
    )
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
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display name</FormLabel>
              <FormControl>
                <Input placeholder="display name" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
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
        <FormField
          control={form.control}
          name="passwordConfirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Re-enter password</FormLabel>
              <FormControl>
                <Input
                  placeholder="re-enter password"
                  {...field}
                  type="password"
                />
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

        <LoaderButton isLoading={isPending} type="submit" className="w-full">
          Register
        </LoaderButton>
      </form>
    </Form>
  )
}
