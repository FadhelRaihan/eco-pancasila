"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, ClipboardList, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Kuis {
  id: string
  title: string
  description: string | null
  duration: number | null
  passingScore: number
  author: { name: string }
  _count: { questions: number; responses: number }
  createdAt: string
}

export default function KuisPage() {
  const [kuis, setKuis] = useState<Kuis[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/kuis")
      .then(res => res.json())
      .then(data => setKuis(data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">E-LKPD & Kuis</h1>
          <p className="text-muted-foreground">Buat dan kerjakan kuis interaktif</p>
        </div>
        <Link href="/kuis/buat">
          <Button><Plus className="mr-2 h-4 w-4" />Buat Kuis</Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => <Card key={i} className="animate-pulse"><CardContent className="h-24" /></Card>)}
        </div>
      ) : kuis.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center py-12"><ClipboardList className="mb-4 h-12 w-12 text-muted-foreground" /><p className="text-muted-foreground">Belum ada kuis</p></CardContent></Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {kuis.map(k => (
            <Link key={k.id} href={`/kuis/${k.id}`}>
              <Card className="transition-colors hover:border-green-300">
                <CardHeader>
                  <CardTitle className="text-base">{k.title}</CardTitle>
                  {k.description && <p className="text-xs text-muted-foreground">{k.description}</p>}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{k._count.questions} soal</span>
                    <span>{k._count.responses} respon</span>
                    {k.duration && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{k.duration} menit</span>}
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
