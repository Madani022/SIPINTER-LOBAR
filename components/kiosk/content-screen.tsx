"use client"

import { useKiosk } from "./kiosk-provider"
import { getSubmenuById } from "@/lib/kiosk-data"
import { Card } from "@/components/ui/card"
import { NavigationBar } from "./navigation-bar"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Mail, Clock, Globe, UserCircle, QrCode } from "lucide-react"

interface ContentScreenProps {
  menuId: string
  submenuId: string
  title: string
}

export function ContentScreen({ menuId, submenuId, title }: ContentScreenProps) {
  const { navigateTo } = useKiosk()
  const submenu = getSubmenuById(menuId, submenuId)
  const content = submenu?.content

  if (!content) {
    return (
      <div className="flex h-full flex-col">
        <NavigationBar title={title} showBack />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-lg text-muted-foreground lg:text-2xl">Konten tidak tersedia</p>
        </div>
      </div>
    )
  }

  // Handle RDTR Interaktif offline case
  if (content.type === "text" && content.text === "OFFLINE_RDTR") {
    return (
      <div className="flex h-full flex-col">
        <NavigationBar title={title} showBack />
        <main className="flex flex-1 items-center justify-center bg-background p-4 lg:p-8">
          <Card className="max-w-xl p-6 text-center shadow-xl lg:max-w-2xl lg:p-10">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 lg:mb-6 lg:h-20 lg:w-20">
              <Globe className="h-7 w-7 text-accent lg:h-10 lg:w-10" />
            </div>
            <h2 className="text-xl font-bold text-foreground lg:text-3xl">RDTR Interaktif</h2>
            <p className="mt-3 text-sm text-muted-foreground lg:mt-4 lg:text-lg">
              Fitur ini memerlukan koneksi internet untuk mengakses peta interaktif.
            </p>
            <div className="mt-6 rounded-xl bg-muted/50 p-4 lg:mt-8 lg:rounded-2xl lg:p-6">
              <p className="mb-3 text-xs font-medium text-muted-foreground lg:mb-4 lg:text-sm">
                Scan QR Code untuk membuka di smartphone Anda:
              </p>
              <div className="flex justify-center">
                <div className="rounded-lg border-4 border-primary/20 bg-card p-3 lg:rounded-xl lg:p-4">
                  <QrCodePlaceholder url="https://gistaru.atrbpn.go.id/rdtrinteraktif/" />
                </div>
              </div>
              <p className="mt-3 font-mono text-xs text-primary lg:mt-4 lg:text-sm">
                https://gistaru.atrbpn.go.id/rdtrinteraktif/
              </p>
            </div>
            <Button
              size="lg"
              className="mt-6 h-12 px-6 text-base font-semibold lg:mt-8 lg:h-14 lg:px-8 lg:text-lg"
              onClick={() => navigateTo({ 
                type: "qr-page", 
                title: "RDTR Interaktif", 
                url: "https://gistaru.atrbpn.go.id/rdtrinteraktif/",
                description: "Peta Rencana Detail Tata Ruang interaktif untuk melihat zonasi dan peruntukan lahan di Kabupaten Lombok Barat."
              })}
            >
              <QrCode className="mr-2 h-4 w-4 lg:h-5 lg:w-5" />
              Lihat QR Code Lebih Besar
            </Button>
          </Card>
        </main>
      </div>
    )
  }

  if (content.type === "text" && content.text === "QR_RTRW") {
    return (
      <div className="flex h-full flex-col">
        <NavigationBar title={title} showBack />
        <main className="flex flex-1 items-center justify-center bg-background p-4 lg:p-8">
          <Card className="max-w-xl p-6 text-center shadow-xl lg:max-w-2xl lg:p-10">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 lg:mb-6 lg:h-20 lg:w-20">
              <Globe className="h-7 w-7 text-accent lg:h-10 lg:w-10" />
            </div>
            <h2 className="text-xl font-bold text-foreground lg:text-3xl">RDTR Interaktif</h2>
            <p className="mt-3 text-sm text-muted-foreground lg:mt-4 lg:text-lg">
              Fitur ini memerlukan koneksi internet untuk mengakses peta interaktif.
            </p>
            <div className="mt-6 rounded-xl bg-muted/50 p-4 lg:mt-8 lg:rounded-2xl lg:p-6">
              <p className="mb-3 text-xs font-medium text-muted-foreground lg:mb-4 lg:text-sm">
                Scan QR Code untuk membuka di smartphone Anda:
              </p>
              <div className="flex justify-center">
                <div className="rounded-lg border-4 border-primary/20 bg-card p-3 lg:rounded-xl lg:p-4">
                  <QrCodePlaceholder url="https://gistaru.atrbpn.go.id/rtronline/" />
                </div>
              </div>
              <p className="mt-3 font-mono text-xs text-primary lg:mt-4 lg:text-sm">
                https://gistaru.atrbpn.go.id/rtronline/
              </p>
            </div>
            <Button
              size="lg"
              className="mt-6 h-12 px-6 text-base font-semibold lg:mt-8 lg:h-14 lg:px-8 lg:text-lg"
              onClick={() => navigateTo({ 
                type: "qr-page", 
                title: "RDTR Interaktif", 
                url: "https://gistaru.atrbpn.go.id/rtronline/",
                description: "Peta Rencana Detail Tata Ruang interaktif untuk melihat zonasi dan peruntukan lahan di Kabupaten Lombok Barat."
              })}
            >
              <QrCode className="mr-2 h-4 w-4 lg:h-5 lg:w-5" />
              Lihat QR Code Lebih Besar
            </Button>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <NavigationBar title={title} showBack />

      <main className="flex-1 overflow-auto bg-background p-4 lg:p-8">
        <div className="mx-auto max-w-5xl">
          {/* Text Content */}
          {content.type === "text" && (
            <Card className="p-6 shadow-lg lg:p-10">
              <h2 className="text-xl font-bold text-foreground lg:text-3xl">{content.title}</h2>
              <p className="mt-4 text-base leading-relaxed text-foreground/90 lg:mt-6 lg:text-xl">{content.text}</p>
            </Card>
          )}

          {/* Points Content */}
          {content.type === "points" && (
            <Card className="p-6 shadow-lg lg:p-10">
              <h2 className="text-xl font-bold text-foreground lg:text-3xl">{content.title}</h2>
              <ul className="mt-6 space-y-3 lg:mt-8 lg:space-y-4">
                {content.points?.map((point, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 rounded-lg bg-muted/50 p-3 text-sm lg:gap-4 lg:rounded-xl lg:p-5 lg:text-lg"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground lg:h-8 lg:w-8 lg:text-sm">
                      {index + 1}
                    </span>
                    <span className="text-foreground/90">{point}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Profile/Contact Content */}
          {content.type === "profile" && content.contactInfo && (
            <Card className="p-6 shadow-lg lg:p-10">
              <h2 className="text-xl font-bold text-foreground lg:text-3xl">{content.title}</h2>
              <div className="mt-6 grid gap-4 lg:mt-8 lg:gap-6">
                <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4 lg:gap-5 lg:rounded-xl lg:p-6">
                  <MapPin className="h-6 w-6 shrink-0 text-primary lg:h-8 lg:w-8" />
                  <div>
                    <p className="text-sm font-semibold text-foreground lg:text-base">Alamat</p>
                    <p className="mt-0.5 text-sm text-foreground/80 lg:mt-1 lg:text-lg">{content.contactInfo.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4 lg:gap-5 lg:rounded-xl lg:p-6">
                  <Phone className="h-6 w-6 shrink-0 text-primary lg:h-8 lg:w-8" />
                  <div>
                    <p className="text-sm font-semibold text-foreground lg:text-base">Telepon</p>
                    <p className="mt-0.5 text-sm text-foreground/80 lg:mt-1 lg:text-lg">{content.contactInfo.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4 lg:gap-5 lg:rounded-xl lg:p-6">
                  <Mail className="h-6 w-6 shrink-0 text-primary lg:h-8 lg:w-8" />
                  <div>
                    <p className="text-sm font-semibold text-foreground lg:text-base">Email</p>
                    <p className="mt-0.5 text-sm text-foreground/80 lg:mt-1 lg:text-lg">{content.contactInfo.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4 lg:gap-5 lg:rounded-xl lg:p-6">
                  <Clock className="h-6 w-6 shrink-0 text-primary lg:h-8 lg:w-8" />
                  <div>
                    <p className="text-sm font-semibold text-foreground lg:text-base">Jam Layanan</p>
                    <p className="mt-0.5 text-sm text-foreground/80 lg:mt-1 lg:text-lg">{content.contactInfo.hours}</p>
                  </div>
                </div>
                {content.contactInfo.website && (
                  <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4 lg:gap-5 lg:rounded-xl lg:p-6">
                    <Globe className="h-6 w-6 shrink-0 text-primary lg:h-8 lg:w-8" />
                    <div>
                      <p className="text-sm font-semibold text-foreground lg:text-base">Website</p>
                      <p className="mt-0.5 text-sm text-primary lg:mt-1 lg:text-lg">{content.contactInfo.website}</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Officials Content */}
          {content.type === "officials" && content.officials && (
            <div>
              <h2 className="mb-4 text-xl font-bold text-foreground lg:mb-6 lg:text-3xl">{content.title}</h2>
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-5">
                {content.officials.map((official, index) => (
                  <Card key={index} className="p-4 text-center shadow-md lg:p-6">
                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 lg:mb-4 lg:h-20 lg:w-20">
                      <UserCircle className="h-8 w-8 text-primary lg:h-12 lg:w-12" />
                    </div>
                    <h3 className="text-sm font-bold text-foreground lg:text-lg">{official.name}</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground lg:mt-1 lg:text-sm">{official.position}</p>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function QrCodePlaceholder({ url }: { url: string }) {
  return (
    <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-foreground lg:h-32 lg:w-32">
      <div className="grid grid-cols-5 gap-0.5 lg:gap-1">
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={i}
            className={`h-4 w-4 lg:h-5 lg:w-5 ${Math.random() > 0.4 ? "bg-card" : "bg-foreground"}`}
          />
        ))}
      </div>
    </div>
  )
}
