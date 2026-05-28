import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { resend } from '@/lib/resend'

export async function GET() {
  try {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const activities = await prisma.activity.findMany({
      where: {
        dueDate: { gte: today, lte: tomorrow },
      },
      include: {
        classroom: {
          include: {
            members: { include: { student: true } },
          },
        },
        author: true,
      },
    })

    for (const activity of activities) {
      for (const member of activity.classroom.members) {
        if (member.student.email) {
          await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL!,
            to: member.student.email,
            subject: `📝 ${activity.title} — Eco Pancasila`,
            html: `<h2>Halo ${member.student.name},</h2>
              <p>Aktivitas <strong>${activity.title}</strong> akan segera jatuh tempo pada ${activity.dueDate?.toLocaleDateString('id-ID')}.</p>
              <p>Jangan lupa untuk mengumpulkan tugas Anda.</p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/aktivitas/${activity.id}">Buka Aktivitas</a>`,
          })
        }
      }
    }

    return NextResponse.json({ message: 'Cron job berhasil', processed: activities.length })
  } catch (error) {
    return NextResponse.json({ error: 'Cron job gagal' }, { status: 500 })
  }
}
