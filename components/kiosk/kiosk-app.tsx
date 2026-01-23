"use client"

import dynamic from "next/dynamic" // 1. Import dynamic
import { KioskProvider, useKiosk } from "./kiosk-provider"
import { HomeScreen } from "./home-screen"
import { SubmenuScreen } from "./submenu-screen"
import { ContentScreen } from "./content-screen"
import { DocumentsScreen } from "./documents-screen"
import { SectorsScreen } from "./sectors-screen"
import { SectorDetailScreen } from "./sector-detail-screen"
// import { PDFViewerScreen } from "./pdf-viewer-screen"  <-- 2. HAPUS IMPORT INI
import { VideoPlayerScreen } from "./video-player-screen"
import { QrPageScreen } from "./qr-page-screen"
import { AdminScreen } from "./admin-screen"
import { Loader2 } from "lucide-react"

// 3. GANTI DENGAN DYNAMIC IMPORT (SSR: FALSE)
const PDFViewerScreen = dynamic(
  () => import("./pdf-viewer-screen").then((mod) => mod.PDFViewerScreen),
  { 
    ssr: false,
    loading: () => (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
         <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-10 w-10 animate-spin text-[#0F4C81]" />
            <p className="text-slate-500 font-medium">Memuat Dokumen...</p>
         </div>
      </div>
    )
  }
)

function KioskScreens() {
  const { currentScreen } = useKiosk()

  switch (currentScreen.type) {
    case "home":
      return <HomeScreen />
    case "submenu":
      return (
        <SubmenuScreen
          menuId={currentScreen.menuId}
          menuTitle={currentScreen.menuTitle}
        />
      )
    case "content":
      return (
        <ContentScreen
          menuId={currentScreen.menuId}
          submenuId={currentScreen.submenuId}
          title={currentScreen.title}
        />
      )
    case "documents":
      return (
        <DocumentsScreen
          categoryId={currentScreen.categoryId}
          categoryTitle={currentScreen.categoryTitle}
        />
      )
    case "sectors":
      return (
        <SectorsScreen
          menuId={currentScreen.menuId}
          menuTitle={currentScreen.menuTitle}
        />
      )
    case "sector-detail":
      return (
        <SectorDetailScreen
          sectorId={currentScreen.sectorId}
          sectorTitle={currentScreen.sectorTitle}
        />
      )
    case "pdf-viewer":
      return <PDFViewerScreen document={currentScreen.document} />
    case "video-player":
      return (
        <VideoPlayerScreen
          title={currentScreen.title}
          videoUrl={currentScreen.videoUrl}
        />
      )
    case "qr-page":
      return (
        <QrPageScreen
          title={currentScreen.title}
          url={currentScreen.url}
          description={currentScreen.description}
        />
      )
    case "admin":
      return <AdminScreen />
    default:
      return <HomeScreen />
  }
}

export function KioskApp() {
  return (
    <KioskProvider>
      <div className="h-screen w-screen overflow-hidden bg-slate-50">
        <KioskScreens />
      </div>
    </KioskProvider>
  )
}