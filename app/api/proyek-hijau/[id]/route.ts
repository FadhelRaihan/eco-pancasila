import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { z } from 'zod'

const submitSchema = z.object({
  description: z.string(),
  fileUrl: z.string().optional(),
  imageUrl: z.string().optional(),
})

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const proyek = await prisma.proyekHijau.findUnique({
    where: { id },
    include: {
      classroom: { select: { id: true, name: true } },
      author: { select: { id: true, name: true } },
      submits: {
        include: { student: { select: { id: true, name: true } } },
        orderBy: { submittedAt: 'desc' },
      },
    },
  })

  if (!proyek) {
    return NextResponse.json({ error: 'Proyek tidak ditemukan' }, { status: 404 })
  }

  return NextResponse.json(proyek)
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session.isLoggedIn || session.role !== 'SISWA') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    const body = await req.json()
    const data = submitSchema.parse(body)

    const submit = await prisma.proyekHijauSubmit.upsert({
      where: { proyekId_studentId: { proyekId: id, studentId: session.userId } },
      update: { description: data.description, fileUrl: data.fileUrl, imageUrl: data.imageUrl, status: 'SELESAI' },
      create: {
        proyekId: id,
        studentId: session.userId,
        description: data.description,
        fileUrl: data.fileUrl,
        imageUrl: data.imageUrl,
        status: 'SELESAI',
      },
    })

    return NextResponse.json(submit)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 422 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session.isLoggedIn || session.role !== 'GURU') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()

  const proyek = await prisma.proyekHijau.update({
    where: { id },
    data: { title: body.title, description: body.description, category: body.category, dueDate: body.dueDate ? new Date(body.dueDate) : undefined },
  })

  return NextResponse.json(proyek)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session.isLoggedIn || session.role !== 'GURU') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  await prisma.proyekHijau.delete({ where: { id } })
  return NextResponse.json({ message: 'Proyek berhasil dihapus' })
}
