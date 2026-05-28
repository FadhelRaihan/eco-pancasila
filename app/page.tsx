import Link from "next/link"
import { Leaf, GraduationCap, BookOpen, TreePine } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-green-600" />
            <span className="text-lg font-bold">Eco Pancasila</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Masuk</Button>
            </Link>
            <Link href="/register">
              <Button>Daftar Guru</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Eco-Friendly{" "}
              <span className="text-green-600">Paperless Classroom</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Platform Mobile Learning untuk Guru SD dalam program MGMP PPKn Kabupaten Sukabumi.
              Integrasikan nilai Pedagogi Pancasila dan prinsip GreenMetric ke dalam pembelajaran digital.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="text-base">Daftar sebagai Guru</Button>
              </Link>
              <Link href="/register-siswa">
                <Button size="lg" variant="outline" className="text-base">Daftar sebagai Siswa</Button>
              </Link>
            </div>
          </div>
        </section>
        <section className="border-t bg-green-50/50 py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="mb-10 text-center text-2xl font-bold">Fitur Utama</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <GraduationCap className="mb-2 h-8 w-8 text-green-600" />
                  <CardTitle>Materi Digital</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Upload dan akses materi pembelajaran dalam format PDF, video, infografis, dan RPP.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <BookOpen className="mb-2 h-8 w-8 text-green-600" />
                  <CardTitle>E-LKPD & Kuis</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Buat LKPD digital dan kuis interaktif dengan timer dan penilaian otomatis.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <TreePine className="mb-2 h-8 w-8 text-green-600" />
                  <CardTitle>Proyek Hijau</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Implementasi 6 kategori GreenMetric dalam proyek lingkungan berbasis kelas.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Eco Pancasila — MGMP PPKn Kabupaten Sukabumi
      </footer>
    </div>
  )
}
