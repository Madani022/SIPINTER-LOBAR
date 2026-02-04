"use client"

import { useKiosk } from "./kiosk-provider"
import { NavigationBar } from "./navigation-bar"
import { Card } from "@/components/ui/card"
import { AlertCircle } from "lucide-react" // Hapus import 'Youtube' karena ikonnya dibuang

interface VideoPlayerScreenProps {
  url?: string
  videoUrl?: string
  title: string
}

export function VideoPlayerScreen({ url, videoUrl, title }: VideoPlayerScreenProps) {
  
  const finalUrl = url || videoUrl;

  if (!finalUrl) {
    return (
      <div className="flex h-screen w-full flex-col bg-slate-50">
        <main className="flex-1 w-full flex flex-col items-center justify-center p-4">
          <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
          <h3 className="text-xl font-bold text-slate-700">Video Tidak Ditemukan</h3>
          <p className="text-slate-500">Data URL video kosong atau tidak terbaca.</p>
        </main>
        <NavigationBar title={title} showBack />
      </div>
    )
  }

  return (
    <div className="flex h-screen w-full flex-col bg-slate-50">
      
      {/* MAIN CONTAINER:
         - flex-1: Ambil semua sisa ruang.
         - flex flex-col items-center justify-center: KUNCI POSISI TENGAH (Vertikal & Horizontal).
         - pb-32: Padding bawah agar "titik tengah" visualnya naik sedikit, 
           sehingga video tidak ketimpa Navbar di bawah.
      */}
      <main className="flex-1 w-full flex flex-col items-center justify-center p-4 lg:p-8 pb-32 lg:pb-40">
        
        {/* CARD VIDEO:
           - Hanya membungkus iframe.
           - Tanpa teks apapun di bawahnya.
        */}
        <Card className="w-full max-w-5xl overflow-hidden rounded-xl border border-slate-200 shadow-md bg-black">
          <div className="relative aspect-video w-full">
            <iframe
              src={`${finalUrl}${finalUrl.includes("?") ? "&" : "?"}autoplay=0&rel=0&modestbranding=1`}
              title={title}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </Card>

      </main>

      {/* NAVBAR */}
      <NavigationBar title={title} showBack />
    </div>
  )
}