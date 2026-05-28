import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { z } from 'zod'

const submitSchema = z.object({
  answers: z.record(z.string(), z.string()),
  classroomId: z.string(),
})

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session.isLoggedIn || session.role !== 'SISWA') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    const body = await req.json()
    const { answers, classroomId } = submitSchema.parse(body)

    const existing = await prisma.quizResponse.findUnique({
      where: { quizId_studentId_classroomId: { quizId: id, studentId: session.userId, classroomId } },
    })
    if (existing) {
      return NextResponse.json({ error: 'Anda sudah mengerjakan kuis ini' }, { status: 400 })
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: { questions: true },
    })
    if (!quiz) {
      return NextResponse.json({ error: 'Kuis tidak ditemukan' }, { status: 404 })
    }

    let correct = 0
    for (const q of quiz.questions) {
      if (answers[q.id] === q.answer) correct++
    }
    const score = quiz.questions.length > 0
      ? (correct / quiz.questions.length) * 100
      : 0

    const response = await prisma.quizResponse.create({
      data: {
        quizId: id,
        studentId: session.userId,
        classroomId,
        answers,
        score,
      },
    })

    return NextResponse.json({
      score,
      correct,
      total: quiz.questions.length,
      passed: score >= quiz.passingScore,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 422 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
