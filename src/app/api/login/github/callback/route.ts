import { cookies } from "next/headers"
import { github, setSession } from "~/lib/auth/auth"
import { createGithubUserUseCase } from "~/lib/use-cases/users"
import { getAccountByGithubIdUseCase } from "~/lib/use-cases/accounts"
import { OAuth2RequestError } from "arctic"
import { PATHS } from "~/app-config"

export interface GitHubUser {
  id: string
  login: string
  avatar_url: string
  email: string
}

interface Email {
  email: string
  primary: boolean
  verified: boolean
  visibility: string | null
}

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")
  const state = url.searchParams.get("state")
  const storedState = cookies().get("github_oauth_state")?.value ?? null
  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
    })
  }

  try {
    const tokens = await github.validateAuthorizationCode(code)
    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    })
    const githubUser = (await githubUserResponse.json()) as GitHubUser

    const existingAccount = await getAccountByGithubIdUseCase(githubUser.id)

    if (existingAccount) {
      await setSession(existingAccount.userId)
      return new Response(null, {
        status: 302,
        headers: {
          Location: PATHS.Dashboard,
        },
      })
    }

    if (!githubUser.email) {
      const githubUserEmailResponse = await fetch(
        "https://api.github.com/user/emails",
        {
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
          },
        }
      )
      const githubUserEmails = (await githubUserEmailResponse.json()) as Email[]

      githubUser.email = getPrimaryEmail(githubUserEmails)
    }

    const userId = await createGithubUserUseCase(githubUser)
    await setSession(userId)
    return new Response(null, {
      status: 302,
      headers: {
        Location: PATHS.Dashboard,
      },
    })
  } catch (e) {
    console.error(e)
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

function getPrimaryEmail(emails: Email[]): string {
  const primaryEmail = emails.find((email) => email.primary)
  return primaryEmail!.email
}
