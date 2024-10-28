import { cookies } from "next/headers"
import { OAuth2RequestError } from "arctic"
import { createGoogleUserUseCase } from "~/lib/use-cases/users"
import { getAccountByGoogleIdUseCase } from "~/lib/use-cases/accounts"
import { googleAuth, setSession } from "~/lib/auth"
import { PATHS } from "~/app-config"

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")
  const state = url.searchParams.get("state")
  const storedState = cookies().get("google_oauth_state")?.value ?? null
  const codeVerifier = cookies().get("google_code_verifier")?.value ?? null

  if (
    !code ||
    !state ||
    !storedState ||
    state !== storedState ||
    !codeVerifier
  ) {
    return new Response(null, {
      status: 400,
    })
  }

  try {
    const tokens = await googleAuth.validateAuthorizationCode(
      code,
      codeVerifier
    )
    const response = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    )
    const googleUser = (await response.json()) as GoogleUser

    const existingAccount = await getAccountByGoogleIdUseCase(googleUser.sub)

    if (existingAccount) {
      await setSession(existingAccount.userId)
      return new Response(null, {
        status: 302,
        headers: {
          Location: PATHS.Dashboard,
        },
      })
    }

    const userId = await createGoogleUserUseCase(googleUser)
    await setSession(userId)
    return new Response(null, {
      status: 302,
      headers: {
        Location: PATHS.Dashboard,
      },
    })
  } catch (e) {
    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      // invalid code
      return new Response(null, {
        status: 400,
      })
    }
    return new Response(null, {
      status: 500,
    })
  }
}

export interface GoogleUser {
  sub: string
  name: string
  given_name: string
  family_name: string
  picture: string
  email: string
  email_verified: boolean
  locale: string
}
