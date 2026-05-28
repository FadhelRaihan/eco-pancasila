import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { z } from 'zod'

const updateSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional(),
  subject: z.string().optional(),
  grade: z.number().int().min(1).max(6).optional(),
  type: z.enum(['MATERI', 'RPP', 'MODUL', 'MEDIA', 'INFOGRAFIS']).optional(),
  fileUrl: z.string().optional(),
  youtubeUrl: z.string().optional(),
  content: z.string().optional(),
  status: z.enum(['DRAFT', 'REVIEW', 'PUBLISHED', 'REJECTED']).optional(),
})

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const materi = await prisma.material.findUnique({
    where: { id },
    include: { author: { select: { name: true, school: true } } },
  })

  if (!materi) {
    return NextResponse.json({ error: 'Materi tidak ditemukan' }, { status: 404 })
  }

  return NextResponse.json(materi)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const existing = await prisma.material.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: 'Materi tidak ditemukan' }, { status: 404 })
  }
  if (existing.authorId !== session.userId && session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const data = updateSchema.parse(body)

    const materi = await prisma.material.update({
      where: { id },
      data,
    })

    return NextResponse.json(materi)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 422 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const existing = await prisma.material.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: 'Materi tidak ditemukan' }, { status: 404 })
  }
  if (existing.authorId !== session.userId && session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await prisma.material.delete({ where: { id } })
  return NextResponse.json({ message: 'Materi berhasil dihapus' })
}
