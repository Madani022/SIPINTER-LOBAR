"use client"

import { useKiosk } from "./kiosk-provider"
import { Wifi, WifiOff } from "lucide-react"

export function StatusIndicator() {
  const { isOnline } = useKiosk()

  return (
    <div
      className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-colors lg:px-4 lg:py-2 lg:text-sm ${
        isOnline
          ? "bg-green-500/20 text-green-700"
          : "bg-amber-500/20 text-amber-700"
      }`}
    >
      {isOnline ? (
        <>
          <Wifi className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
          <span className="hidden sm:inline">Online</span>
        </>
      ) : (
        <>
          <WifiOff className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
          <span className="hidden sm:inline">Offline Mode</span>
        </>
      )}
    </div>
  )
}
