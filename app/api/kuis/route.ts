import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { z } from 'zod'

const createSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  duration: z.number().int().positive().optional(),
  passingScore: z.number().min(0).max(100).default(70),
  classroomIds: z.array(z.string()).optional(),
  questions: z.array(z.object({
    text: z.string().min(1),
    options: z.array(z.string()).length(4),
    answer: z.string(),
    order: z.number().int(),
    imageUrl: z.string().optional(),
  })),
})

export async function GET() {
  const session = await getSession()
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const kuis = await prisma.quiz.findMany({
    where: session.role === 'GURU' ? { authorId: session.userId } : undefined,
    include: {
      author: { select: { name: true } },
      _count: { select: { questions: true, responses: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(kuis)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session.isLoggedIn || session.role !== 'GURU') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const data = createSchema.parse(body)

    const kuis = await prisma.quiz.create({
      data: {
        title: data.title,
        description: data.description,
        duration: data.duration,
        passingScore: data.passingScore,
        authorId: session.userId,
        questions: { create: data.questions },
        classrooms: data.classroomIds ? {
          create: data.classroomIds.map(id => ({ classroomId: id })),
        } : undefined,
      },
      include: { questions: true, _count: { select: { questions: true } } },
    })

    return NextResponse.json(kuis, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 422 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
