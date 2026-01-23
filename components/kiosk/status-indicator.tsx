"use client"

import { useEffect, useState } from "react"
import { Wifi, WifiOff } from "lucide-react"

export function StatusIndicator() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    // Set status awal
    setIsOnline(navigator.onLine)

    // Event listener untuk memantau perubahan koneksi
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  return (
    // SAYA MENGUBAH VISUAL DI SINI:
    // 1. bg-white: Memberikan latar putih solid agar kontras dengan header oranye.
    // 2. shadow-sm: Memberikan sedikit dimensi.
    // 3. text-slate-800: Teks gelap agar terbaca jelas di atas putih.
    <div className={`flex items-center gap-2 rounded-full px-3 py-1.5 shadow-sm transition-all duration-300 ${
      isOnline ? "bg-white text-emerald-700" : "bg-white text-red-600"
    }`}>
      
      {/* Indikator Dot / Icon */}
      <div className={`flex items-center justify-center rounded-full p-1 ${
        isOnline ? "bg-emerald-100" : "bg-red-100"
      }`}>
        {isOnline ? (
          <Wifi className="h-3.5 w-3.5" strokeWidth={3} />
        ) : (
          <WifiOff className="h-3.5 w-3.5" strokeWidth={3} />
        )}
      </div>

      {/* Teks Status */}
      <span className="text-xs font-bold uppercase tracking-wider">
        {isOnline ? "Online" : "Offline"}
      </span>

      {/* Pulsing Dot (Opsional - agar lebih hidup) */}
      {isOnline && (
        <span className="relative flex h-2.5 w-2.5 ml-1">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
      )}
    </div>
  )
}