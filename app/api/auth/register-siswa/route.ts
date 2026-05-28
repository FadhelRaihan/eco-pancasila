import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  classCode: z.string().min(6),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = schema.parse(body)

    const classroom = await prisma.classroom.findUnique({
      where: { code: data.classCode, isActive: true },
    })
    if (!classroom) {
      return NextResponse.json({ error: 'Kode kelas tidak ditemukan atau sudah tidak aktif' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email: data.email } })
    if (existing) {
      return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 400 })
    }

    const passwordHash = await hashPassword(data.password)

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role: 'SISWA',
        grade: classroom.grade,
        isVerified: true,
        memberships: {
          create: { classroomId: classroom.id },
        },
      },
    })

    return NextResponse.json({ message: 'Akun siswa berhasil dibuat' }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 422 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
