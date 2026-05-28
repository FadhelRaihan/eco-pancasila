import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendWelcomeEmail(to: string, name: string) {
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to,
    subject: '🌿 Selamat Datang di Eco Pancasila',
    html: `
      <h2>Halo ${name}! 👋</h2>
      <p>Akun Eco Pancasila Anda telah berhasil dibuat.</p>
      <p>Mulai belajar dan berkolaborasi di platform Eco Pancasila.</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/login">Masuk Sekarang</a>
    `,
  })
}

export async function sendPasswordResetEmail(to: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to,
    subject: '🔐 Reset Password Eco Pancasila',
    html: `
      <h2>Reset Password</h2>
      <p>Klik link berikut untuk mereset password Anda (berlaku 1 jam):</p>
      <a href="${resetUrl}">Reset Password</a>
    `,
  })
}

export async function sendNotifEmail(to: string, name: string, title: string, message: string, link?: string) {
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to,
    subject: `🌿 ${title} — Eco Pancasila`,
    html: `
      <h2>Halo ${name},</h2>
      <p>${message}</p>
      ${link ? `<a href="${link}">Lihat Selengkapnya</a>` : ''}
    `,
  })
}
