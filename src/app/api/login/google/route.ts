import { cookies } from "next/headers"
import { generateCodeVerifier, generateState } from "arctic"
import { googleAuth } from "~/lib/auth"

export async function GET(): Promise<Response> {
  const state = generateState()
  const codeVerifier = generateCodeVerifier()
  const scopes = ["profile", "email"]
  const url = googleAuth.createAuthorizationURL(state, codeVerifier, scopes)

  cookies().set("google_oauth_state", state, {
    secure: true,
    path: "/",
    httpOnly: true,
    maxAge: 60 * 10,
  })

  cookies().set("google_code_verifier", codeVerifier, {
    secure: true,
    path: "/",
    httpOnly: true,
    maxAge: 60 * 10,
  })

  return Response.redirect(url)
}
