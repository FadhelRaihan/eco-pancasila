import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { generateClassCode } from '@/lib/auth'
import { z } from 'zod'

const createSchema = z.object({
  name: z.string().min(3),
  subject: z.string(),
  grade: z.number().int().min(1).max(6),
  description: z.string().optional(),
})

export async function GET() {
  const session = await getSession()
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let kelas
  if (session.role === 'GURU') {
    kelas = await prisma.classroom.findMany({
      where: { teacherId: session.userId },
      include: { _count: { select: { members: true } } },
      orderBy: { createdAt: 'desc' },
    })
  } else if (session.role === 'SISWA') {
    kelas = await prisma.classroom.findMany({
      where: { members: { some: { studentId: session.userId } } },
      include: { _count: { select: { members: true } }, teacher: { select: { name: true } } },
    })
  } else {
    kelas = await prisma.classroom.findMany({
      include: { _count: { select: { members: true } }, teacher: { select: { name: true } } },
    })
  }

  return NextResponse.json(kelas)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session.isLoggedIn || session.role !== 'GURU') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const data = createSchema.parse(body)

    const code = generateClassCode(data.grade, data.name.substring(0, 2).toUpperCase())

    const kelas = await prisma.classroom.create({
      data: {
        name: data.name,
        subject: data.subject,
        grade: data.grade,
        description: data.description,
        code,
        teacherId: session.userId,
      },
    })

    return NextResponse.json(kelas, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 422 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
