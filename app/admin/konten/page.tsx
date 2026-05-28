"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminKontenPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Moderasi Konten</h1>
        <p className="text-muted-foreground">Kelola dan moderasi konten platform</p>
      </div>
      <Tabs defaultValue="materi">
        <TabsList>
          <TabsTrigger value="materi">Materi</TabsTrigger>
          <TabsTrigger value="kuis">Kuis</TabsTrigger>
          <TabsTrigger value="aktivitas">Aktivitas</TabsTrigger>
          <TabsTrigger value="komunitas">Komunitas</TabsTrigger>
        </TabsList>
        {["materi", "kuis", "aktivitas", "komunitas"].map(tab => (
          <TabsContent key={tab} value={tab}>
            <Card>
              <CardContent className="flex items-center justify-center py-12 text-sm text-muted-foreground">
                Belum ada konten untuk dimoderasi
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
