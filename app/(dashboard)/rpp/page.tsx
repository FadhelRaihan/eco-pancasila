"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface RPP {
  id: string
  title: string
  subject: string
  grade: number
  author: { name: string }
  createdAt: string
}

export default function RppPage() {
  const [rpp, setRpp] = useState<RPP[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/rpp")
      .then(res => res.json())
      .then(data => setRpp(data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">RPP</h1>
          <p className="text-muted-foreground">Rencana Pelaksanaan Pembelajaran</p>
        </div>
        <Link href="/rpp/upload">
          <Button><Plus className="mr-2 h-4 w-4" />Upload RPP</Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => <Card key={i} className="animate-pulse"><CardContent className="h-20" /></Card>)}
        </div>
      ) : rpp.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center py-12"><FileText className="mb-4 h-12 w-12 text-muted-foreground" /><p className="text-muted-foreground">Belum ada RPP</p></CardContent></Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rpp.map(r => (
            <Link key={r.id} href={`/rpp/${r.id}`}>
              <Card className="transition-colors hover:border-green-300">
                <CardContent className="p-4">
                  <h3 className="font-medium">{r.title}</h3>
                  <p className="text-xs text-muted-foreground">{r.subject} • Kelas {r.grade}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{r.author.name}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
