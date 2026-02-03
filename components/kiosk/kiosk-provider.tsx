"use client"

import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from "react"
import { trackMenuClick, trackDocumentView } from "@/lib/analytics-store"
import { cacheDataForOffline } from "@/lib/offline-store"

// =========================================
// 1. UPDATE DEFINISI VIEW / SCREEN
// =========================================
export type Screen = 
  | { type: "home" }
  | { type: "submenu"; menuId: string; menuTitle: string }
  | { type: "content"; menuId: string; submenuId: string; title: string }
  | { 
      type: "documents"; 
      categoryTitle: string; 
      // Update: categoryId jadi optional, tambah categorySlug
      categoryId?: string; 
      categorySlug?: string; 
      sectorId?: string 
    }
  | { type: "sectors"; menuId: string; menuTitle: string }
  | { type: "sector-detail"; sectorId: string; sectorTitle: string }
  | { type: "pdf-viewer"; document: DocumentItem }
  | { type: "video-player"; title: string; videoUrl: string }
  | { type: "qr-page"; title: string; url: string; description: string }
  | { type: "admin" }

// =========================================
// 2. UPDATE DEFINISI ITEM MENU
// =========================================

export interface MenuItem {
  id: string
  title: string
  description: string
  icon: any // Ubah ke any agar bisa terima Component atau String nama icon
  submenu?: SubMenuItem[]
  isQrCode?: boolean
  qrUrl?: string
  qrDescription?: string
}

export interface SubMenuItem {
  id: string
  title: string
  description: string
  icon: any // Ubah ke any agar bisa terima Component atau String nama icon
  hasDocuments?: boolean
  // Update: Tambahkan ini agar connect ke DB
  categorySlug?: string 
  hasContent?: boolean
  hasSectors?: boolean
  hasVideo?: boolean
  videoUrl?: string
  content?: ContentData
}

// =========================================
// 3. UPDATE DEFINISI KONTEN & DOKUMEN
// =========================================

export interface ContentData {
  type: "text" | "points" | "profile" | "officials" | "image"
  title?: string
  text?: string
  points?: string[]
  officials?: OfficialData[]
  contactInfo?: ContactInfo
  imageUrl?: string
  alt?: string
}

export interface OfficialData {
  name: string
  position: string
  photo?: string
}

export interface ContactInfo {
  address: string
  phone: string
  email: string
  hours: string
  website?: string
}

export interface DocumentItem {
  id: string
  title: string
  description?: string
  // Update: Tambahkan url untuk kompatibilitas DB
  url?: string 
  pdfUrl?: string // Legacy support
  driveUrl?: string
  thumbnail?: string
  category?: string
  type?: "pdf" | "link"
}

export interface SectorItem {
  id: string
  title: string
  description: string
  icon: any
}

// =========================================
// 4. LOGIC PROVIDER (TIDAK BERUBAH BANYAK)
// =========================================

const IDLE_TIMEOUT_MENU = 90 * 1000 // 90 seconds
const IDLE_TIMEOUT_DOCUMENT = 180 * 1000 // 180 seconds

interface KioskContextType {
  currentScreen: Screen
  navigateTo: (screen: Screen) => void
  goHome: () => void
  goBack: () => void
  history: Screen[]
  isOnline: boolean
  resetActivity: () => void
  trackMenu: (menuId: string, menuTitle: string) => void
  trackDocument: (docId: string, docTitle: string) => void
}

const KioskContext = createContext<KioskContextType | null>(null)

export function useKiosk() {
  const context = useContext(KioskContext)
  if (!context) {
    throw new Error("useKiosk must be used within KioskProvider")
  }
  return context
}

export function KioskProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<Screen[]>([{ type: "home" }])
  const [isOnline, setIsOnline] = useState(true)
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null)
  const lastActivityRef = useRef<number>(Date.now())

  const currentScreen = history[history.length - 1]

  // Online/Offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    setIsOnline(navigator.onLine)
    
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)
    
    // Cache data when online
    if (navigator.onLine) {
      cacheDataForOffline()
    }
    
    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Reset activity timer
  const resetActivity = useCallback(() => {
    lastActivityRef.current = Date.now()
  }, [])

  // Idle timeout handler
  useEffect(() => {
    const checkIdle = () => {
      const now = Date.now()
      const elapsed = now - lastActivityRef.current
      const isInDocumentView = currentScreen.type === "pdf-viewer"
      const timeout = isInDocumentView ? IDLE_TIMEOUT_DOCUMENT : IDLE_TIMEOUT_MENU

      if (elapsed >= timeout && currentScreen.type !== "home" && currentScreen.type !== "admin") {
        setHistory([{ type: "home" }])
        lastActivityRef.current = now
      }
    }

    idleTimerRef.current = setInterval(checkIdle, 1000)

    return () => {
      if (idleTimerRef.current) {
        clearInterval(idleTimerRef.current)
      }
    }
  }, [currentScreen.type])

  // Activity listeners
  useEffect(() => {
    const handleActivity = () => {
      lastActivityRef.current = Date.now()
    }

    window.addEventListener("touchstart", handleActivity)
    window.addEventListener("click", handleActivity)
    window.addEventListener("mousemove", handleActivity)

    return () => {
      window.removeEventListener("touchstart", handleActivity)
      window.removeEventListener("click", handleActivity)
      window.removeEventListener("mousemove", handleActivity)
    }
  }, [])

  const trackMenu = useCallback((menuId: string, menuTitle: string) => {
    trackMenuClick(menuId, menuTitle)
  }, [])

  const trackDocument = useCallback((docId: string, docTitle: string) => {
    trackDocumentView(docId, docTitle)
  }, [])

  const navigateTo = useCallback((screen: Screen) => {
    setHistory(prev => [...prev, screen])
    resetActivity()
  }, [resetActivity])

  const goHome = useCallback(() => {
    setHistory([{ type: "home" }])
    resetActivity()
  }, [resetActivity])

  const goBack = useCallback(() => {
    setHistory(prev => (prev.length > 1 ? prev.slice(0, -1) : prev))
    resetActivity()
  }, [resetActivity])

  return (
    <KioskContext.Provider value={{ 
      currentScreen, 
      navigateTo, 
      goHome, 
      goBack, 
      history, 
      isOnline,
      resetActivity,
      trackMenu,
      trackDocument
    }}>
      {children}
    </KioskContext.Provider>
  )
}