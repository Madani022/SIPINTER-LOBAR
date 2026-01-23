"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Lock, User, LogOut, LayoutDashboard, ArrowLeft, Loader2 } from "lucide-react"

// Import Provider & Dashboard
import { KioskProvider } from "@/components/kiosk/kiosk-provider"
import { AdminScreen } from "@/components/kiosk/admin-screen"

export default function AdminLoginPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulasi loading network
    setTimeout(() => {
      // GANTI DENGAN KREDENSIAL ASLI
      if (username === "admin" && password === "lobar123") {
        setIsLoggedIn(true)
      } else {
        setError("Username atau password salah")
        setIsLoading(false)
      }
    }, 800)
  }

  // === TAMPILAN 1: SUDAH LOGIN (DASHBOARD AREA) ===
  if (isLoggedIn) {
    return (
      <KioskProvider>
        <div className="min-h-screen bg-slate-50 flex flex-col">
          {/* Header Dashboard Admin (Internal) */}
          <header className="h-20 bg-[#0F4C81] text-white px-6 lg:px-8 flex justify-between items-center shadow-md sticky top-0 z-50">
             <div className="flex items-center gap-3">
                 <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm">
                    <LayoutDashboard className="h-6 w-6 text-white" />
                 </div>
                 <div>
                    <h1 className="font-bold text-lg leading-tight uppercase tracking-wider">Admin Panel</h1>
                    <p className="text-xs text-blue-200 opacity-80">SIPINTER Management System</p>
                 </div>
             </div>
              
             <Button 
                  onClick={() => setIsLoggedIn(false)} 
                  variant="secondary"
                  size="sm"
                  className="gap-2 bg-white/10 text-white hover:bg-white hover:text-[#0F4C81] border-none"
              >
                  <LogOut className="h-4 w-4" />
                  Keluar
              </Button>
          </header>
          
          <div className="flex-1 p-6 lg:p-8">
              <AdminScreen />
          </div>
        </div>
      </KioskProvider>
    )
  }

  // === TAMPILAN 2: BELUM LOGIN (LOGIN SCREEN BERSIH) ===
  return (
    // Background dibuat senada dengan tema Kiosk (Slate halus)
    <div className="min-h-screen w-full bg-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Dekorasi Background Abstrak (Opsional - agar tidak terlalu polos) */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#0F4C81]/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[100px]" />

      {/* KARTU LOGIN UTAMA */}
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[2.5rem] relative z-10 animate-in fade-in zoom-in duration-500">
        <CardContent className="p-8 sm:p-10">
            
            {/* 1. Logo & Judul (Pengganti Navbar) */}
            <div className="flex flex-col items-center text-center mb-10">
                <div className="relative h-24 w-24 bg-white rounded-2xl shadow-lg p-2 mb-6 flex items-center justify-center">
                    {/* Pastikan file /logo.png ada di folder public */}
                    <Image 
                        src="/logoSipinterLobar.png" 
                        alt="Logo Instansi" 
                        width={80}
                        height={80}
                        className="object-contain"
                        priority
                    />
                </div>
                <h1 className="text-2xl font-black text-[#0F4C81] tracking-wide uppercase">
                    Admin Portal
                </h1>
                <p className="text-slate-500 font-medium text-sm mt-1">
                    SIPINTER Kab. Lombok Barat
                </p>
            </div>

            {/* 2. Form Input */}
            <form onSubmit={handleLogin} className="space-y-5">
                
                <div className="space-y-2">
                    <div className="relative group">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0F4C81] transition-colors">
                            <User className="h-6 w-6" />
                        </div>
                        <Input 
                            type="text" 
                            placeholder="Username" 
                            className="pl-14 h-16 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-[#0F4C81]/20 focus:ring-4 focus:ring-[#0F4C81]/10 text-lg font-medium transition-all shadow-inner"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="relative group">
                         <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0F4C81] transition-colors">
                            <Lock className="h-6 w-6" />
                        </div>
                        <Input 
                            type="password" 
                            placeholder="Password" 
                            className="pl-14 h-16 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-[#0F4C81]/20 focus:ring-4 focus:ring-[#0F4C81]/10 text-lg font-medium transition-all shadow-inner"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 text-sm font-bold p-4 rounded-xl text-center border border-red-100 animate-in slide-in-from-top-2 flex items-center justify-center gap-2">
                        <span>⚠️</span> {error}
                    </div>
                )}

                <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full h-16 rounded-2xl bg-[#0F4C81] hover:bg-[#0b3d69] text-white text-lg font-bold shadow-lg shadow-blue-900/20 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 mt-4"
                >
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="h-5 w-5 animate-spin" /> 
                            Memproses...
                        </div>
                    ) : (
                        "Masuk Dashboard"
                    )}
                </Button>
            </form>
            
            {/* 3. Link Kembali ke User Mode */}
            <div className="mt-8 text-center">
                 <Link 
                    href="/" 
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-[#0F4C81] transition-colors font-semibold text-sm py-2 px-4 rounded-full hover:bg-slate-100"
                 >
                    <ArrowLeft className="h-4 w-4" /> Kembali ke Layar Kiosk
                 </Link>
            </div>

        </CardContent>
      </Card>

      {/* Footer Copyright Kecil */}
      <div className="absolute bottom-6 text-slate-400 text-xs font-medium opacity-60">
        &copy; {new Date().getFullYear()} DPMPTSP Lombok Barat
      </div>

    </div>
  )
}