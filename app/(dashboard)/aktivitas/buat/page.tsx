"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function BuatAktivitasPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = new FormData(e.currentTarget)
    const res = await fetch("/api/aktivitas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.get("title"),
        description: form.get("description"),
        type: form.get("type"),
        classroomId: form.get("classroomId"),
        dueDate: form.get("dueDate") ? new Date(form.get("dueDate") as string).toISOString() : undefined,
      }),
    })
    if (res.ok) router.push("/aktivitas")
    setLoading(false)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Buat Aktivitas</h1>
        <p className="text-muted-foreground">Buat aktivitas pembelajaran untuk siswa</p>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base">Detail Aktivitas</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Judul Aktivitas</Label>
              <Input id="title" name="title" placeholder="Judul aktivitas" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <textarea id="description" name="description" className="flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs" placeholder="Deskripsi aktivitas..." required />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="type">Tipe</Label>
                <select id="type" name="type" className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-xs" required>
                  <option value="DISKUSI">Diskusi</option>
                  <option value="LEMBAR_KERJA">Lembar Kerja</option>
                  <option value="STUDI_KASUS">Studi Kasus</option>
                  <option value="PRESENTASI">Presentasi</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="classroomId">Kelas</Label>
                <select id="classroomId" name="classroomId" className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-xs" required>
                  <option value="">Pilih kelas</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Batas Waktu</Label>
              <Input id="dueDate" name="dueDate" type="date" />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              <Save className="mr-2 h-4 w-4" />{loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
