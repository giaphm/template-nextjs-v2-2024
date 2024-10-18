'use client'

export function BreakpointOverlay() {
  if (process.env.NEXT_PUBLIC_IS_LOCAL !== 'true') return null

  return (
    <div className="fixed bottom-2 right-2 z-50 rounded-md bg-yellow-300/50 bg-opacity-75 px-2 py-1 text-sm text-white">
      <span className="sm:hidden">xs</span>
      <span className="hidden sm:inline md:hidden">sm</span>
      <span className="hidden md:inline lg:hidden">md</span>
      <span className="hidden lg:inline xl:hidden">lg</span>
      <span className="hidden xl:inline 2xl:hidden">xl</span>
      <span className="hidden 2xl:inline">2xl</span>
    </div>
  )
}
