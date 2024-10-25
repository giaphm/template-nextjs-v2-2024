import { NextResponse } from "next/server"

export const GET = async () => {
  try {
    return NextResponse.json({ data: "" }, { status: 200 })
  } catch (error) {
    const err = error as Error
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}
