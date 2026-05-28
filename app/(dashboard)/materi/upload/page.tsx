"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Upload, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import FileUploader from "@/components/shared/FileUploader"

const subjects = ["PPKn", "Bahasa Indonesia", "Matematika", "IPA", "IPS", "SBdP", "PJOK"]
const types = ["MATERI", "RPP", "MODUL", "MEDIA", "INFOGRAFIS"]

export default function UploadMateriPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [fileUrl, setFileUrl] = useState("")
  const [youtubeUrl, setYoutubeUrl] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const form = new FormData(e.currentTarget)
    const res = await fetch("/api/materi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.get("title"),
        description: form.get("description"),
        subject: form.get("subject"),
        grade: Number(form.get("grade")),
        type: form.get("type"),
        fileUrl: fileUrl || undefined,
        youtubeUrl: youtubeUrl || undefined,
      }),
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data.error || "Gagal upload")
      setLoading(false)
      return
    }

    router.push("/materi")
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Upload Materi</h1>
        <p className="text-muted-foreground">Bagikan materi pembelajaran ke kelas</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Detail Materi</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

            <div className="space-y-2">
              <Label htmlFor="title">Judul Materi</Label>
              <Input id="title" name="title" placeholder="Judul materi" required />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="subject">Mata Pelajaran</Label>
                <select id="subject" name="subject" className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-xs" required>
                  <option value="">Pilih</option>
                  {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Tipe</Label>
                <select id="type" name="type" className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-xs" required>
                  {types.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="grade">Kelas</Label>
              <select id="grade" name="grade" className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-xs" required>
                {[1, 2, 3, 4, 5, 6].map(g => <option key={g} value={g}>Kelas {g}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <textarea id="description" name="description" className="flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs" placeholder="Deskripsi materi..." />
            </div>

            <div className="space-y-2">
              <Label>Upload File (PDF/Gambar/Video)</Label>
              <FileUploader folder="materi" onUploadComplete={setFileUrl} accept=".pdf,.jpg,.png,.webp,.mp4" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="youtubeUrl">Atau Link YouTube (opsional)</Label>
              <Input id="youtubeUrl" value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              {loading ? "Menyimpan..." : "Simpan Materi"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
