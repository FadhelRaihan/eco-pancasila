import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { z } from 'zod'

const updateSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional(),
  duration: z.number().int().positive().optional(),
  passingScore: z.number().min(0).max(100).optional(),
})

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const kuis = await prisma.quiz.findUnique({
    where: { id },
    include: {
      questions: { orderBy: { order: 'asc' } },
      author: { select: { name: true } },
      ...(session.role === 'SISWA' ? {} : { responses: true }),
    },
  })

  if (!kuis) {
    return NextResponse.json({ error: 'Kuis tidak ditemukan' }, { status: 404 })
  }

  if (session.role === 'SISWA') {
    const sanitized = {
      ...kuis,
      questions: kuis.questions.map((q: { id: string; text: string; options: unknown; order: number; imageUrl: string | null }) => ({ id: q.id, text: q.text, options: q.options, order: q.order, imageUrl: q.imageUrl })),
    }
    return NextResponse.json(sanitized)
  }

  return NextResponse.json(kuis)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session.isLoggedIn || session.role !== 'GURU') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const existing = await prisma.quiz.findUnique({ where: { id } })
  if (!existing || existing.authorId !== session.userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const data = updateSchema.parse(body)
    const kuis = await prisma.quiz.update({ where: { id }, data })
    return NextResponse.json(kuis)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 422 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session.isLoggedIn || session.role !== 'GURU') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const existing = await prisma.quiz.findUnique({ where: { id } })
  if (!existing || existing.authorId !== session.userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await prisma.quiz.delete({ where: { id } })
  return NextResponse.json({ message: 'Kuis berhasil dihapus' })
}
