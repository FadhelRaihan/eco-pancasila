import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { z } from 'zod'

const joinSchema = z.object({
  code: z.string().min(6),
})

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session.isLoggedIn || session.role !== 'SISWA') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { code } = joinSchema.parse(body)

    const classroom = await prisma.classroom.findUnique({
      where: { code, isActive: true },
    })
    if (!classroom) {
      return NextResponse.json({ error: 'Kode kelas tidak valid' }, { status: 400 })
    }

    const existing = await prisma.classroomMember.findUnique({
      where: { classroomId_studentId: { classroomId: classroom.id, studentId: session.userId } },
    })
    if (existing) {
      return NextResponse.json({ error: 'Anda sudah bergabung di kelas ini' }, { status: 400 })
    }

    await prisma.classroomMember.create({
      data: { classroomId: classroom.id, studentId: session.userId },
    })

    return NextResponse.json({ message: 'Berhasil bergabung ke kelas', classroom })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 422 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
