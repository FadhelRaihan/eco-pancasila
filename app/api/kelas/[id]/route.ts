import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { z } from 'zod'

const updateSchema = z.object({
  name: z.string().min(3).optional(),
  subject: z.string().optional(),
  grade: z.number().int().min(1).max(6).optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
})

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const kelas = await prisma.classroom.findUnique({
    where: { id },
    include: {
      teacher: { select: { name: true, email: true } },
      members: { include: { student: { select: { id: true, name: true, email: true } } } },
      _count: { select: { materials: true, quizzes: true, activities: true } },
    },
  })

  if (!kelas) {
    return NextResponse.json({ error: 'Kelas tidak ditemukan' }, { status: 404 })
  }

  return NextResponse.json(kelas)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session.isLoggedIn || session.role !== 'GURU') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const existing = await prisma.classroom.findUnique({ where: { id } })
  if (!existing || existing.teacherId !== session.userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const data = updateSchema.parse(body)
    const kelas = await prisma.classroom.update({ where: { id }, data })
    return NextResponse.json(kelas)
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
  const existing = await prisma.classroom.findUnique({ where: { id } })
  if (!existing || existing.teacherId !== session.userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await prisma.classroom.delete({ where: { id } })
  return NextResponse.json({ message: 'Kelas berhasil dihapus' })
}
