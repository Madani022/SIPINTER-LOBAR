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

// --- HELPER DYNAMIC ICON ---
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
  
  // Pagination Logic
  const ITEMS_PER_PAGE = 8 
  const [currentPage, setCurrentPage] = useState(1)
  
  const totalPages = Math.ceil(sectors.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const currentSectors = sectors.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1)
  }

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1)
  }

  return (
    <div className="flex h-full flex-col bg-slate-50">
      {/* Navbar */}
      <NavigationBar title={menuTitle} showBack={true} />

      {/* Content Area */}
      <div className="flex-1 overflow-hidden p-8 flex flex-col">
        
        {/* Grid Sektor */}
        <div className="grid flex-1 gap-6 grid-cols-4 grid-rows-2 mb-4">
          {currentSectors.map((sector) => (
            <Card
              key={sector.id}
              onClick={() => navigateTo({ 
                type: "sector-detail", 
                sectorId: sector.id, 
                sectorTitle: sector.title 
              })}
              className={cn(
                "group relative flex cursor-pointer flex-col items-center justify-center p-6 text-center",
                "bg-white border-none shadow-sm transition-all hover:translate-y-[-4px] hover:shadow-md",
                "h-full w-full rounded-2xl"
              )}
            >
              {/* ICON CONTAINER */}
              <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition-colors group-hover:bg-[#0F4C81] group-hover:text-white">
                <DynamicIcon 
                  name={sector.icon} 
                  className="h-10 w-10" 
                />
              </div>

              {/* TEXT CONTENT */}
              <div className="w-full px-2">
                <h3 className="text-lg font-bold leading-tight text-slate-800 lg:text-xl">
                  {sector.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-slate-400">
                  {sector.description}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Footer / Pagination Control */}
        <div className="shrink-0 flex items-center justify-center gap-4 py-2">
           <Button
             variant="outline"
             onClick={handlePrev}
             disabled={currentPage === 1}
             // PERUBAHAN DISINI: font-bold dan text-lg
             className="h-14 px-8 gap-3 rounded-xl border-2 text-lg font-bold text-slate-700 hover:text-[#0F4C81] hover:border-[#0F4C81]"
           >
             <ChevronLeft className="h-6 w-6 stroke-[3]" /> {/* Icon dipertebal */}
             Sebelumnya
           </Button>

           {/* Dots Indicator */}
           <div className="flex gap-3 mx-6">
             {Array.from({ length: totalPages }).map((_, i) => (
               <div 
                 key={i}
                 className={cn(
                   "h-4 w-4 rounded-full transition-colors",
                   currentPage === i + 1 ? "bg-[#0F4C81]" : "bg-slate-300"
                 )}
               />
             ))}
           </div>

           <Button
             variant="outline"
             onClick={handleNext}
             disabled={currentPage === totalPages}
             // PERUBAHAN DISINI: font-bold dan text-lg
             className="h-14 px-8 gap-3 rounded-xl border-2 text-lg font-bold text-slate-700 hover:text-[#0F4C81] hover:border-[#0F4C81]"
           >
             Selanjutnya
             <ChevronRight className="h-6 w-6 stroke-[3]" /> {/* Icon dipertebal */}
           </Button>
        </div>
        
        <div className="text-center mt-3 text-slate-500 font-medium text-base">
           Halaman {currentPage} dari {totalPages}
        </div>

      </div>
    </div>
  )
}