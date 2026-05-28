"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function DetailProyekPage() {
  const { id } = useParams()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/proyek-hijau/${id}`)
      .then(res => res.json())
      .then(d => setData(d))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <Card className="animate-pulse"><CardContent className="h-48" /></Card>
  if (!data) return <div className="py-12 text-center text-muted-foreground">Proyek tidak ditemukan</div>

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Badge variant="outline">{data.category}</Badge>
        <h1 className="mt-2 text-2xl font-bold">{data.title}</h1>
        <p className="text-muted-foreground">{data.classroom.name}</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Deskripsi</CardTitle></CardHeader>
        <CardContent><p className="text-sm">{data.description}</p></CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Pengumpulan Siswa</CardTitle></CardHeader>
        <CardContent>
          {data.submits?.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada pengumpulan</p>
          ) : (
            <div className="divide-y">
              {data.submits?.map((s: any) => (
                <div key={s.id} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium">{s.student.name}</p>
                    {s.description && <p className="text-xs text-muted-foreground">{s.description}</p>}
                  </div>
                  <Badge>{s.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
