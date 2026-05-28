"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Question {
  text: string
  options: string[]
  answer: string
  order: number
}

export default function BuatKuisPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([
    { text: "", options: ["", "", "", ""], answer: "0", order: 1 },
  ])

  function addQuestion() {
    setQuestions([...questions, { text: "", options: ["", "", "", ""], answer: "0", order: questions.length + 1 }])
  }

  function removeQuestion(index: number) {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  function updateQuestion(index: number, field: keyof Question, value: string | number) {
    const q = [...questions]
    ;(q[index] as any)[field] = value
    setQuestions(q)
  }

  function updateOption(qIndex: number, oIndex: number, value: string) {
    const q = [...questions]
    q[qIndex].options[oIndex] = value
    setQuestions(q)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const res = await fetch("/api/kuis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.get("title"),
        description: form.get("description"),
        duration: form.get("duration") ? Number(form.get("duration")) : undefined,
        passingScore: Number(form.get("passingScore")) || 70,
        questions: questions.map((q, i) => ({ ...q, order: i + 1 })),
      }),
    })

    if (res.ok) router.push("/kuis")
    setLoading(false)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Buat Kuis</h1>
        <p className="text-muted-foreground">Buat kuis interaktif untuk siswa</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Informasi Kuis</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Judul Kuis</Label>
              <Input id="title" name="title" placeholder="Judul kuis" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <textarea id="description" name="description" className="flex min-h-[60px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs" placeholder="Deskripsi kuis..." />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="duration">Durasi (menit, opsional)</Label>
                <Input id="duration" name="duration" type="number" placeholder="60" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="passingScore">Nilai Minimal</Label>
                <Input id="passingScore" name="passingScore" type="number" defaultValue={70} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Pertanyaan</h2>
            <Button type="button" variant="outline" size="sm" onClick={addQuestion}>
              <Plus className="mr-1 h-4 w-4" />Tambah Soal
            </Button>
          </div>
          {questions.map((q, qi) => (
            <Card key={qi}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Soal {qi + 1}</CardTitle>
                  {questions.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => removeQuestion(qi)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input placeholder="Teks pertanyaan..." value={q.text} onChange={e => updateQuestion(qi, "text", e.target.value)} required />
                {q.options.map((opt, oi) => (
                  <div key={oi} className="flex items-center gap-2">
                    <input type="radio" name={`answer-${qi}`} checked={q.answer === String(oi)} onChange={() => updateQuestion(qi, "answer", String(oi))} className="accent-green-600" />
                    <Input placeholder={`Pilihan ${String.fromCharCode(65 + oi)}`} value={opt} onChange={e => updateOption(qi, oi, e.target.value)} required />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          <Save className="mr-2 h-4 w-4" />{loading ? "Menyimpan..." : "Simpan Kuis"}
        </Button>
      </form>
    </div>
  )
}
