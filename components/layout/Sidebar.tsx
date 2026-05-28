"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  ClipboardList,
  Activity,
  Leaf,
  Users,
  FileText,
  BarChart3,
  MessageSquare,
  Settings,
  X,
} from "lucide-react"

const guruMenu = [
  { label: "Beranda", href: "/dashboard", icon: LayoutDashboard },
  { label: "Kelas Saya", href: "/kelas", icon: GraduationCap },
  { label: "Materi Digital", href: "/materi", icon: BookOpen },
  { label: "E-LKPD & Kuis", href: "/kuis", icon: ClipboardList },
  { label: "Aktivitas", href: "/aktivitas", icon: Activity },
  { label: "Proyek Hijau", href: "/proyek-hijau", icon: Leaf },
  { label: "Komunitas MGMP", href: "/komunitas", icon: Users },
  { label: "Refleksi Guru", href: "/refleksi", icon: FileText },
  { label: "Analitik", href: "/analitik", icon: BarChart3 },
]

const siswaMenu = [
  { label: "Beranda", href: "/dashboard", icon: LayoutDashboard },
  { label: "Kelas Saya", href: "/kelas", icon: GraduationCap },
  { label: "Materi", href: "/materi", icon: BookOpen },
  { label: "Kuis", href: "/kuis", icon: ClipboardList },
  { label: "Aktivitas", href: "/aktivitas", icon: Activity },
  { label: "Proyek Hijau", href: "/proyek-hijau", icon: Leaf },
  { label: "Nilai & Progress", href: "/analitik", icon: BarChart3 },
]

const adminMenu = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Kelola User", href: "/admin/users", icon: Users },
  { label: "Moderasi Konten", href: "/admin/konten", icon: MessageSquare },
  { label: "Analitik Platform", href: "/admin/analitik", icon: BarChart3 },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname()
  const role = "GURU" as "ADMIN" | "GURU" | "SISWA"

  const menuItems = role === "ADMIN" ? adminMenu : role === "GURU" ? guruMenu : siswaMenu

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-green-600" />
          <span className="font-bold text-sidebar-foreground">Eco Pancasila</span>
        </Link>
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-green-100 text-green-800"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>
      <div className="border-t border-sidebar-border p-4">
        <Link
          href="/profil"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            pathname === "/profil"
              ? "bg-green-100 text-green-800"
              : "text-sidebar-foreground hover:bg-sidebar-accent"
          )}
        >
          <Settings className="h-4 w-4" />
          Pengaturan
        </Link>
      </div>
    </div>
  )

  return (
    <>
      <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-60 md:flex-col">
        <div className="flex flex-col border-r border-sidebar-border bg-sidebar">
          {sidebarContent}
        </div>
      </aside>
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent side="left" className="w-60 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Menu Navigasi</SheetTitle>
          </SheetHeader>
          {sidebarContent}
        </SheetContent>
      </Sheet>
    </>
  )
}
