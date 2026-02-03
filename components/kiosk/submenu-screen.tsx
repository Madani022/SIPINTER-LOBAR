"use client"

import { useKiosk } from "./kiosk-provider"
import { NavigationBar } from "./navigation-bar"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { menuItems } from "@/lib/kiosk-data"
import * as LucideIcons from "lucide-react"

// Helper Icon
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

  const parentMenu = menuItems.find((item) => item.id === menuId)
  if (!parentMenu || !parentMenu.submenu) return null
  
  const items = parentMenu.submenu
  const count = items.length

  // === LOGIKA FILL SCREEN ===
  const getResponsiveGridClass = () => {
    if (count <= 3) return "grid-cols-3 grid-rows-1"
    if (count === 4) return "grid-cols-2 grid-rows-2"
    if (count <= 6) return "grid-cols-3 grid-rows-2"
    if (count <= 8) return "grid-cols-4 grid-rows-2"
    return "grid-cols-4 grid-rows-3"
  }

  const isGiantCard = count <= 3

  return (
    <div className="flex h-full flex-col bg-slate-50">
      {/* Navbar Konsisten */}
      <NavigationBar title={menuTitle} showBack={true} />

      {/* CONTAINER UTAMA */}
      <div className="flex-1 overflow-hidden p-8">
        
        {/* GRID CONTAINER */}
        <div className={cn(
           "grid h-full w-full gap-8", 
           getResponsiveGridClass()
        )}>
          {items.map((item) => (
            <Card
              key={item.id}
              onClick={() => {
                if (item.hasDocuments) {
                  navigateTo({ type: "documents", categoryId: item.id, categoryTitle: item.title })
                } else if (item.hasContent) {
                  navigateTo({ type: "content", menuId: menuId, submenuId: item.id, title: item.title })
                } else if (item.hasSectors) {
                  navigateTo({ type: "sectors", menuId: item.id, menuTitle: item.title })
                } else if (item.hasVideo) {
                  navigateTo({ type: "video-player", title: item.title, videoUrl: item.videoUrl || "" })
                }
              }}
              className={cn(
                // === STYLE CARD ===
                "group relative flex cursor-pointer flex-col items-center justify-center p-6 text-center",
                "bg-white shadow-sm",
                
                // === PERUBAHAN DISINI (Border Tipis) ===
                "border border-slate-200", // Border tipis 1px (Hairline)
                "hover:border-[#0F4C81]",  // Saat disentuh jadi biru
                
                // Radius (Tidak terlalu melengkung)
                "rounded-2xl", 
                
                // Full Size
                "h-full w-full",

                // Efek Animasi
                "transition-all duration-300 ease-out", 
                "hover:scale-[1.02]", 
                "hover:shadow-xl",    
                "active:scale-[0.98]" 
              )}
            >
              {/* ICON CONTAINER */}
              <div className={cn(
                "flex items-center justify-center rounded-xl transition-colors duration-300",
                "bg-slate-100 text-slate-700 group-hover:bg-[#0F4C81] group-hover:text-white",
                isGiantCard ? "mb-6 h-36 w-36" : "mb-4 h-24 w-24"
              )}>
                <DynamicIcon 
                   name={item.icon} 
                   className={isGiantCard ? "h-16 w-16" : "h-10 w-10"} 
                />
              </div>

              {/* CONTENT TEXT */}
              <div className="w-full space-y-2 px-4">
                <h3 className={cn(
                  "font-bold leading-tight text-slate-800",
                  isGiantCard ? "text-4xl" : "text-2xl"
                )}>
                  {item.title}
                </h3>

                <p className={cn(
                  "text-slate-400 line-clamp-2", 
                  isGiantCard ? "text-xl" : "text-base"
                )}>
                  {item.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}