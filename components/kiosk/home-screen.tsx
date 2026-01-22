"use client"

import { useKiosk } from "./kiosk-provider"
import { menuItems } from "@/lib/kiosk-data"
import { Card } from "@/components/ui/card"
import { StatusIndicator } from "./status-indicator"
import { Settings } from "lucide-react"

export function HomeScreen() {
  const { navigateTo, trackMenu } = useKiosk()

  const handleMenuClick = (item: (typeof menuItems)[0]) => {
    trackMenu(item.id, item.title)
    
    if (item.isQrCode && item.qrUrl) {
      navigateTo({ 
        type: "qr-page", 
        title: item.title, 
        url: item.qrUrl, 
        description: item.qrDescription || "" 
      })
    } else if (item.submenu) {
      navigateTo({ type: "submenu", menuId: item.id, menuTitle: item.title })
    }
  }

  const handleAdminClick = () => {
    navigateTo({ type: "admin" })
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header with Logo */}
      <header className="bg-primary px-4 py-4 text-primary-foreground lg:px-10 lg:py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 lg:gap-6">
            {/* Logo Placeholder - Replace with actual logo */}
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-card/20 backdrop-blur-sm lg:h-20 lg:w-20">
              <svg
                viewBox="0 0 100 100"
                className="h-10 w-10 lg:h-14 lg:w-14"
                fill="currentColor"
              >
                <path d="M50 10 L90 30 L90 70 L50 90 L10 70 L10 30 Z" fill="none" stroke="currentColor" strokeWidth="4"/>
                <text x="50" y="58" textAnchor="middle" fontSize="24" fontWeight="bold">PM</text>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight lg:text-4xl">
                LIVING Mandiri
              </h1>
              <p className="text-xs font-medium opacity-90 lg:mt-1 lg:text-lg">
                Informasi Layanan Investasi & Perizinan
              </p>
              <p className="text-xs opacity-75 lg:text-base">
                DPMPTSP Kabupaten Lombok Barat
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 lg:gap-4">
            <StatusIndicator />
            <button
              type="button"
              onClick={handleAdminClick}
              className="rounded-full bg-card/10 p-2 backdrop-blur-sm transition-colors hover:bg-card/20 lg:p-3"
              title="Admin Panel"
            >
              <Settings className="h-4 w-4 lg:h-5 lg:w-5" />
            </button>
            <div className="hidden rounded-2xl bg-card/10 px-4 py-3 text-center backdrop-blur-sm lg:block lg:px-6 lg:py-4">
              <p className="text-xs font-medium opacity-80 lg:text-sm">Sentuh menu untuk memulai</p>
              <p className="text-lg font-bold lg:text-2xl">Selamat Datang</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Menu Grid 2x3 */}
      <main className="flex-1 bg-background p-3 lg:p-6">
        <div className="grid h-full grid-cols-3 grid-rows-2 gap-3 lg:gap-5">
          {menuItems.map((item) => (
            <Card
              key={item.id}
              onClick={() => handleMenuClick(item)}
              className={`group flex cursor-pointer flex-col items-center justify-center gap-2 p-3 shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] lg:gap-4 lg:p-6 ${
                item.isQrCode
                  ? "bg-accent text-accent-foreground"
                  : "bg-card text-card-foreground hover:bg-primary hover:text-primary-foreground"
              }`}
            >
              <div
                className={`rounded-xl p-3 transition-colors lg:rounded-2xl lg:p-5 ${
                  item.isQrCode
                    ? "bg-card/20"
                    : "bg-primary/10 group-hover:bg-card/20"
                }`}
              >
                <div className="[&>svg]:h-8 [&>svg]:w-8 lg:[&>svg]:h-12 lg:[&>svg]:w-12">
                  {item.icon}
                </div>
              </div>
              <div className="text-center">
                <h2 className="text-base font-bold lg:text-2xl">{item.title}</h2>
                <p
                  className={`mt-0.5 text-xs lg:mt-1 lg:text-base ${
                    item.isQrCode
                      ? "opacity-80"
                      : "text-muted-foreground group-hover:text-primary-foreground/80"
                  }`}
                >
                  {item.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card px-4 py-2 lg:px-10 lg:py-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground lg:text-sm">
          <p>DPMPTSP Kabupaten Lombok Barat - Melayani dengan Sepenuh Hati</p>
          <p className="hidden sm:block">Sentuh layar untuk berinteraksi</p>
        </div>
      </footer>
    </div>
  )
}
