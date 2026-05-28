"use client"

import { useState } from "react"
import Link from "next/link"
import { Leaf, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = new FormData(e.currentTarget)
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.get("email") }),
    })

    setLoading(false)
    setSent(true)
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mb-2 flex justify-center">
          <Leaf className="h-10 w-10 text-green-600" />
        </div>
        <CardTitle className="text-xl">Lupa Password</CardTitle>
        <CardDescription>Masukkan email untuk mereset password</CardDescription>
      </CardHeader>
      <CardContent>
        {sent ? (
          <div className="text-center text-sm text-green-600">
            Jika email terdaftar, tautan reset akan dikirim ke email Anda.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="email@sekolah.sch.id" required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              <Send className="mr-2 h-4 w-4" />
              {loading ? "Mengirim..." : "Kirim Tautan Reset"}
            </Button>
          </form>
        )}
        <div className="mt-4 text-center text-sm text-muted-foreground">
          <Link href="/login" className="text-green-600 hover:underline">Kembali ke login</Link>
        </div>
      </CardContent>
    </Card>
  )
}
