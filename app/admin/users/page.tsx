"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface User {
  id: string
  name: string
  email: string
  role: string
  school: string | null
  isVerified: boolean
  createdAt: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/users")
      .then(res => res.json())
      .then(d => setUsers(d))
      .finally(() => setLoading(false))
  }, [])

  const roleColors: Record<string, string> = { ADMIN: "bg-red-100 text-red-700", GURU: "bg-green-100 text-green-700", SISWA: "bg-blue-100 text-blue-700" }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Kelola User</h1>
        <p className="text-muted-foreground">Manajemen akun pengguna</p>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base">Daftar User</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-sm text-muted-foreground">Memuat...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2 font-medium">Nama</th>
                    <th className="pb-2 font-medium">Email</th>
                    <th className="pb-2 font-medium">Role</th>
                    <th className="pb-2 font-medium">Sekolah</th>
                    <th className="pb-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="border-b last:border-0">
                      <td className="py-2">{u.name}</td>
                      <td className="py-2 text-muted-foreground">{u.email}</td>
                      <td className="py-2"><Badge className={roleColors[u.role]}>{u.role}</Badge></td>
                      <td className="py-2 text-muted-foreground">{u.school || "-"}</td>
                      <td className="py-2">{u.isVerified ? <Badge variant="outline">Terverifikasi</Badge> : <Badge variant="outline" className="text-red-600">Belum</Badge>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
