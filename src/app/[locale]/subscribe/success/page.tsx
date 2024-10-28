import Confetti from "~/components/confetti"
import { Button } from "~/components/ui/button"
import Link from "next/link"

export default function SuccessPage() {
  return (
    <>
      <div className="flex flex-col items-center gap-8 pb-24">
        <h1 className="mt-24 text-4xl">You&apos;ve been upgraded!</h1>

        <Confetti />

        <p>Click below to start using our service</p>

        <Button asChild>
          <Link href={"/dashboard"}>View Dashboard</Link>
        </Button>
      </div>
    </>
  )
}
