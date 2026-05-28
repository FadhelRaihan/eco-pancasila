"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Users, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Post {
  id: string
  title: string | null
  content: string
  author: { id: string; name: string; school: string | null }
  _count: { replies: number }
  createdAt: string
}

export default function KomunitasPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/komunitas")
      .then(res => res.json())
      .then(d => setPosts(d))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Komunitas MGMP</h1>
          <p className="text-muted-foreground">Forum diskusi sesama guru PPKn</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" />Buat Diskusi</Button>
      </div>

      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map(i => <Card key={i} className="animate-pulse"><CardContent className="h-20" /></Card>)}</div>
      ) : posts.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center py-12"><MessageSquare className="mb-4 h-12 w-12 text-muted-foreground" /><p className="text-muted-foreground">Belum ada diskusi</p></CardContent></Card>
      ) : (
        <div className="space-y-3">
          {posts.map(p => (
            <Link key={p.id} href={`/komunitas/${p.id}`}>
              <Card className="transition-colors hover:border-green-300">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {p.title && <h3 className="font-medium">{p.title}</h3>}
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{p.content}</p>
                      <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Users className="h-3 w-3" />{p.author.name}</span>
                        <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" />{p._count.replies} balasan</span>
                      </div>
                    </div>
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
