"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Leaf, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function RegisterSiswaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const form = new FormData(e.currentTarget)
    const res = await fetch("/api/auth/register-siswa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        password: form.get("password"),
        classCode: form.get("classCode"),
      }),
    })

    const data = await res.json()
    if (!res.ok) {
      setError(typeof data.error === "string" ? data.error : "Registrasi gagal")
      setLoading(false)
      return
    }

    router.push("/login")
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mb-2 flex justify-center">
          <Leaf className="h-10 w-10 text-green-600" />
        </div>
        <CardTitle className="text-xl">Daftar Siswa</CardTitle>
        <CardDescription>Masukkan kode kelas dari guru Anda</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
          )}
          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input id="name" name="name" placeholder="Nama lengkap siswa" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="contoh@email.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="classCode">Kode Kelas</Label>
            <Input id="classCode" name="classCode" placeholder="ECO-4A-XXXX" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" placeholder="Minimal 8 karakter" required minLength={8} />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            <UserPlus className="mr-2 h-4 w-4" />
            {loading ? "Memproses..." : "Daftar"}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-green-600 hover:underline">Masuk</Link>
        </div>
      </CardContent>
    </Card>
  )
}
