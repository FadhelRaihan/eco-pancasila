"use client"

import { useState } from "react"
import { Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function RefleksiPage() {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Jurnal Refleksi</h1>
        <p className="text-muted-foreground">Catat refleksi pembelajaran harian Anda</p>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base">Refleksi Hari Ini</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Judul Refleksi</Label>
              <Input id="title" name="title" placeholder="Judul refleksi" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mood">Mood</Label>
              <select id="mood" name="mood" className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-xs">
                <option value="baik">Baik</option>
                <option value="cukup">Cukup</option>
                <option value="perlu-perbaikan">Perlu Perbaikan</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Catatan</Label>
              <textarea id="content" name="content" className="flex min-h-[200px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs" placeholder="Tulis refleksi Anda..." required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              <Save className="mr-2 h-4 w-4" />{loading ? "Menyimpan..." : "Simpan Refleksi"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
