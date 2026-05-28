import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { z } from 'zod'

const submitSchema = z.object({
  fileUrl: z.string().optional(),
  note: z.string().optional(),
})

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session.isLoggedIn || session.role !== 'SISWA') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    const body = await req.json()
    const data = submitSchema.parse(body)

    const aktivitas = await prisma.activity.findUnique({ where: { id } })
    if (!aktivitas) {
      return NextResponse.json({ error: 'Aktivitas tidak ditemukan' }, { status: 404 })
    }

    const log = await prisma.activityLog.upsert({
      where: { activityId_studentId: { activityId: id, studentId: session.userId } },
      update: { fileUrl: data.fileUrl, note: data.note, status: 'SELESAI' },
      create: {
        activityId: id,
        studentId: session.userId,
        fileUrl: data.fileUrl,
        note: data.note,
        status: 'SELESAI',
      },
    })

    return NextResponse.json(log)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 422 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
