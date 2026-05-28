"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { FileText, Video, Calendar, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Materi {
  id: string
  title: string
  description: string | null
  subject: string
  grade: number
  type: string
  fileUrl: string | null
  youtubeUrl: string | null
  content: string | null
  author: { name: string; school: string | null }
  createdAt: string
}

export default function DetailMateriPage() {
  const { id } = useParams()
  const [materi, setMateri] = useState<Materi | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/materi/${id}`)
      .then(res => res.json())
      .then(data => setMateri(data))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="space-y-4">{[1, 2].map(i => <Card key={i} className="animate-pulse"><CardContent className="h-24" /></Card>)}</div>
  if (!materi) return <div className="py-12 text-center text-muted-foreground">Materi tidak ditemukan</div>

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <Badge>{materi.type}</Badge>
          <span className="text-xs text-muted-foreground">{materi.subject} • Kelas {materi.grade}</span>
        </div>
        <h1 className="text-2xl font-bold">{materi.title}</h1>
        {materi.description && <p className="mt-2 text-muted-foreground">{materi.description}</p>}
        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><User className="h-3 w-3" />{materi.author.name}</span>
          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(materi.createdAt).toLocaleDateString("id-ID")}</span>
        </div>
      </div>

      {materi.youtubeUrl && (
        <div className="aspect-video overflow-hidden rounded-lg">
          <iframe
            src={materi.youtubeUrl.replace("watch?v=", "embed/")}
            className="h-full w-full"
            allowFullScreen
          />
        </div>
      )}

      {materi.fileUrl && materi.fileUrl.endsWith(".pdf") && (
        <Card>
          <CardHeader><CardTitle className="text-base">Preview</CardTitle></CardHeader>
          <CardContent>
            <iframe src={materi.fileUrl} className="h-[600px] w-full rounded-lg" />
          </CardContent>
        </Card>
      )}

      {materi.fileUrl && !materi.fileUrl.endsWith(".pdf") && (
        <a href={materi.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg border p-4 text-sm hover:bg-muted">
          <FileText className="h-5 w-5 text-green-600" />
          Buka File Materi
        </a>
      )}

      {materi.content && (
        <Card>
          <CardHeader><CardTitle className="text-base">Konten</CardTitle></CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: materi.content }} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
