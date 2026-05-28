import { BookOpen, Users, ClipboardCheck, Bell } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const stats = [
  { label: "Kelas Aktif", value: "0", icon: Users, color: "text-blue-600 bg-blue-100" },
  { label: "Materi Tersedia", value: "0", icon: BookOpen, color: "text-green-600 bg-green-100" },
  { label: "Kuis Aktif", value: "0", icon: ClipboardCheck, color: "text-orange-600 bg-orange-100" },
  { label: "Notifikasi", value: "0", icon: Bell, color: "text-purple-600 bg-purple-100" },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Selamat Datang 👋</h1>
        <p className="text-muted-foreground">Eco Pancasila — MGMP PPKn Kabupaten Sukabumi</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <div className={`rounded-lg p-2 ${stat.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-full lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Aktivitas Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
              Belum ada aktivitas terbaru
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Proyek Hijau</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
              Belum ada proyek
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
