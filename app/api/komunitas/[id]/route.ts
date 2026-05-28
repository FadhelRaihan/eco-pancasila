import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { z } from 'zod'

const replySchema = z.object({
  content: z.string().min(1),
})

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true, school: true, avatarUrl: true } },
      replies: {
        include: { author: { select: { id: true, name: true, school: true, avatarUrl: true } } },
        orderBy: { createdAt: 'asc' },
      },
    },
  })

  if (!post) {
    return NextResponse.json({ error: 'Postingan tidak ditemukan' }, { status: 404 })
  }

  return NextResponse.json(post)
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session.isLoggedIn || session.role !== 'GURU') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    const body = await req.json()
    const data = replySchema.parse(body)

    const reply = await prisma.post.create({
      data: {
        content: data.content,
        authorId: session.userId,
        parentId: id,
      },
      include: { author: { select: { id: true, name: true, school: true } } },
    })

    return NextResponse.json(reply, { status: 201 })
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
  const post = await prisma.post.findUnique({ where: { id } })
  if (!post || (post.authorId !== session.userId && session.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await prisma.post.delete({ where: { id } })
  return NextResponse.json({ message: 'Postingan berhasil dihapus' })
}
