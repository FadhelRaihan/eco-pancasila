import bcrypt from 'bcryptjs'
import { prisma } from './prisma'
import { redis } from './redis'

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export async function checkLoginRateLimit(ip: string): Promise<boolean> {
  const key = `login:ratelimit:${ip}`
  const attempts = await redis.incr(key)
  if (attempts === 1) await redis.expire(key, 900)
  return attempts <= 5
}

export function generateClassCode(grade: number, className: string): string {
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `ECO-${grade}${className}-${random}`
}
