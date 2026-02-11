"use client"

import { useState } from "react"
import { useKiosk } from "./kiosk-provider"
import { NavigationBar } from "./navigation-bar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { menuItems } from "@/lib/kiosk-data"
import * as LucideIcons from "lucide-react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const DynamicIcon = ({ name, className }: { name: string | any; className?: string }) => {
  if (!name) return <LucideIcons.HelpCircle className={className} />
  if (typeof name === 'string') {
     const IconComponent = (LucideIcons as any)[name]
     return IconComponent ? <IconComponent className={className} /> : <LucideIcons.HelpCircle className={className} />
  }
  return name
}

interface SubmenuScreenProps {
  menuId: string
  menuTitle: string
}

export function SubmenuScreen({ menuId, menuTitle }: SubmenuScreenProps) {
  const { navigateTo } = useKiosk()

  // 1. Ambil Data
  const parentMenu = menuItems.find((item) => item.id === menuId)
  if (!parentMenu || !parentMenu.submenu) return null
  
  const allItems = parentMenu.submenu
  
  // 2. State Pagination
  const ITEMS_PER_PAGE = 8
  const [currentPage, setCurrentPage] = useState(1)
  
  const totalPages = Math.ceil(allItems.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const currentItems = allItems.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  // 3. Logika Grid Responsive
  const getResponsiveGridClass = (count: number) => {
    // ✅ MODIFIKASI DISINI: Menangani kondisi spesifik jumlah item
    
    // Jika cuma 1 item, penuhi layar (1 kolom)
    if (count === 1) return "grid-cols-1 grid-rows-1"
    
    // Jika 2 item, bagi 2 rata (2 kolom x 1 baris) -> MEMENUHI LAYAR
    if (count === 2) return "grid-cols-2 grid-rows-1"
    
    // Jika 3 item, bagi 3 rata
    if (count === 3) return "grid-cols-3 grid-rows-1"

    // Layout Grid Standar
    if (count === 4) return "grid-cols-2 grid-rows-2"
    if (count <= 6) return "grid-cols-3 grid-rows-2"
    return "grid-cols-4 grid-rows-2"
  }

  // Cek apakah pakai pagination atau tidak
  const isPaginated = totalPages > 1
  
  // Gunakan logika grid di atas hanya jika TIDAK ada pagination
  // Jika pagination aktif, kita paksa layout standar (4x2)
  const gridClass = isPaginated ? "grid-cols-4 grid-rows-2" : getResponsiveGridClass(allItems.length)
  
  // Logic Giant Card:
  // Kita anggap "Giant" jika itemnya sedikit (<= 3) dan tidak dipaginasi.
  // Ini akan memperbesar Icon dan Teks secara otomatis.
  const isGiantCard = !isPaginated && allItems.length <= 3

  // Handlers
  const handleNext = () => { if (currentPage < totalPages) setCurrentPage(p => p + 1) }
  const handlePrev = () => { if (currentPage > 1) setCurrentPage(p => p - 1) }

  return (
    <div className="flex h-screen w-full flex-col bg-slate-50">
      
      {/* Container Utama */}
      <div className="flex-1 overflow-hidden p-8 pb-24 lg:pb-32 flex flex-col">
        
        {/* AREA GRID */}
        <div className="flex-1">
             <div className={cn("grid h-full w-full gap-6 lg:gap-8", gridClass)}>
              {currentItems.map((item) => (
                <Card
                  key={item.id}
                  onClick={() => {
                    // --- LOGIKA NAVIGASI ---
                    if (item.hasDocuments) {
                      navigateTo({ 
                        type: "documents", 
                        categoryId: item.categorySlug || item.id, 
                        categoryTitle: item.title 
                      })
                    } else if (item.hasContent) {
                      navigateTo({ type: "content", menuId: menuId, submenuId: item.id, title: item.title })
                    } else if (item.hasSectors) {
                      navigateTo({ type: "sectors", menuId: item.id, menuTitle: item.title })
                    } else if (item.hasVideo) {
                      navigateTo({ type: "video-player", title: item.title, videoUrl: item.videoUrl || "" })
                    }
                  }}
                  className={cn(
                    "group relative flex cursor-pointer flex-col items-center justify-center p-6 text-center",
                    "bg-white shadow-sm border border-slate-200 hover:border-[#0F4C81]",
                    "rounded-2xl h-full w-full transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
                  )}
                >
                  <div className={cn(
                    "flex items-center justify-center rounded-xl transition-colors duration-300",
                    "bg-slate-100 text-slate-700 group-hover:bg-[#0F4C81] group-hover:text-white",
                    // Jika Giant Card (<= 3 item), icon jadi sangat besar
                    isGiantCard ? "mb-6 h-36 w-36" : "mb-4 h-20 w-20 lg:h-24 lg:w-24"
                  )}>
                    <DynamicIcon name={item.icon} className={isGiantCard ? "h-16 w-16" : "h-10 w-10"} />
                  </div>
                  <div className="w-full space-y-2 px-4">
                    <h3 className={cn("font-bold leading-tight text-slate-800", isGiantCard ? "text-4xl" : "text-base lg:text-xl")}>
                      {item.title}
                    </h3>
                    {isGiantCard && (
                        <p className="text-slate-400 text-xl line-clamp-2">{item.description}</p>
                    )}
                    {!isGiantCard && (
                        <p className="text-slate-400 text-xs lg:text-sm line-clamp-2">{item.description}</p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
        </div>

        {/* AREA PAGINATION (Hanya muncul jika halaman > 1) */}
        {totalPages > 1 && (
            <div className="shrink-0 flex flex-col items-center justify-center gap-2 pt-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" onClick={handlePrev} disabled={currentPage === 1} className="h-12 px-6 rounded-xl border-2">
                        <ChevronLeft className="mr-2 h-5 w-5" /> Sebelumnya
                    </Button>
                    
                    <div className="flex gap-2 mx-2">
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <div key={i} className={cn("h-3 w-3 rounded-full transition-colors", currentPage === i + 1 ? "bg-[#0F4C81]" : "bg-slate-300")} />
                        ))}
                    </div>

                    <Button variant="outline" onClick={handleNext} disabled={currentPage === totalPages} className="h-12 px-6 rounded-xl border-2">
                        Selanjutnya <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                </div>
            </div>
        )}

      </div>

      <NavigationBar title={menuTitle} showBack={true} />
    </div>
  )
}