"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Users, BookOpen, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Kelas {
  id: string
  name: string
  code: string
  subject: string
  grade: number
  isActive: boolean
  _count: { members: number }
}

export default function KelasPage() {
  const [kelas, setKelas] = useState<Kelas[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/kelas")
      .then(res => res.json())
      .then(data => setKelas(data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Kelas Saya</h1>
          <p className="text-muted-foreground">Kelola kelas dan siswa Anda</p>
        </div>
        <Link href="/kelas/buat">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Buat Kelas
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="h-32" />
            </Card>
          ))}
        </div>
      ) : kelas.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">Belum ada kelas. Buat kelas pertama Anda!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {kelas.map(k => (
            <Link key={k.id} href={`/kelas/${k.id}`}>
              <Card className="transition-colors hover:border-green-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{k.name}</CardTitle>
                      <p className="text-xs text-muted-foreground">{k.subject} • Kelas {k.grade}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px]">
                      {k.isActive ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {k._count.members} siswa
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        navigator.clipboard.writeText(k.code)
                      }}
                      className="flex items-center gap-1 text-green-600 hover:underline"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      {k.code}
                    </button>
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
