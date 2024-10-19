import crypto from "crypto"

export async function generateRandomToken(length: number) {
  const buffer = await new Promise<Buffer>((resolve, reject) => {
    crypto.randomBytes(Math.ceil(length / 2), (err, buf) => {
      if (err !== null) reject(err)
      else resolve(buf)
    })
  })

  return buffer.toString("hex").slice(0, length)
}
