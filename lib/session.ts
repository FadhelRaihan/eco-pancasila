import { SessionOptions, getIronSession } from 'iron-session'
import { cookies } from 'next/headers'

export type Role = 'ADMIN' | 'GURU' | 'SISWA'

export interface SessionData {
  userId: string
  name: string
  email: string
  role: Role
  isLoggedIn: boolean
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: 'eco-pancasila-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
  },
}

export async function getSession() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions)
  return session
}
