import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

export { cloudinary }

export function getPublicUrl(publicId: string): string {
  return cloudinary.url(publicId, { secure: true })
}

export function getFolderPath(folder: string, userId: string): string {
  return `eco-pancasila/${folder}/${userId}`
}
