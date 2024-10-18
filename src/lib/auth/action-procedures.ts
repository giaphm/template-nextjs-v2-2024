import { createServerActionProcedure } from 'zsa'
import env from '~/env'
import { PublicError } from '../use-cases/errors'
import { assertAuthenticated } from './auth'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function shapeErrors({ err }: any) {
  const isAllowedError = err instanceof PublicError

  // for debugging in local easily
  const isDev = env.NODE_ENV === 'development'
  if (isAllowedError || isDev) {
    // eslint-disable-next-line no-console
    console.error(err)
    return {
      code: err.code ?? 'ERROR',
      message: `${isDev ? 'DEV ONLY ENABLED - ' : ''}${err.message}`,
    }
  }

  return {
    code: 'ERROR',
    message: 'Something went wrong',
  }
}

export const authenticatedAction = createServerActionProcedure()
  .experimental_shapeError(shapeErrors)
  .handler(async () => {
    const user = await assertAuthenticated()
    return { user }
  })

export const unauthenticatedAction = createServerActionProcedure()
  .experimental_shapeError(shapeErrors)
  .handler(async () => ({ user: undefined }))
