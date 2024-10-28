import { cn } from "~/lib/utils"
import { cardStyles } from "~/styles/common"
import { ReactNode } from "react"

export function ConfigurationPanel({
  title,
  children,
  variant = "default",
}: {
  title: string
  children: ReactNode
  variant?: "destructive" | "default"
}) {
  return (
    <div
      className={cn(cardStyles, {
        "border-red-500": variant === "destructive",
      })}
    >
      <div className="rounded-t-md border-b bg-gray-200 px-4 py-2 dark:bg-gray-800 sm:px-6 md:py-3">
        <span className="mb-4 text-base font-medium sm:text-lg">{title}</span>
      </div>
      <div className="p-4 sm:px-6">
        <div className="mb-4 flex flex-col gap-4 text-sm sm:text-base">
          <div className="flex gap-8">{children}</div>
        </div>
      </div>
    </div>
  )
}
