import { Metadata } from "next"
import { setStaticParamsLocale } from "next-international/server"
import Link from "next/link"
import { LANDING_PAGE_FEATURE_ITEMS } from "~/components/landing-page-features"
import { Button } from "~/components/ui/button"
import { getI18n } from "~/lib/locales/server"
import { appMode } from "~/app-config"
import { NewsletterForm } from "./(coming-soon)/newsletter-form"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getI18n()

  return {
    title: t("hello"),
    description: t("hello.world"),
  }
}

export default async function Home({
  params: { locale },
}: {
  params: { locale: string }
}) {
  setStaticParamsLocale(locale)
  const t = await getI18n()

  console.log(t("hello"))

  // if (appMode === "comingSoon") {
  //   return <ComingSoon />
  // }

  if (appMode === "maintenance") {
    return (
      <div>
        <h1>Maintenance...</h1>
      </div>
    )
  }

  return (
    <>
      <section>
        {appMode === "comingSoon" && (
          <div className="fixed">
            <h1>Comming soon...</h1>
          </div>
        )}
      </section>
      <section className="bg-white dark:bg-gray-900">
        <div className="mx-auto grid max-w-screen-xl px-4 py-8 text-center lg:py-16">
          <div className="mx-auto place-self-center">
            <h1 className="mb-4 max-w-2xl text-4xl font-extrabold leading-none tracking-tight dark:text-white md:text-5xl xl:text-6xl">
              Template Next.js v2 2024
            </h1>
            <p className="mb-6 max-w-2xl font-light text-gray-500 dark:text-gray-400 md:text-lg lg:mb-8 lg:text-xl">
              Jumpstart your enterprise project with our feature-packed,
              high-performance Next.js boilerplate! Experience rapid UI
              development, and an extensive suite of tools for a smooth and
              enjoyable development process.
            </p>
            <Button
              asChild
              className="rounded-xl bg-blue-400 p-7 text-lg font-bold hover:bg-blue-500"
            >
              <Link href="/login" className="mr-3">
                Log in
              </Link>
            </Button>
            <Button
              variant="secondary"
              asChild
              className="rounded-xl p-7 text-lg font-bold hover:bg-neutral-200"
            >
              <Link href="https://vercel.com/new/git/external?repository-url=https://github.com/giaphm/template-nextjs-v2-2024">
                Deploy Now
              </Link>
            </Button>
            <div className="mt-8 w-[60%] place-self-center">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>
      <section className="bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:py-16 lg:px-6">
          <div className="justify-center space-y-8 md:grid md:grid-cols-2 md:gap-12 md:space-y-0 lg:grid-cols-3">
            {LANDING_PAGE_FEATURE_ITEMS.map((singleItem) => (
              <div
                key={singleItem.title}
                className="flex flex-col items-center justify-center text-center"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 p-1.5 text-blue-700 dark:bg-blue-900 lg:h-12 lg:w-12">
                  {singleItem.icon}
                </div>
                <h3 className="mb-2 text-xl font-bold dark:text-white">
                  {singleItem.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {singleItem.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
