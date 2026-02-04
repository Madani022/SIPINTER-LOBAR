"use client"

import { useKiosk } from "./kiosk-provider"
import { StatusIndicator } from "./status-indicator"
import { Button } from "@/components/ui/button"
import { Home, ChevronLeft } from "lucide-react"

interface NavigationBarProps {
  title: string
  showBack?: boolean
}

export function NavigationBar({ title, showBack = false }: NavigationBarProps) {
  const { goHome, goBack } = useKiosk()

  return (
    // PERUBAHAN POSISI: 
    // 1. fixed bottom-0: Menempel di bawah
    // 2. border-t: Garis batas pindah ke atas
    // 3. z-50: Pastikan selalu di atas konten lain
    <footer className="fixed bottom-0 left-0 z-50 w-full flex items-center justify-between border-t border-border bg-primary px-4 py-3 lg:px-8 lg:py-4">
      
      {/* BAGIAN KIRI (TIDAK BERUBAH) */}
      <div className="flex items-center gap-2 lg:gap-4">
        {showBack && (
          <Button
            size="lg"
            variant="secondary"
            onClick={goBack}
            className="h-10 gap-1 px-3 text-sm font-semibold lg:h-14 lg:gap-2 lg:px-6 lg:text-lg"
          >
            <ChevronLeft className="h-4 w-4 lg:h-6 lg:w-6" />
            <span className="hidden sm:inline">Kembali</span>
          </Button>
        )}
        <h1 className="line-clamp-1 text-base font-bold text-primary-foreground lg:text-2xl">{title}</h1>
      </div>

      {/* BAGIAN KANAN (TIDAK BERUBAH) */}
      <div className="flex items-center gap-2 lg:gap-4">
        <StatusIndicator />
        <Button
          size="lg"
          variant="secondary"
          onClick={goHome}
          className="h-10 gap-1 px-4 text-sm font-semibold lg:h-14 lg:gap-2 lg:px-8 lg:text-lg"
        >
          <Home className="h-4 w-4 lg:h-6 lg:w-6" />
          <span className="hidden sm:inline">Beranda</span>
        </Button>
      </div>
    </footer>
  )
}