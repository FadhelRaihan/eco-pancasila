"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Activity as ActivityIcon, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Aktivitas {
  id: string
  title: string
  type: string
  dueDate: string | null
  classroom: { id: string; name: string }
  author: { name: string }
  _count: { logs: number }
}

export default function AktivitasPage() {
  const [data, setData] = useState<Aktivitas[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/aktivitas")
      .then(res => res.json())
      .then(d => setData(d))
      .finally(() => setLoading(false))
  }, [])

  const typeColors: Record<string, string> = { DISKUSI: "bg-blue-100 text-blue-700", LEMBAR_KERJA: "bg-green-100 text-green-700", STUDI_KASUS: "bg-orange-100 text-orange-700", PRESENTASI: "bg-purple-100 text-purple-700" }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Aktivitas</h1>
          <p className="text-muted-foreground">Kelola aktivitas pembelajaran</p>
        </div>
        <Link href="/aktivitas/buat"><Button><Plus className="mr-2 h-4 w-4" />Buat Aktivitas</Button></Link>
      </div>
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => <Card key={i} className="animate-pulse"><CardContent className="h-24" /></Card>)}
        </div>
      ) : data.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center py-12"><ActivityIcon className="mb-4 h-12 w-12 text-muted-foreground" /><p className="text-muted-foreground">Belum ada aktivitas</p></CardContent></Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map(a => (
            <Link key={a.id} href={`/aktivitas/${a.id}`}>
              <Card className="transition-colors hover:border-green-300">
                <CardContent className="p-4">
                  <div className="mb-2"><Badge className={typeColors[a.type]}>{a.type}</Badge></div>
                  <h3 className="font-medium">{a.title}</h3>
                  <p className="text-xs text-muted-foreground">{a.classroom.name}</p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{a._count.logs} pengumpulan</span>
                    {a.dueDate && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(a.dueDate).toLocaleDateString("id-ID")}</span>}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
