"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const categories = [
  { value: "SETTING_INFRASTRUCTURE", label: "Setting & Infrastructure" },
  { value: "ENERGY_CLIMATE", label: "Energy & Climate" },
  { value: "WASTE", label: "Waste" },
  { value: "WATER", label: "Water" },
  { value: "TRANSPORTATION", label: "Transportation" },
  { value: "EDUCATION_RESEARCH", label: "Education & Research" },
]

export default function BuatProyekPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = new FormData(e.currentTarget)
    await fetch("/api/proyek-hijau", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.get("title"),
        description: form.get("description"),
        category: form.get("category"),
        classroomId: form.get("classroomId"),
        dueDate: form.get("dueDate") ? new Date(form.get("dueDate") as string).toISOString() : undefined,
      }),
    })
    setLoading(false)
    router.push("/proyek-hijau")
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Buat Proyek Hijau</h1>
        <p className="text-muted-foreground">Buat proyek lingkungan berbasis GreenMetric</p>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base">Detail Proyek</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Judul Proyek</Label>
              <Input id="title" name="title" placeholder="Judul proyek" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <textarea id="description" name="description" className="flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs" placeholder="Deskripsi proyek..." required />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Kategori GreenMetric</Label>
                <select id="category" name="category" className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-xs" required>
                  <option value="">Pilih kategori</option>
                  {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
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
