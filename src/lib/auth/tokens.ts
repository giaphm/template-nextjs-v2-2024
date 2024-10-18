import crypto from 'crypto'

export const TOKEN_LENGTH = 32
export const TOKEN_TTL = 1000 * 60 * 5 // 5m
export const VERIFY_EMAIL_TTL = 1000 * 60 * 60 * 24 * 7 // 7 days

export async function generateRandomToken(length: number) {
  const buffer = await new Promise<Buffer>((resolve, reject) => {
    crypto.randomBytes(Math.ceil(length / 2), (err, buf) => {
      if (err !== null) reject(err)
      else resolve(buf)
    })
  })

  return buffer.toString('hex').slice(0, length)
}
