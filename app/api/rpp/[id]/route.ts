import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { z } from 'zod'

const updateSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional(),
  subject: z.string().optional(),
  grade: z.number().int().min(1).max(6).optional(),
  fileUrl: z.string().optional(),
  content: z.string().optional(),
})

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const rpp = await prisma.material.findFirst({
    where: { id, type: 'RPP' },
    include: { author: { select: { name: true } } },
  })

  if (!rpp) {
    return NextResponse.json({ error: 'RPP tidak ditemukan' }, { status: 404 })
  }

  return NextResponse.json(rpp)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const existing = await prisma.material.findFirst({ where: { id, type: 'RPP' } })
  if (!existing) {
    return NextResponse.json({ error: 'RPP tidak ditemukan' }, { status: 404 })
  }
  if (existing.authorId !== session.userId && session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const data = updateSchema.parse(body)
    const rpp = await prisma.material.update({ where: { id }, data })
    return NextResponse.json(rpp)
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
  const existing = await prisma.material.findFirst({ where: { id, type: 'RPP' } })
  if (!existing) {
    return NextResponse.json({ error: 'RPP tidak ditemukan' }, { status: 404 })
  }
  if (existing.authorId !== session.userId && session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await prisma.material.delete({ where: { id } })
  return NextResponse.json({ message: 'RPP berhasil dihapus' })
}
