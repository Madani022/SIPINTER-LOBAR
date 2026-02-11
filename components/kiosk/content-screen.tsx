"use client"

import { useKiosk } from "./kiosk-provider"
import { getSubmenuById } from "@/lib/kiosk-data"
import { Card } from "@/components/ui/card"
import { NavigationBar } from "./navigation-bar"
import { MapPin, Phone, Mail, Clock, Globe, UserCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import QRCode from "react-qr-code" 

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
      <div className="flex h-screen flex-col bg-slate-50">
        <div className="flex flex-1 items-center justify-center">
          <p className="text-lg text-muted-foreground lg:text-2xl">Konten tidak tersedia</p>
        </div>
        <NavigationBar title={title} showBack />
      </div>
    )
  }

  // === TAMPILAN 1: QR CODE (RDTR & RTRW) ===
  if (content.type === "text" && (content.text === "OFFLINE_RDTR" || content.text === "QR_RTRW")) {
    const isRDTR = content.text === "OFFLINE_RDTR"
    const targetUrl = isRDTR 
      ? "https://gistaru.atrbpn.go.id/rdtrinteraktif/" 
      : "https://gistaru.atrbpn.go.id/rtronline/"
    const pageTitle = isRDTR ? "RDTR Interaktif" : "Peta RTRW"
    const description = isRDTR 
       ? "Scan QR Code ini untuk membuka peta RDTR Interaktif di HP Anda."
       : "Scan QR Code ini untuk membuka Peta RTRW di HP Anda."

    return (
      <div className="flex h-screen w-full flex-col bg-slate-50">
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-slate-800">{pageTitle}</h1>
                <p className="text-slate-500 text-lg max-w-md mx-auto">{description}</p>
            </div>
            <Card className="p-8 bg-white border-4 border-[#0F4C81] rounded-3xl shadow-xl">
                <div className="bg-white p-2">
                    <QRCode value={targetUrl} size={256} fgColor="#000000" bgColor="#ffffff" />
                </div>
            </Card>
            <div className="max-w-lg w-full bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-400 font-bold uppercase mb-1">Link Tujuan:</p>
                <p className="text-sm font-mono text-blue-600 break-all line-clamp-2">{targetUrl}</p>
            </div>
        </div>
        <NavigationBar title={title} showBack />
      </div>
    )
  }

  // === TAMPILAN 2: KONTEN STANDARD ===
  return (
    <div className="flex h-screen w-full flex-col bg-slate-50">
      
      {/* Container Utama */}
      <main className="flex-1 w-full overflow-hidden relative">
        <div className="flex h-full flex-col items-center justify-center p-4 lg:p-8 pb-32 lg:pb-40">
          <div className="w-full max-w-6xl">
            
            {/* TIPE: TEXT */}
            {content.type === "text" && (
              // ✅ HAPUS 'max-h-[70vh] overflow-y-auto' AGAR TIDAK SCROLL
              <Card className="p-6 lg:p-8 shadow-md rounded-3xl border border-slate-100">
                {(content as any).logoUrl && (
                  <div className="mb-4 flex justify-center">
                    <div className="flex items-center justify-center rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
                      <img src={(content as any).logoUrl} alt="Logo" className="h-20 w-auto object-contain" />
                    </div>
                  </div>
                )}
                
                <h2 className={cn("text-xl font-bold text-foreground lg:text-2xl mb-4", (content as any).logoUrl ? "text-center" : "")}>
                  {content.title}
                </h2>
                <p className="text-base lg:text-lg leading-relaxed text-foreground/80 whitespace-pre-line text-justify">
                  {content.text}
                </p>
              </Card>
            )}

            {/* TIPE: IMAGE */}
            {content.type === "image" && (content as any).imageUrl && (
              <div className="flex h-full w-full flex-col items-center justify-center">
                <Card className="flex h-fit w-fit max-w-full flex-col items-center p-6 lg:p-8 shadow-md rounded-3xl border border-slate-100 bg-white mx-auto">
                  <h2 className="text-2xl font-bold text-foreground lg:text-3xl mb-6 text-center whitespace-nowrap">
                    {content.title}
                  </h2>
                  {/* Gambar dibatasi tinggi agar tetap proporsional tapi tidak scroll */}
                  <img src={(content as any).imageUrl} alt="Gambar" className="max-h-[65vh] w-auto object-contain rounded-[1.5rem] border border-slate-200 shadow-sm bg-white" />
                </Card>
              </div>
            )}

            {/* TIPE: POINTS */}
            {content.type === "points" && (
              <Card className="p-6 lg:p-8 shadow-md rounded-3xl border border-slate-100">
                <h2 className="text-2xl font-bold text-foreground lg:text-3xl mb-6 text-center">{content.title}</h2>
                <ul className={cn("grid gap-4", (content.points?.length || 0) > 6 ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:gap-5" : "grid-cols-1 lg:gap-6")}>
                  {content.points?.map((point, index) => (
                    <li key={index} className={cn("flex items-center gap-3 rounded-2xl bg-slate-50 border border-slate-100/50 hover:bg-blue-50 transition-colors", (content.points?.length || 0) > 6 ? "p-3 lg:p-3" : "p-4 lg:p-6")}>
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0F4C81] text-xs font-bold text-white">{index + 1}</span>
                      <span className={cn("font-medium leading-tight text-slate-700", (content.points?.length || 0) > 6 ? "text-sm lg:text-base" : "text-base lg:text-xl")}>{point}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* TIPE: PROFILE (Tentang DPMPTSP & Kontak) */}
            {content.type === "profile" && (
              // ✅ HAPUS 'max-h-[70vh] overflow-y-auto' DISINI JUGA
              <Card className="p-6 lg:p-10 shadow-md rounded-3xl border border-slate-100">
                
                {/* 1. LOGO */}
                {((content as any).logoUrl || (content as any).imageUrl) && (
                  <div className="mb-6 flex justify-center">
                    <div className="flex items-center justify-center rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                      <img 
                        src={(content as any).logoUrl || (content as any).imageUrl} 
                        alt="Logo Instansi" 
                        className="h-24 w-auto object-contain" 
                      />
                    </div>
                  </div>
                )}

                {/* 2. JUDUL */}
                <h2 className="text-2xl font-bold text-foreground lg:text-3xl mb-6 text-center">{content.title}</h2>

                {/* 3. TEKS */}
                {content.text && (
                   <p className="text-base lg:text-lg leading-relaxed text-foreground/80 whitespace-pre-line text-justify mb-8">
                     {content.text}
                   </p>
                )}

                {/* 4. KONTAK */}
                {content.contactInfo && (
                  <div className="grid gap-4 lg:gap-6 mt-4 pt-4 border-t border-slate-100">
                    {content.contactInfo.address && <ContactItem icon={MapPin} label="Alamat" value={content.contactInfo.address} />}
                    {content.contactInfo.phone && <ContactItem icon={Phone} label="Telepon" value={content.contactInfo.phone} />}
                    {content.contactInfo.email && <ContactItem icon={Mail} label="Email" value={content.contactInfo.email} />}
                    {content.contactInfo.hours && <ContactItem icon={Clock} label="Jam Layanan" value={content.contactInfo.hours} />}
                    {content.contactInfo.website && <ContactItem icon={Globe} label="Website" value={content.contactInfo.website} />}
                  </div>
                )}
              </Card>
            )}

            {/* TIPE: OFFICIALS */}
            {content.type === "officials" && content.officials && (
              <div className="w-full">
                <h2 className="mb-6 text-2xl font-bold text-foreground lg:text-3xl text-center">{content.title}</h2>
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
                  {content.officials.map((official, index) => (
                    <Card key={index} className="flex flex-col items-center p-5 text-center shadow-sm border border-slate-200 rounded-3xl hover:shadow-lg transition-all bg-white">
                      <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-[#0F4C81]"><UserCircle className="h-8 w-8" /></div>
                      <h3 className="text-base font-bold text-slate-800 lg:text-lg leading-tight">{official.name}</h3>
                      <p className="mt-1 text-xs font-medium text-[#0F4C81] lg:text-sm">{official.position}</p>
                    </Card>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
      <NavigationBar title={title} showBack />
    </div>
  )
}

function ContactItem({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-start gap-4 rounded-2xl bg-slate-50 p-4 lg:p-5 border border-slate-100">
      <div className="p-2 bg-white rounded-xl shadow-sm text-[#0F4C81]"><Icon className="h-5 w-5 lg:h-6 lg:w-6" /></div>
      <div>
        <p className="text-[10px] lg:text-xs font-bold uppercase tracking-wider text-slate-400 mb-0.5">{label}</p>
        <p className="text-base lg:text-lg font-semibold text-slate-800 leading-tight">{value}</p>
      </div>
    </div>
  )
}