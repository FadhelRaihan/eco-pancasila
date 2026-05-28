import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { z } from 'zod'

const createSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  subject: z.string(),
  grade: z.number().int().min(1).max(6),
  type: z.enum(['MATERI', 'RPP', 'MODUL', 'MEDIA', 'INFOGRAFIS']),
  fileUrl: z.string().optional(),
  youtubeUrl: z.string().optional(),
  content: z.string().optional(),
  classroomIds: z.array(z.string()).optional(),
})

export async function GET() {
  const session = await getSession()
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const materi = await prisma.material.findMany({
    where: session.role === 'GURU' ? { authorId: session.userId } : undefined,
    include: { author: { select: { name: true, school: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(materi)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session.isLoggedIn || session.role !== 'GURU') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const data = createSchema.parse(body)

    const materi = await prisma.material.create({
      data: {
        title: data.title,
        description: data.description,
        subject: data.subject,
        grade: data.grade,
        type: data.type,
        fileUrl: data.fileUrl,
        youtubeUrl: data.youtubeUrl,
        content: data.content,
        authorId: session.userId,
        status: 'PUBLISHED',
        classrooms: data.classroomIds ? {
          create: data.classroomIds.map(id => ({ classroomId: id })),
        } : undefined,
      },
      include: { author: { select: { name: true } } },
    })

    return NextResponse.json(materi, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 422 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
