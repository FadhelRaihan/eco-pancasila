import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session.isLoggedIn || session.role !== 'GURU') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const classroom = await prisma.classroom.findUnique({ where: { id } })
  if (!classroom || classroom.teacherId !== session.userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const members = await prisma.classroomMember.findMany({
    where: { classroomId: id },
    include: { student: { select: { id: true, name: true, email: true, grade: true } } },
    orderBy: { joinedAt: 'desc' },
  })

  return NextResponse.json(members)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const url = new URL(req.url)
  const studentId = url.searchParams.get('studentId')
  if (!studentId) {
    return NextResponse.json({ error: 'studentId required' }, { status: 400 })
  }

  const classroom = await prisma.classroom.findUnique({ where: { id } })
  if (!classroom || (classroom.teacherId !== session.userId && session.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await prisma.classroomMember.delete({
    where: { classroomId_studentId: { classroomId: id, studentId } },
  })

  return NextResponse.json({ message: 'Siswa berhasil dikeluarkan' })
}
