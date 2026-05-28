"use client"

import { ReactNode } from "react"
import { useRouter } from "next/navigation"

type Role = 'ADMIN' | 'GURU' | 'SISWA'

interface RoleGuardProps {
  allowedRoles: Role[]
  children: ReactNode
  fallback?: ReactNode
}

export default function RoleGuard({ allowedRoles, children, fallback }: RoleGuardProps) {
  const router = useRouter()

  const userRole: Role = "GURU"

  if (!allowedRoles.includes(userRole)) {
    if (fallback) return <>{fallback}</>
    router.push("/dashboard")
    return null
  }

  return <>{children}</>
}
