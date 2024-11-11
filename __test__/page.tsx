import Link from "next/link"
import { useState } from "react"
import { z } from "zod"
import { chunkk, sum } from "./sum.mjs"

export const schema = z.object({})

export type schemaType = z.infer<typeof schema>

export default function Page() {
  const [data] = useState("")
  // const { isPending, execute, error } = useServerAction(logInAction, {
  //   onError({ err }) {
  //     toast({
  //       title: "Something went wrong",
  //       description: err.message,
  //       variant: "destructive",
  //     })
  //   },
  // })
  console.log(data)
  console.log(sum(1, 2))
  console.log(chunkk)

  return (
    <div>
      <h1>Home</h1>
      <Link href="/about">About</Link>
    </div>
  )
}
