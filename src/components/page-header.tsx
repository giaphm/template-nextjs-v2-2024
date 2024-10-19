import { ReactNode } from "react"

export function PageHeader({ children }: { children: ReactNode }) {
  return (
    <div className="bg-gray-200 py-12 dark:bg-slate-900">
      <div className="container">{children}</div>
    </div>
  )
}
