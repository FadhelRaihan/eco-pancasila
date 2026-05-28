import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { z } from 'zod'

const updateSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional(),
  type: z.enum(['DISKUSI', 'LEMBAR_KERJA', 'STUDI_KASUS', 'PRESENTASI']).optional(),
  fileUrl: z.string().optional(),
  dueDate: z.string().datetime().optional(),
})

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const aktivitas = await prisma.activity.findUnique({
    where: { id },
    include: {
      classroom: { select: { id: true, name: true } },
      author: { select: { id: true, name: true } },
      logs: {
        include: { student: { select: { id: true, name: true } } },
        orderBy: { updatedAt: 'desc' },
      },
    },
  })

  if (!aktivitas) {
    return NextResponse.json({ error: 'Aktivitas tidak ditemukan' }, { status: 404 })
  }

  return NextResponse.json(aktivitas)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session.isLoggedIn || session.role !== 'GURU') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const existing = await prisma.activity.findUnique({ where: { id } })
  if (!existing || existing.authorId !== session.userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const data = updateSchema.parse(body)
    const aktivitas = await prisma.activity.update({
      where: { id },
      data: { ...data, dueDate: data.dueDate ? new Date(data.dueDate) : undefined },
    })
    return NextResponse.json(aktivitas)
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
  const existing = await prisma.activity.findUnique({ where: { id } })
  if (!existing || existing.authorId !== session.userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await prisma.activity.delete({ where: { id } })
  return NextResponse.json({ message: 'Aktivitas berhasil dihapus' })
}
