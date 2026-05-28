import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { z } from 'zod'

const createSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(3),
  type: z.enum(['DISKUSI', 'LEMBAR_KERJA', 'STUDI_KASUS', 'PRESENTASI']),
  fileUrl: z.string().optional(),
  classroomId: z.string(),
  dueDate: z.string().datetime().optional(),
})

export async function GET() {
  const session = await getSession()
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const aktivitas = await prisma.activity.findMany({
    where: session.role === 'GURU'
      ? { authorId: session.userId }
      : session.role === 'SISWA'
      ? { classroom: { members: { some: { studentId: session.userId } } } }
      : undefined,
    include: {
      classroom: { select: { id: true, name: true } },
      author: { select: { name: true } },
      _count: { select: { logs: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(aktivitas)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session.isLoggedIn || session.role !== 'GURU') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const data = createSchema.parse(body)

    const aktivitas = await prisma.activity.create({
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        fileUrl: data.fileUrl,
        classroomId: data.classroomId,
        authorId: session.userId,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      },
    })

    return NextResponse.json(aktivitas, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 422 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
