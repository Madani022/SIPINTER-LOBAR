"use client"

import { useKiosk } from "./kiosk-provider"
import { getSubmenuById } from "@/lib/kiosk-data"
import { Card } from "@/components/ui/card"
import { NavigationBar } from "./navigation-bar"
import { MapPin, Phone, Mail, Clock, Globe, UserCircle, Smartphone } from "lucide-react"
import { cn } from "@/lib/utils"

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
        {/* CENTER WRAPPER KHUSUS QR */}
        <main className="flex-1 w-full overflow-hidden relative">
          <div className="flex h-full flex-col items-center justify-center p-4 pb-32 lg:pb-40">
            <Card className="relative w-full max-w-md flex flex-col items-center p-6 text-center shadow-xl rounded-[2rem] border-none bg-white">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#0F4C81]">
                <Smartphone className="h-7 w-7" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 lg:text-2xl">{pageTitle}</h2>
              <p className="mt-1 text-sm font-medium text-slate-500 leading-relaxed px-2">
                {description}
              </p>
              <div className="relative flex items-center justify-center h-48 w-48 lg:h-56 lg:w-56 my-4 border-[1px] border-slate-100 rounded-lg bg-white shadow-sm overflow-hidden">
                 <div className="scale-[1.8] lg:scale-[2.2] origin-center">
                   <QrCodePlaceholder url={targetUrl} />
                 </div>
              </div>
              <p className="mb-4 text-xs text-slate-400 font-medium uppercase tracking-wide">
                Arahkan kamera HP ke layar
              </p>
              <div className="w-full rounded-xl bg-slate-100/80 px-4 py-3 text-center">
                 <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                   LINK TUJUAN
                 </p>
                 <p className="truncate text-xs font-bold text-[#0F4C81]">
                   {targetUrl}
                 </p>
              </div>
            </Card>
          </div>
        </main>
        <NavigationBar title={title} showBack />
      </div>
    )
  }

  // === TAMPILAN 2: KONTEN STANDARD (DAFTAR LAYANAN, PROFIL, TEXT) ===
  return (
    <div className="flex h-screen w-full flex-col bg-slate-50">
      
      {/* 1. overflow-hidden: Mematikan scroll halaman utama.
         2. relative: Agar positioning child absolut bisa bekerja (jika ada).
      */}
      <main className="flex-1 w-full overflow-hidden relative">
        
        {/* CONTAINER CENTERING:
           1. flex h-full: Mengambil tinggi penuh area main.
           2. items-center justify-center: Memastikan konten PERSIS di tengah layar.
           3. pb-32 lg:pb-40: Padding bawah besar. Ini kuncinya!
              Karena ada padding besar di bawah, "titik tengah" konten akan sedikit naik ke atas,
              menjauhkan bagian bawah konten dari Navbar fixed.
        */}
        <div className="flex h-full flex-col items-center justify-center p-4 lg:p-8 pb-32 lg:pb-40">
          
          <div className="w-full max-w-6xl">
            
            {content.type === "text" && (
              <Card className="p-6 lg:p-8 shadow-md rounded-3xl border border-slate-100 max-h-[70vh] overflow-y-auto">
                
                {/* 1. LOGIKA GAMBAR/LOGO */}
                {(content as any).logoUrl && (
                  // UBAH DISINI: mb-4 jadi mb-1 (Supaya rapat dengan judul di bawahnya)
                  <div className="mb-1 flex justify-center">
                    <div className="flex items-center justify-center rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
                      <img 
                        src={(content as any).logoUrl} 
                        alt="Logo Instansi" 
                        className="h-20 w-auto object-contain" 
                      />
                    </div>
                  </div>
                )}

                {/* 2. JUDUL */}
                <h2 className={cn(
                  "text-xl font-bold text-foreground lg:text-2xl mb-4",
                  (content as any).logoUrl ? "text-center" : ""
                )}>
                  {content.title}
                </h2>

                {/* 3. TEKS PARAGRAF */}
                <p className="text-base lg:text-lg leading-relaxed text-foreground/80 whitespace-pre-line text-justify">
                  {content.text}
                </p>
              </Card>
            )}

            {content.type === "image" && (content as any).imageUrl && (
              <div className="flex h-full w-full flex-col items-center justify-center">
                
                {/* 2. CARD:
                    - w-fit: Lebar menyesuaikan isi (gambar).
                    - h-fit: Tinggi menyesuaikan isi.
                    - mx-auto: Jaga-jaga agar center horizontal.
                */}
                <Card className="flex h-fit w-fit max-w-full flex-col items-center p-6 lg:p-8 shadow-md rounded-3xl border border-slate-100 bg-white mx-auto">
                  
                  {/* Judul */}
                  <h2 className="text-2xl font-bold text-foreground lg:text-3xl mb-6 text-center whitespace-nowrap">
                    {content.title}
                  </h2>

                  {/* 3. GAMBAR:
                      - h-[60vh]: Kita kunci tingginya 60% layar agar tidak kepanjangan.
                      - w-auto: Lebar otomatis menyesuaikan proporsi.
                      Card akan mengikuti lebar hasil render gambar ini.
                  */}
                  <img 
                    src={(content as any).imageUrl} 
                    alt="Struktur Organisasi" 
                    className="h-[60vh] w-auto object-contain rounded-[1.5rem] border border-slate-200 shadow-sm bg-white"
                  />

                </Card>
              </div>
            )}

            {/* LOGIKA GRID DINAMIS (1 Kolom vs 3 Kolom) */}
            {content.type === "points" && (
              <Card className="p-6 lg:p-8 shadow-md rounded-3xl border border-slate-100">
                <h2 className="text-2xl font-bold text-foreground lg:text-3xl mb-6 text-center">{content.title}</h2>
                
                <ul className={cn(
                  "grid gap-4",
                  // Jika item > 6: 3 Kolom (Compact)
                  (content.points?.length || 0) > 6 
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:gap-5"
                  // Jika item <= 6: 1 Kolom (Comfort / Lebar)
                    : "grid-cols-1 lg:gap-6"
                )}>
                  {content.points?.map((point, index) => {
                    const isLongList = (content.points?.length || 0) > 6;
                    
                    return (
                      <li key={index} className={cn(
                        "flex items-center gap-3 rounded-2xl bg-slate-50 border border-slate-100/50 hover:bg-blue-50 transition-colors",
                        isLongList ? "p-3 lg:p-3" : "p-4 lg:p-6"
                      )}>
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0F4C81] text-xs font-bold text-white">
                          {index + 1}
                        </span>
                        <span className={cn(
                          "font-medium leading-tight text-slate-700",
                          isLongList ? "text-sm lg:text-base" : "text-base lg:text-xl"
                        )}>
                          {point}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </Card>
            )}

            {content.type === "profile" && content.contactInfo && (
              <Card className="p-6 lg:p-10 shadow-md rounded-3xl border border-slate-100">
                <h2 className="text-2xl font-bold text-foreground lg:text-3xl mb-8">{content.title}</h2>
                <div className="grid gap-4 lg:gap-6">
                  <ContactItem icon={MapPin} label="Alamat" value={content.contactInfo.address} />
                  <ContactItem icon={Phone} label="Telepon" value={content.contactInfo.phone} />
                  <ContactItem icon={Mail} label="Email" value={content.contactInfo.email} />
                  <ContactItem icon={Clock} label="Jam Layanan" value={content.contactInfo.hours} />
                  {content.contactInfo.website && (
                    <ContactItem icon={Globe} label="Website" value={content.contactInfo.website} />
                  )}
                </div>
              </Card>
            )}

            {content.type === "officials" && content.officials && (
              <div className="w-full">
                <h2 className="mb-6 text-2xl font-bold text-foreground lg:text-3xl text-center">{content.title}</h2>
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
                  {content.officials.map((official, index) => (
                    <Card key={index} className="flex flex-col items-center p-5 text-center shadow-sm border border-slate-200 rounded-3xl hover:shadow-lg transition-all bg-white">
                      <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-[#0F4C81]">
                        <UserCircle className="h-8 w-8" />
                      </div>
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
      <div className="p-2 bg-white rounded-xl shadow-sm text-[#0F4C81]">
         <Icon className="h-5 w-5 lg:h-6 lg:w-6" />
      </div>
      <div>
        <p className="text-[10px] lg:text-xs font-bold uppercase tracking-wider text-slate-400 mb-0.5">{label}</p>
        <p className="text-base lg:text-lg font-semibold text-slate-800 leading-tight">{value}</p>
      </div>
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