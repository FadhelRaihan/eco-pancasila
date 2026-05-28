"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  ClipboardList,
  Leaf,
  Users,
} from "lucide-react"

const navItems = [
  { label: "Beranda", href: "/dashboard", icon: LayoutDashboard },
  { label: "Kelas", href: "/kelas", icon: GraduationCap },
  { label: "Materi", href: "/materi", icon: BookOpen },
  { label: "Kuis", href: "/kuis", icon: ClipboardList },
  { label: "Proyek", href: "/proyek-hijau", icon: Leaf },
  { label: "MGMP", href: "/komunitas", icon: Users },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background md:hidden">
      <div className="flex items-center justify-around px-2 py-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-md px-3 py-1.5 text-[10px] font-medium transition-colors",
                isActive
                  ? "text-green-700"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
