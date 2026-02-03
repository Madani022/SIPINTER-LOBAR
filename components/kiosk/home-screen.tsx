"use client"

import { useKiosk } from "./kiosk-provider"
import { menuItems } from "@/lib/kiosk-data"
import { Card } from "@/components/ui/card"
import { StatusIndicator } from "./status-indicator"
import Image from "next/image"
// 1. IMPORT HELPER ICON (Pastikan path-nya benar, sesuaikan jika ada di folder lain)
import { renderIcon } from "../ui/icon-map" 

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

  return (
    <div className="flex h-full flex-col">
      {/* Header with Logo */}
      <header className="bg-primary px-4 py-4 text-primary-foreground lg:px-10 lg:py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 lg:gap-6">
            
            {/* Logo Image */}
            <div className="relative h-16 w-16 rounded-2xl overflow-hidden bg-white/10 p-1 backdrop-blur-sm lg:h-24 lg:w-24">
                <Image 
                    src="/logoSipinterLobar.png" 
                    alt="Logo SIPINTER" 
                    fill
                    className="object-contain"
                    priority
                />
            </div>

            <div>
              <h1 className="text-2xl font-extrabold tracking-tight lg:text-4xl">
                SIPINTER LOBAR
              </h1>
              <p className="text-xs font-medium opacity-90 lg:mt-1 lg:text-lg">
                Sistem Informasi Pelayanan Investasi & Perizinan Terpadu
              </p>
              <p className="text-xs opacity-75 lg:text-base">
                DPMPTSP Kabupaten Lombok Barat
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            <StatusIndicator />
            
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
                  {/* 2. GUNAKAN RENDER ICON DISINI */}
                  {renderIcon(item.icon)} 
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