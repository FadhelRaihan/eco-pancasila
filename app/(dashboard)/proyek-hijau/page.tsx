"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Proyek {
  id: string
  title: string
  category: string
  classroom: { id: string; name: string }
  dueDate: string | null
  _count: { submits: number }
}

const categoryLabels: Record<string, string> = {
  SETTING_INFRASTRUCTURE: "Setting & Infrastructure",
  ENERGY_CLIMATE: "Energy & Climate",
  WASTE: "Waste",
  WATER: "Water",
  TRANSPORTATION: "Transportation",
  EDUCATION_RESEARCH: "Education & Research",
}

export default function ProyekHijauPage() {
  const [data, setData] = useState<Proyek[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/proyek-hijau")
      .then(res => res.json())
      .then(d => setData(d))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Proyek Hijau</h1>
          <p className="text-muted-foreground">Implementasi GreenMetric di kelas</p>
        </div>
        <Link href="/proyek-hijau/buat"><Button><Plus className="mr-2 h-4 w-4" />Buat Proyek</Button></Link>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => <Card key={i} className="animate-pulse"><CardContent className="h-24" /></Card>)}
        </div>
      ) : data.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center py-12"><Leaf className="mb-4 h-12 w-12 text-muted-foreground" /><p className="text-muted-foreground">Belum ada proyek hijau</p></CardContent></Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map(p => (
            <Link key={p.id} href={`/proyek-hijau/${p.id}`}>
              <Card className="transition-colors hover:border-green-300">
                <CardContent className="p-4">
                  <Badge variant="outline" className="mb-2 text-[10px]">{categoryLabels[p.category] || p.category}</Badge>
                  <h3 className="font-medium">{p.title}</h3>
                  <p className="text-xs text-muted-foreground">{p.classroom.name}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{p._count.submits} pengumpulan</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
