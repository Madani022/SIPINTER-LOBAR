"use client"

import { useKiosk } from "./kiosk-provider"
import { getMenuById } from "@/lib/kiosk-data"
import { Card } from "@/components/ui/card"
import { NavigationBar } from "./navigation-bar"

interface SubmenuScreenProps {
  menuId: string
  menuTitle: string
}

export function SubmenuScreen({ menuId, menuTitle }: SubmenuScreenProps) {
  const { navigateTo, trackMenu } = useKiosk()
  const menu = getMenuById(menuId)

  if (!menu || !menu.submenu) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-lg text-muted-foreground lg:text-2xl">Menu tidak ditemukan</p>
      </div>
    )
  }

  const handleSubmenuClick = (item: (typeof menu.submenu)[0]) => {
    trackMenu(item.id, item.title)
    
    if (item.hasDocuments) {
      navigateTo({ type: "documents", categoryId: item.id, categoryTitle: item.title })
    } else if (item.hasContent) {
      navigateTo({ type: "content", menuId, submenuId: item.id, title: item.title })
    } else if (item.hasSectors) {
      navigateTo({ type: "sectors", menuId, menuTitle: item.title })
    } else if (item.hasVideo && item.videoUrl) {
      navigateTo({ type: "video-player", title: item.title, videoUrl: item.videoUrl })
    }
  }

  // Calculate grid layout based on number of items
  const getGridClass = () => {
    const count = menu.submenu?.length || 0
    if (count <= 2) return "grid-cols-2"
    if (count <= 4) return "grid-cols-2 grid-rows-2"
    if (count <= 6) return "grid-cols-3 grid-rows-2"
    return "grid-cols-4 grid-rows-2"
  }

  return (
    <div className="flex h-full flex-col">
      <NavigationBar title={menuTitle} showBack />

      {/* Content */}
      <main className="flex-1 bg-background p-3 lg:p-6">
        <div className={`grid h-full gap-3 lg:gap-5 ${getGridClass()}`}>
          {menu.submenu.map((item) => (
            <Card
              key={item.id}
              onClick={() => handleSubmenuClick(item)}
              className="group flex cursor-pointer flex-col items-center justify-center gap-2 p-3 shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] bg-card text-card-foreground hover:bg-primary hover:text-primary-foreground lg:gap-4 lg:p-6"
            >
              <div className="rounded-xl bg-primary/10 p-3 transition-colors group-hover:bg-card/20 lg:rounded-2xl lg:p-5">
                <div className="[&>svg]:h-6 [&>svg]:w-6 lg:[&>svg]:h-10 lg:[&>svg]:w-10">
                  {item.icon}
                </div>
              </div>
              <div className="text-center">
                <h2 className="text-base font-bold lg:text-xl">{item.title}</h2>
                <p className="mt-0.5 text-xs text-muted-foreground group-hover:text-primary-foreground/80 lg:mt-1 lg:text-sm">
                  {item.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
