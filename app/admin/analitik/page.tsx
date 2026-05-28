import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminAnalitikPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analitik Platform</h1>
        <p className="text-muted-foreground">Statistik penggunaan platform</p>
      </div>
      <Card>
        <CardContent className="flex h-64 items-center justify-center text-sm text-muted-foreground">
          Data analitik akan tampil setelah ada aktivitas
        </CardContent>
      </Card>
    </div>
  )
}
