"use client"

import { useState } from "react"
import { useKiosk } from "./kiosk-provider"
import { NavigationBar } from "./navigation-bar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { sectors } from "@/lib/kiosk-data" 
import { ChevronLeft, ChevronRight } from "lucide-react"
import * as LucideIcons from "lucide-react"

const DynamicIcon = ({ name, className }: { name: string | any; className?: string }) => {
  if (!name) return <LucideIcons.HelpCircle className={className} />
  if (typeof name === 'string') {
     const IconComponent = (LucideIcons as any)[name]
     return IconComponent ? <IconComponent className={className} /> : <LucideIcons.HelpCircle className={className} />
  }
  return name
}

interface SectorsScreenProps {
  menuId: string
  menuTitle: string
}

export function SectorsScreen({ menuId, menuTitle }: SectorsScreenProps) {
  const { navigateTo } = useKiosk()
  
  const ITEMS_PER_PAGE = 8 
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(sectors.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const currentSectors = sectors.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handleNext = () => { if (currentPage < totalPages) setCurrentPage(prev => prev + 1) }
  const handlePrev = () => { if (currentPage > 1) setCurrentPage(prev => prev - 1) }

  return (
    <div className="flex h-screen w-full flex-col bg-slate-50">
      
      {/* Container Utama */}
      <div className="flex-1 overflow-hidden p-6 lg:p-8 pb-24 lg:pb-32 flex flex-col">
        
        {/* GRID CARD 
           - gap-5 (dikurangi dari gap-6 agar lebih hemat tempat)
           - mb-2 (memberi sedikit jarak ke pagination)
        */}
        <div className="grid flex-1 gap-4 lg:gap-5 grid-cols-4 grid-rows-2 mb-2">
          {currentSectors.map((sector) => (
            <Card
              key={sector.id}
              onClick={() => navigateTo({ 
                type: "sector-detail", 
                sectorId: sector.id, 
                sectorTitle: sector.title,
                
                // ✅ TAMBAHKAN INI (PENTING BANGET!)
                categorySlug: sector.categorySlug 
              })}
              className={cn(
                "group relative flex cursor-pointer flex-col items-center justify-center text-center",
                "p-4 lg:p-5",
                "bg-white border border-slate-200 shadow-sm transition-all hover:translate-y-[-4px] hover:shadow-md hover:border-[#0F4C81]",
                "h-full w-full rounded-2xl"
              )}
            >
              <div className="mb-3 flex h-20 w-20 lg:h-24 lg:w-24 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition-colors group-hover:bg-[#0F4C81] group-hover:text-white">
                <DynamicIcon name={sector.icon} className="h-8 w-8 lg:h-10 lg:w-10" />
              </div>
              <div className="w-full px-1">
                <h3 className="text-base font-bold leading-tight text-slate-800 lg:text-lg line-clamp-2">{sector.title}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-slate-400 lg:text-sm">{sector.description}</p>
                
                {/* Debugging Visual: Biar yakin slug-nya kebaca (Boleh dihapus nanti) */}
                {/* <p className="text-[10px] text-red-500">{sector.categorySlug}</p> */}
              </div>
            </Card>
          ))}
        </div>

        {/* PAGINATION AREA 
           - mb-4: Memberikan jarak paksa dari Navbar bawah (LIFT UP)
           - shrink-0: Mencegah area ini gepeng
        */}
        <div className="shrink-0 flex flex-col items-center justify-center gap-2 py-2 mb-4 lg:mb-6">
           
           <div className="flex items-center gap-4">
             <Button 
                variant="outline" 
                onClick={handlePrev} 
                disabled={currentPage === 1} 
                // Mengubah tinggi tombol jadi h-12 (sebelumnya h-14) agar lebih ramping
                className="h-12 px-6 gap-2 rounded-xl border-2 text-base font-bold text-slate-700 hover:text-[#0F4C81] hover:border-[#0F4C81]"
             >
               <ChevronLeft className="h-5 w-5 stroke-[3]" /> Sebelumnya
             </Button>

             <div className="flex gap-2 mx-4">
               {Array.from({ length: totalPages }).map((_, i) => (
                 <div key={i} className={cn("h-3 w-3 rounded-full transition-colors", currentPage === i + 1 ? "bg-[#0F4C81]" : "bg-slate-300")} />
               ))}
             </div>

             <Button 
                variant="outline" 
                onClick={handleNext} 
                disabled={currentPage === totalPages} 
                // Mengubah tinggi tombol jadi h-12
                className="h-12 px-6 gap-2 rounded-xl border-2 text-base font-bold text-slate-700 hover:text-[#0F4C81] hover:border-[#0F4C81]"
             >
               Selanjutnya <ChevronRight className="h-5 w-5 stroke-[3]" />
             </Button>
           </div>
           
           <div className="text-center text-slate-400 font-medium text-xs lg:text-sm">
              Halaman {currentPage} dari {totalPages}
           </div>

        </div>

      </div>

      {/* Navbar Fixed di Bawah */}
      <NavigationBar title={menuTitle} showBack={true} />
    </div>
  )
}