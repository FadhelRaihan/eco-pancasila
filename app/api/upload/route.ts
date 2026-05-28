import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { v2 as cloudinary } from 'cloudinary'
import { z } from 'zod'

const schema = z.object({
  fileName: z.string(),
  folder: z.enum(['materi', 'rpp', 'aktivitas', 'proyek', 'avatar']),
})

const ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg', 'image/png', 'image/webp',
  'video/mp4',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
]

const EXT_MAP: Record<string, string> = {
  'application/pdf': 'pdf',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'video/mp4': 'mp4',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const data = schema.parse(body)

    const contentType = body.contentType || ''
    if (contentType && !ALLOWED_TYPES.includes(contentType)) {
      return NextResponse.json({ error: 'Tipe file tidak diizinkan' }, { status: 400 })
    }

    const ext = EXT_MAP[contentType] || data.fileName.split('.').pop() || 'bin'
    const publicId = `eco-pancasila/${data.folder}/${session.userId}/${Date.now()}`

    const timestamp = Math.round(Date.now() / 1000)
    const paramsToSign: Record<string, string | number> = {
      timestamp,
      public_id: publicId,
      folder: `eco-pancasila/${data.folder}`,
    }

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET!
    )

    return NextResponse.json({
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      signature,
      timestamp,
      publicId,
      resourceType: contentType.startsWith('video') ? 'video' : 'image',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 422 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
