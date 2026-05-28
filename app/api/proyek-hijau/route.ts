import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { z } from 'zod'

const createSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(3),
  category: z.enum(['SETTING_INFRASTRUCTURE', 'ENERGY_CLIMATE', 'WASTE', 'WATER', 'TRANSPORTATION', 'EDUCATION_RESEARCH']),
  classroomId: z.string(),
  dueDate: z.string().datetime().optional(),
})

export async function GET() {
  const session = await getSession()
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const proyek = await prisma.proyekHijau.findMany({
    where: session.role === 'GURU'
      ? { authorId: session.userId }
      : session.role === 'SISWA'
      ? { classroom: { members: { some: { studentId: session.userId } } } }
      : undefined,
    include: {
      classroom: { select: { id: true, name: true } },
      author: { select: { name: true } },
      _count: { select: { submits: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(proyek)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session.isLoggedIn || session.role !== 'GURU') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const data = createSchema.parse(body)

    const proyek = await prisma.proyekHijau.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        classroomId: data.classroomId,
        authorId: session.userId,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      },
    })

    return NextResponse.json(proyek, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 422 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
