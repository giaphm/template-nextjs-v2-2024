import {
  getAccountByGithubId,
  getAccountByGoogleId,
} from "~/lib/data-access/accounts"

export async function getAccountByGoogleIdUseCase(googleId: string) {
  return await getAccountByGoogleId(googleId)
}

export async function getAccountByGithubIdUseCase(githubId: string) {
  return await getAccountByGithubId(githubId)
}
