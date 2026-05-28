"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DetailKomunitasPage() {
  const { id } = useParams()
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/komunitas/${id}`)
      .then(res => res.json())
      .then(d => setPost(d))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <Card className="animate-pulse"><CardContent className="h-48" /></Card>
  if (!post) return <div className="py-12 text-center text-muted-foreground">Postingan tidak ditemukan</div>

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="mb-2 text-xs text-muted-foreground">{post.author.name} • {new Date(post.createdAt).toLocaleDateString("id-ID")}</div>
          {post.title && <h1 className="mb-3 text-xl font-bold">{post.title}</h1>}
          <p className="text-sm">{post.content}</p>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Balasan ({post.replies?.length || 0})</h2>
        <div className="space-y-3">
          {post.replies?.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada balasan</p>
          ) : (
            post.replies?.map((r: any) => (
              <Card key={r.id}>
                <CardContent className="p-4">
                  <div className="mb-1 text-xs text-muted-foreground">{r.author.name}</div>
                  <p className="text-sm">{r.content}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
