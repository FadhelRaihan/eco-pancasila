"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Copy, Users, BookOpen, ClipboardList, Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface KelasDetail {
  id: string
  name: string
  code: string
  subject: string
  grade: number
  description: string | null
  isActive: boolean
  teacher: { name: string; email: string }
  members: { student: { id: string; name: string; email: string } }[]
  _count: { materials: number; quizzes: number; activities: number }
}

export default function DetailKelasPage() {
  const { id } = useParams()
  const [kelas, setKelas] = useState<KelasDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/kelas/${id}`)
      .then(res => res.json())
      .then(data => setKelas(data))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return <div className="space-y-4">{[1, 2, 3].map(i => <Card key={i} className="animate-pulse"><CardContent className="h-24" /></Card>)}</div>
  }

  if (!kelas) {
    return <div className="py-12 text-center text-muted-foreground">Kelas tidak ditemukan</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">{kelas.name}</h1>
          <Badge variant={kelas.isActive ? "default" : "secondary"}>{kelas.isActive ? "Aktif" : "Nonaktif"}</Badge>
        </div>
        <p className="text-muted-foreground">{kelas.subject} • Kelas {kelas.grade}</p>
        <p className="text-xs text-muted-foreground">Guru: {kelas.teacher.name}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <BookOpen className="h-4 w-4 text-green-600" />
            <CardTitle className="text-sm">Materi</CardTitle>
          </CardHeader>
          <CardContent><span className="text-2xl font-bold">{kelas._count.materials}</span></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <ClipboardList className="h-4 w-4 text-orange-600" />
            <CardTitle className="text-sm">Kuis</CardTitle>
          </CardHeader>
          <CardContent><span className="text-2xl font-bold">{kelas._count.quizzes}</span></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <Activity className="h-4 w-4 text-blue-600" />
            <CardTitle className="text-sm">Aktivitas</CardTitle>
          </CardHeader>
          <CardContent><span className="text-2xl font-bold">{kelas._count.activities}</span></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Daftar Siswa</CardTitle>
            <button
              onClick={() => navigator.clipboard.writeText(kelas.code)}
              className="flex items-center gap-1 text-sm text-green-600 hover:underline"
            >
              <Copy className="h-3.5 w-3.5" />
              {kelas.code}
            </button>
          </div>
        </CardHeader>
        <CardContent>
          {kelas.members.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-sm text-muted-foreground">
              <Users className="mb-2 h-8 w-8" />
              Belum ada siswa bergabung. Bagikan kode kelas kepada siswa.
            </div>
          ) : (
            <div className="divide-y">
              {kelas.members.map(m => (
                <div key={m.student.id} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium">{m.student.name}</p>
                    <p className="text-xs text-muted-foreground">{m.student.email}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
