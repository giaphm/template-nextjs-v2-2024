import { setSession } from '~/lib/auth'
import { rateLimitByIp } from '~/lib/auth/limiter'
import { loginWithMagicLinkUseCase } from '~/lib/use-cases/magic-links'

export const dynamic = 'force-dynamic'

export async function GET(request: Request): Promise<Response> {
  console.log('verifying email to login')
  try {
    await rateLimitByIp({ key: 'magic-token', limit: 5, window: 60000 })

    const url = new URL(request.url)
    const token = url.searchParams.get('token')

    if (!token) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: '/login',
        },
      })
    }

    const user = await loginWithMagicLinkUseCase(token)

    await setSession(user.id)

    return new Response(null, {
      status: 302,
      headers: {
        Location: '/dashboard',
      },
    })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)

    return new Response(null, {
      status: 302,
      headers: {
        Location: '/login',
      },
    })
  }
}
