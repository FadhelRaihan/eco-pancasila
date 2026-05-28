"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, FileText, Video, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

interface Materi {
  id: string
  title: string
  description: string | null
  subject: string
  grade: number
  type: string
  youtubeUrl: string | null
  author: { name: string }
  createdAt: string
}

export default function MateriPage() {
  const [materi, setMateri] = useState<Materi[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetch("/api/materi")
      .then(res => res.json())
      .then(data => setMateri(data))
      .finally(() => setLoading(false))
  }, [])

  const filtered = materi.filter(m =>
    m.title.toLowerCase().includes(search.toLowerCase())
  )

  const typeColors: Record<string, string> = {
    MATERI: "bg-blue-100 text-blue-700",
    RPP: "bg-purple-100 text-purple-700",
    MODUL: "bg-green-100 text-green-700",
    MEDIA: "bg-orange-100 text-orange-700",
    INFOGRAFIS: "bg-pink-100 text-pink-700",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Materi Digital</h1>
          <p className="text-muted-foreground">Akses materi pembelajaran</p>
        </div>
        <Link href="/materi/upload">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Upload Materi
          </Button>
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Cari materi..."
          className="pl-9"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => <Card key={i} className="animate-pulse"><CardContent className="h-28" /></Card>)}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">Belum ada materi</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(m => (
            <Link key={m.id} href={`/materi/${m.id}`}>
              <Card className="transition-colors hover:border-green-300">
                <CardContent className="p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Badge className={typeColors[m.type] || ""}>{m.type}</Badge>
                    {m.youtubeUrl && <Video className="h-3.5 w-3.5 text-red-500" />}
                  </div>
                  <h3 className="mb-1 font-medium">{m.title}</h3>
                  <p className="mb-2 line-clamp-2 text-xs text-muted-foreground">{m.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{m.subject} • Kelas {m.grade}</span>
                    <span>{m.author.name}</span>
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
