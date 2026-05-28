"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Clock, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Question {
  id: string
  text: string
  options: string[]
  order: number
  imageUrl: string | null
}

interface KuisData {
  id: string
  title: string
  description: string | null
  duration: number | null
  passingScore: number
  questions: Question[]
}

export default function KerjakanKuisPage() {
  const { id } = useParams()
  const router = useRouter()
  const [kuis, setKuis] = useState<KuisData | null>(null)
  const [loading, setLoading] = useState(true)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{ score: number; correct: number; total: number; passed: boolean } | null>(null)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)

  useEffect(() => {
    fetch(`/api/kuis/${id}`)
      .then(res => res.json())
      .then(data => {
        setKuis(data)
        if (data.duration) setTimeLeft(data.duration * 60)
      })
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return
    const timer = setInterval(() => setTimeLeft(t => t! - 1), 1000)
    return () => clearInterval(timer)
  }, [timeLeft])

  useEffect(() => {
    if (timeLeft === 0) handleSubmit()
  }, [timeLeft])

  async function handleSubmit() {
    if (submitting) return
    setSubmitting(true)

    const res = await fetch(`/api/kuis/${id}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers, classroomId: "" }),
    })

    const data = await res.json()
    if (res.ok) setResult(data)
    setSubmitting(false)
  }

  if (loading) return <Card className="animate-pulse"><CardContent className="h-64" /></Card>
  if (!kuis) return <div className="py-12 text-center text-muted-foreground">Kuis tidak ditemukan</div>

  if (result) {
    return (
      <div className="mx-auto max-w-lg space-y-6 py-12 text-center">
        <h1 className="text-2xl font-bold">Hasil Kuis</h1>
        <div className="rounded-full bg-green-100 p-8">
          <span className="text-5xl font-bold text-green-700">{result.score.toFixed(0)}</span>
          <span className="text-xl text-green-600">/100</span>
        </div>
        <p className="text-muted-foreground">
          {result.correct} benar dari {result.total} soal
        </p>
        <Badge className={result.passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
          {result.passed ? "Lulus" : "Tidak Lulus"}
        </Badge>
        <Button onClick={() => router.push("/kuis")} className="mt-4">Kembali</Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{kuis.title}</h1>
          {kuis.description && <p className="text-muted-foreground">{kuis.description}</p>}
        </div>
        {timeLeft !== null && (
          <div className="flex items-center gap-1 text-lg font-semibold text-green-700">
            <Clock className="h-5 w-5" />
            {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
          </div>
        )}
      </div>

      <div className="space-y-4">
        {kuis.questions.map((q, i) => (
          <Card key={q.id}>
            <CardHeader>
              <CardTitle className="text-base">
                {i + 1}. {q.text}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {q.options.map((opt, oi) => (
                <label key={oi} className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm transition-colors hover:bg-green-50 ${answers[q.id] === String(oi) ? "border-green-500 bg-green-50" : ""}`}>
                  <input type="radio" name={q.id} value={String(oi)} checked={answers[q.id] === String(oi)} onChange={() => setAnswers({ ...answers, [q.id]: String(oi) })} className="accent-green-600" />
                  {String.fromCharCode(65 + oi)}. {opt}
                </label>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <Button onClick={handleSubmit} className="w-full" disabled={submitting}>
        <Send className="mr-2 h-4 w-4" />{submitting ? "Mengirim..." : "Kumpulkan Jawaban"}
      </Button>
    </div>
  )
}
