"use client"

import { NavigationBar } from "./navigation-bar"
import QRCode from "react-qr-code" // ✅ GENERATOR DISINI
import { Card } from "@/components/ui/card"

interface QrPageScreenProps {
  title: string
  description?: string
  url: string // Ini link yang diterima dari PDF Viewer tadi
}

export function QrPageScreen({ title, description, url }: QrPageScreenProps) {
  return (
    <div className="flex h-screen w-full flex-col bg-slate-50">
      
      {/* Konten Tengah */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8">
        
        <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-800">{title}</h1>
            <p className="text-slate-500 text-lg max-w-md mx-auto">{description}</p>
        </div>

        {/* Kotak QR Code */}
        <Card className="p-8 bg-white border-4 border-[#0F4C81] rounded-3xl shadow-xl">
            <div className="bg-white p-2">
                {/* Komponen Generator QR */}
                <QRCode 
                    value={url} 
                    size={256} // Ukuran Besar
                    fgColor="#000000"
                    bgColor="#ffffff"
                />
            </div>
        </Card>

        {/* Info Link Text */}
        <div className="max-w-lg w-full bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-400 font-bold uppercase mb-1">Link Tujuan:</p>
            <p className="text-sm font-mono text-blue-600 break-all line-clamp-2">
                {url}
            </p>
        </div>

      </div>

      <NavigationBar title="Kembali ke Dokumen" showBack={true} />
    </div>
  )
}