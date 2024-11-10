import Link from "next/link"
import { cn } from "~/lib/utils"
import { buttonVariants } from "~/components/ui/button"
import { getScopedI18n } from "~/lib/locales/server"
import { GithubIcon, GoogleIcon } from "~/components/icons"
import { Icon as Iconfiy } from "@iconify/react"
import { getCurrentUser } from "~/lib/auth"
import { redirect } from "next/navigation"
import { PATHS } from "~/app-config"
import { MagicLinkForm } from "./_components/magic-link-form"
import { setStaticParamsLocale } from "next-international/server"
import { enableOAuth } from "~/app-config"

export default async function LogIn({
  params: { locale },
}: {
  params: { locale: string }
}) {
  setStaticParamsLocale(locale)

  const scopedT = await getScopedI18n("logIn")
  const user = await getCurrentUser()

  if (user) {
    redirect(PATHS.Dashboard)
  }

  return (
    <div className="container relative hidden h-dvh flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          Acme Inc
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;This library has saved me countless hours of work and
              helped me deliver stunning designs to my clients faster than ever
              before.&rdquo;
            </p>
            <footer className="text-sm">Sofia Davis</footer>
          </blockquote>
        </div>
      </div>
      <div className="h-full lg:p-8 lg:pt-20">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="mb-6 flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {scopedT("title")}
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to create your account
            </p>
          </div>
          <div className="space-y-4">
            <MagicLinkForm />
          </div>
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-100 px-2 text-gray-500 dark:bg-gray-950 dark:text-gray-400">
                Or sign in with email
              </span>
            </div>
          </div>
          <div className="space-y-4">
            <Link
              href="/login/email"
              className={cn(
                buttonVariants({
                  variant: "secondary",
                }),
                "w-full"
              )}
            >
              <Iconfiy
                icon="ic:twotone-email"
                className="mr-2 h-5 w-5 stroke-white"
              />
              Sign in with email
            </Link>
          </div>
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-100 px-2 text-gray-500 dark:bg-gray-950 dark:text-gray-400">
                Other options
              </span>
            </div>
          </div>
          <div className="space-y-4">
            <Link
              href="/api/login/google"
              className={cn(
                buttonVariants({
                  variant: "secondary",
                }),
                `w-full ${enableOAuth ? "" : "cursor-not-allowed opacity-50"}`
              )}
            >
              <GoogleIcon className="mr-2 h-5 w-5 stroke-white" />
              Sign in with Google
            </Link>
            <Link
              href="/api/login/github"
              className={cn(
                buttonVariants({
                  variant: "secondary",
                }),
                `w-full ${enableOAuth ? "" : "cursor-not-allowed opacity-50"}`
              )}
            >
              <GithubIcon className="mr-2 h-5 w-5" />
              Sign in with GitHub
            </Link>
          </div>
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-100 px-2 text-gray-500 dark:bg-gray-950 dark:text-gray-400">
                Or
              </span>
            </div>
          </div>
          <div className="space-y-4">
            <Link
              href="/signup"
              className={cn(
                buttonVariants({
                  variant: "secondary",
                }),
                "w-full"
              )}
            >
              Sign up with email
            </Link>
          </div>
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
