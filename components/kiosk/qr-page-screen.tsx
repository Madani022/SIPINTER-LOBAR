"use client"

import { useEffect, useRef } from "react"
import { NavigationBar } from "./navigation-bar"
import { Card } from "@/components/ui/card"
import { Smartphone } from "lucide-react"

interface QrPageScreenProps {
  title: string
  url: string
  description: string
}

export function QrPageScreen({ title, url, description }: QrPageScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // --- LOGIC GENERATE QR (TIDAK BERUBAH) ---
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (ctx) {
        const size = 320
        const moduleCount = 25
        const moduleSize = size / moduleCount

        canvas.width = size
        canvas.height = size

        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, size, size)

        ctx.fillStyle = "#1e3a5f"
        
        const urlHash = url.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
        
        for (let row = 0; row < moduleCount; row++) {
          for (let col = 0; col < moduleCount; col++) {
            const isCorner =
              (row < 7 && col < 7) ||
              (row < 7 && col >= moduleCount - 7) ||
              (row >= moduleCount - 7 && col < 7)
            const isTiming = (row === 6 || col === 6) && !isCorner
            const shouldFill = isCorner
              ? row < 7 && col < 7
                ? row === 0 || row === 6 || col === 0 || col === 6 || (row >= 2 && row <= 4 && col >= 2 && col <= 4)
                : row < 7 && col >= moduleCount - 7
                  ? row === 0 || row === 6 || col === moduleCount - 1 || col === moduleCount - 7 || (row >= 2 && row <= 4 && col >= moduleCount - 5 && col <= moduleCount - 3)
                  : row === moduleCount - 1 || row === moduleCount - 7 || col === 0 || col === 6 || (row >= moduleCount - 5 && row <= moduleCount - 3 && col >= 2 && col <= 4)
              : isTiming
                ? (row + col) % 2 === 0
                : ((row * col + urlHash) % 3) < 2

            if (shouldFill) {
              ctx.fillRect(col * moduleSize, row * moduleSize, moduleSize, moduleSize)
            }
          }
        }
      }
    }
  }, [url])

  return (
    // 1. CONTAINER UTAMA: h-screen & overflow-hidden (KUNCI AGAR TIDAK SCROLL)
    <div className="flex h-screen w-full flex-col bg-background overflow-hidden">
      
      {/* Navbar Statis di Atas */}
      <NavigationBar title={title} showBack />

      {/* 2. MAIN AREA: Mengisi sisa ruang */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 lg:p-6 overflow-hidden">
        
        {/* CARD: Menggunakan Flex Column & max-h-full agar tidak melebihi layar */}
        <Card className="flex flex-col w-full max-w-lg h-full max-h-full shadow-xl overflow-hidden rounded-[2rem] border-slate-200">
            
            {/* BAGIAN ATAS (HEADER): Ukuran konten menyesuaikan isi (shrink-0) */}
            <div className="shrink-0 p-6 pb-2 text-center flex flex-col items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Smartphone className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-foreground leading-tight">{title}</h2>
                    {description && (
                        <p className="mx-auto mt-1 max-w-xs text-sm text-muted-foreground line-clamp-2">
                        {description}
                        </p>
                    )}
                </div>
            </div>

            {/* BAGIAN TENGAH (QR CODE): FLEXIBLE (KUNCI RESPONSIF)
                - flex-1: Mengambil semua ruang sisa vertikal.
                - min-h-0: Membolehkan container mengecil jika layar pendek.
            */}
            <div className="flex-1 w-full min-h-0 flex items-center justify-center p-4">
                {/* Wrapper QR: 
                    - aspect-square: Menjaga tetap kotak.
                    - h-full: Mencoba mengisi tinggi container.
                    - max-h: Membatasi agar tidak terlalu raksasa di layar besar.
                */}
                <div className="relative aspect-square h-full max-h-[350px] w-auto rounded-2xl border-4 border-primary/20 bg-white p-4 shadow-inner flex items-center justify-center">
                    <canvas 
                        ref={canvasRef} 
                        className="w-full h-full object-contain" 
                    />
                </div>
            </div>

            {/* BAGIAN BAWAH (FOOTER): Ukuran konten menyesuaikan isi (shrink-0) */}
            <div className="shrink-0 p-6 pt-2 text-center">
                <p className="text-base font-medium text-muted-foreground mb-3">
                    Scan QR Code dengan kamera HP Anda
                </p>

                <div className="rounded-xl bg-slate-100 p-3 border border-slate-200">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Link Tujuan</p>
                    <p className="truncate font-mono text-sm text-primary font-semibold px-2">
                        {url}
                    </p>
                </div>
            </div>

        </Card>
      </main>
    </div>
  )
}