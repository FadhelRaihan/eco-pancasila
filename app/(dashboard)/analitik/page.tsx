"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp } from "lucide-react"

export default function AnalitikPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analitik</h1>
        <p className="text-muted-foreground">Pantau perkembangan dan kemajuan</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <BarChart3 className="h-4 w-4 text-green-600" />
            <CardTitle className="text-sm">Total Kelas</CardTitle>
          </CardHeader>
          <CardContent><span className="text-2xl font-bold">0</span></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <CardTitle className="text-sm">Materi Dibagikan</CardTitle>
          </CardHeader>
          <CardContent><span className="text-2xl font-bold">0</span></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <BarChart3 className="h-4 w-4 text-orange-600" />
            <CardTitle className="text-sm">Rata-rata Nilai</CardTitle>
          </CardHeader>
          <CardContent><span className="text-2xl font-bold">0</span></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Grafik Perkembangan</CardTitle></CardHeader>
        <CardContent>
          <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
            Data akan tampil setelah ada aktivitas pembelajaran
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
