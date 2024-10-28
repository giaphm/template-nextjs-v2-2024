import { Button } from "~/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function SuccessPage() {
  return (
    <>
      <div className="flex flex-col items-center gap-8 pb-24">
        <h1 className="mt-24 text-4xl">Not interested? No worries at all</h1>

        <Button variant="default" asChild size="lg">
          <Link href="/">
            <ChevronLeft className="mr-2 h-4 w-4" /> Let my landing page
            convince you
          </Link>
        </Button>
      </div>
    </>
  )
}
