"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Leaf, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const form = new FormData(e.currentTarget)
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data.error)
      setLoading(false)
      return
    }

    router.push(data.role === "ADMIN" ? "/admin" : "/dashboard")
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mb-2 flex justify-center">
          <Leaf className="h-10 w-10 text-green-600" />
        </div>
        <CardTitle className="text-xl">Masuk</CardTitle>
        <CardDescription>Masuk ke akun Eco Pancasila Anda</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="guru@sekolah.sch.id" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" placeholder="Minimal 8 karakter" required />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            <LogIn className="mr-2 h-4 w-4" />
            {loading ? "Memproses..." : "Masuk"}
          </Button>
        </form>
        <div className="mt-4 space-y-2 text-center text-sm">
          <div>
            <Link href="/forgot-password" className="text-green-600 hover:underline">
              Lupa password?
            </Link>
          </div>
          <div className="text-muted-foreground">
            Belum punya akun?{" "}
            <Link href="/register" className="text-green-600 hover:underline">
              Daftar Guru
            </Link>{" "}
            atau{" "}
            <Link href="/register-siswa" className="text-green-600 hover:underline">
              Daftar Siswa
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
