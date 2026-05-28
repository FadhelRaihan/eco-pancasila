"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Log {
  id: string
  status: string
  fileUrl: string | null
  note: string | null
  student: { id: string; name: string }
}

interface Aktivitas {
  id: string
  title: string
  description: string
  type: string
  dueDate: string | null
  classroom: { id: string; name: string }
  logs: Log[]
}

export default function DetailAktivitasPage() {
  const { id } = useParams()
  const [data, setData] = useState<Aktivitas | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/aktivitas/${id}`)
      .then(res => res.json())
      .then(d => setData(d))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <Card className="animate-pulse"><CardContent className="h-48" /></Card>
  if (!data) return <div className="py-12 text-center text-muted-foreground">Aktivitas tidak ditemukan</div>

  const statusColors: Record<string, string> = { BELUM: "bg-zinc-100 text-zinc-600", SEDANG: "bg-blue-100 text-blue-700", SELESAI: "bg-green-100 text-green-700", DINILAI: "bg-purple-100 text-purple-700" }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Badge>{data.type}</Badge>
        <h1 className="mt-2 text-2xl font-bold">{data.title}</h1>
        <p className="text-muted-foreground">{data.classroom.name}</p>
        {data.dueDate && <p className="text-sm text-muted-foreground">Batas: {new Date(data.dueDate).toLocaleDateString("id-ID")}</p>}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Deskripsi</CardTitle></CardHeader>
        <CardContent><p className="text-sm">{data.description}</p></CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Pengumpulan Siswa</CardTitle></CardHeader>
        <CardContent>
          {data.logs.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada pengumpulan</p>
          ) : (
            <div className="divide-y">
              {data.logs.map(l => (
                <div key={l.id} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium">{l.student.name}</p>
                    {l.note && <p className="text-xs text-muted-foreground">{l.note}</p>}
                  </div>
                  <Badge className={statusColors[l.status]}>{l.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
