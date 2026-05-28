import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, BarChart3 } from "lucide-react"

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Admin</h1>
        <p className="text-muted-foreground">Kelola platform Eco Pancasila</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <Users className="h-4 w-4 text-green-600" />
            <CardTitle className="text-sm">Total User</CardTitle>
          </CardHeader>
          <CardContent><span className="text-2xl font-bold">0</span></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <FileText className="h-4 w-4 text-blue-600" />
            <CardTitle className="text-sm">Total Konten</CardTitle>
          </CardHeader>
          <CardContent><span className="text-2xl font-bold">0</span></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <BarChart3 className="h-4 w-4 text-orange-600" />
            <CardTitle className="text-sm">Kelas Aktif</CardTitle>
          </CardHeader>
          <CardContent><span className="text-2xl font-bold">0</span></CardContent>
        </Card>
      </div>
    </div>
  )
}
