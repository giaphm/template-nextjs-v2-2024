import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3"
import env from "~/env"
import { Upload } from "@aws-sdk/lib-storage"

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.CLOUDFLARE_ACCESS_KEY_ID,
    secretAccessKey: env.CLOUDFLARE_SECRET_ACCESS_KEY,
  },
})

export async function getFileUrl({ key }: { key: string }) {
  const url = await getSignedUrl(
    s3Client,
    new GetObjectCommand({
      Bucket: env.CLOUDFLARE_BUCKET_NAME,
      Key: key,
    }),
    { expiresIn: 3600 }
  )
  return url
}

export async function uploadFileToBucket(file: File, filename: string) {
  const Key = filename
  const Bucket = env.CLOUDFLARE_BUCKET_NAME

  let res

  try {
    const parallelUploads = new Upload({
      client: s3Client,
      params: {
        Bucket,
        Key,
        Body: file.stream(),
        ACL: "public-read",
        ContentType: file.type,
      },
      queueSize: 4,
      leavePartsOnError: false,
    })

    res = await parallelUploads.done()
  } catch (e) {
    throw e
  }

  return res
}
