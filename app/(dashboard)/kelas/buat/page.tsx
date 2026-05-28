"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Leaf, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const subjects = [
  "PPKn", "Bahasa Indonesia", "Matematika", "IPA", "IPS",
  "SBdP", "PJOK", "Pendidikan Agama", "Muatan Lokal",
]

export default function BuatKelasPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const form = new FormData(e.currentTarget)
    const res = await fetch("/api/kelas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        subject: form.get("subject"),
        grade: Number(form.get("grade")),
        description: form.get("description"),
      }),
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data.error || "Gagal membuat kelas")
      setLoading(false)
      return
    }

    router.push(`/kelas/${data.id}`)
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Buat Kelas Baru</h1>
        <p className="text-muted-foreground">Buat kelas untuk materi dan kuis digital</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informasi Kelas</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Nama Kelas</Label>
              <Input id="name" name="name" placeholder="Contoh: Kelas 4A" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Mata Pelajaran</Label>
              <select
                id="subject"
                name="subject"
                className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-xs"
                required
              >
                <option value="">Pilih mata pelajaran</option>
                {subjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="grade">Kelas (1-6)</Label>
              <select
                id="grade"
                name="grade"
                className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-xs"
                required
              >
                {[1, 2, 3, 4, 5, 6].map(g => <option key={g} value={g}>Kelas {g}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi (opsional)</Label>
              <textarea
                id="description"
                name="description"
                className="flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs"
                placeholder="Deskripsi kelas..."
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              {loading ? "Menyimpan..." : "Buat Kelas"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
