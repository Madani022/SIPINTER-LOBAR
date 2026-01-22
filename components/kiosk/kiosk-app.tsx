"use client"

import { KioskProvider, useKiosk } from "./kiosk-provider"
import { HomeScreen } from "./home-screen"
import { SubmenuScreen } from "./submenu-screen"
import { ContentScreen } from "./content-screen"
import { DocumentsScreen } from "./documents-screen"
import { SectorsScreen } from "./sectors-screen"
import { SectorDetailScreen } from "./sector-detail-screen"
import { PDFViewerScreen } from "./pdf-viewer-screen"
import { VideoPlayerScreen } from "./video-player-screen"
import { QrPageScreen } from "./qr-page-screen"
import { AdminScreen } from "./admin-screen"

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
      <div className="h-screen w-screen overflow-hidden">
        <KioskScreens />
      </div>
    </KioskProvider>
  )
}
