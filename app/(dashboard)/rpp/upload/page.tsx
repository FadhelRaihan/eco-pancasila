"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import FileUploader from "@/components/shared/FileUploader"

export default function UploadRppPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fileUrl, setFileUrl] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = new FormData(e.currentTarget)
    await fetch("/api/rpp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.get("title"),
        subject: form.get("subject"),
        grade: Number(form.get("grade")),
        fileUrl: fileUrl || undefined,
      }),
    })

    setLoading(false)
    router.push("/rpp")
  }

  const subjects = ["PPKn", "Bahasa Indonesia", "Matematika", "IPA", "IPS", "SBdP", "PJOK"]

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Upload RPP</h1>
        <p className="text-muted-foreground">Bagikan RPP digital</p>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base">Detail RPP</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Judul RPP</Label>
              <Input id="title" name="title" placeholder="Judul RPP" required />
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
                <Label htmlFor="grade">Kelas</Label>
                <select id="grade" name="grade" className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-xs" required>
                  {[1, 2, 3, 4, 5, 6].map(g => <option key={g} value={g}>Kelas {g}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Upload File RPP (PDF)</Label>
              <FileUploader folder="rpp" onUploadComplete={setFileUrl} accept=".pdf" />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              <Save className="mr-2 h-4 w-4" />{loading ? "Menyimpan..." : "Simpan RPP"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
