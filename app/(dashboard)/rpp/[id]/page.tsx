"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { FileText } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function DetailRppPage() {
  const { id } = useParams()
  const [rpp, setRpp] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/rpp/${id}`)
      .then(res => res.json())
      .then(data => setRpp(data))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <Card className="animate-pulse"><CardContent className="h-48" /></Card>
  if (!rpp) return <div className="py-12 text-center text-muted-foreground">RPP tidak ditemukan</div>

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{rpp.title}</h1>
        <p className="text-muted-foreground">{rpp.subject} • Kelas {rpp.grade}</p>
      </div>

      {rpp.fileUrl && (
        <iframe src={rpp.fileUrl} className="h-[800px] w-full rounded-lg border" />
      )}

      {rpp.content && (
        <Card>
          <CardContent className="p-6">
            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: rpp.content }} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
