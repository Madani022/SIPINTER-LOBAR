"use client"

import { useState } from "react" // HAPUS 'useEffect' dari sini
import { useRouter } from "next/navigation" 
import Image from "next/image"
import Link from "next/link"

// UI Components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Lock, User, ArrowLeft, Loader2, Eye, EyeOff } from "lucide-react"

// Import Dashboard
import { KioskProvider } from "@/components/kiosk/kiosk-provider"
import { AdminScreen } from "@/components/kiosk/admin-screen"

export default function AdminPage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  // const [isLoadingCheck, setIsLoadingCheck] = useState(true) <--- HAPUS INI JUGA
  
  // State Form Login
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // === BAGIAN INI DIHAPUS AGAR TIDAK AUTO-LOGIN ===
  /* useEffect(() => {
    const checkSession = () => {
      const session = document.cookie
        .split("; ")
        .find((row) => row.startsWith("admin_session="))
      
      if (session) {
        setIsLoggedIn(true)
      }
      setIsLoadingCheck(false)
    }
    checkSession()
  }, [])
  */
  // =================================================

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    // [DEBUG 1] Cek apa yang kamu ketik
    console.log("1. Data yang dikirim:", { username, password })

    try {
      // GANTI URL INI SESUAI ENDPOINT API LOGIN KAMU
      // Misal: http://localhost:8000/api/login atau /api/auth/login
      const response = await fetch('/api/auth/login', { 
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          // 'Accept': 'application/json' // Kadang perlu ini
        },
        body: JSON.stringify({ 
          username: username, 
          password: password 
        })
      })

      // [DEBUG 2] Cek status server (200 OK atau 401 Unauthorized?)
      console.log("2. Status Server:", response.status)

      const data = await response.json()
      
      // [DEBUG 3] Cek balikan mentah dari Backend/DB
      console.log("3. Jawaban Backend:", data)

      if (response.ok && data.success) { // Sesuaikan 'data.success' dengan format JSON backendmu
         console.log("4. LOGIN BERHASIL! OTW DASHBOARD...")
         
         // Set Cookie
         document.cookie = "admin_session=true; path=/; max-age=86400; SameSite=Lax"
         
         setIsLoggedIn(true)
         setIsSubmitting(false)
      } else {
         // Tampilkan pesan error asli dari backend biar tau salahnya apa
         const pesanError = data.message || data.error || "Login Gagal (Cek Console)"
         console.error("4. LOGIN DITOLAK:", pesanError)
         setError(pesanError)
         setIsSubmitting(false)
      }

    } catch (err) {
      console.error("ERROR FATAL (Jaringan/Code):", err)
      setError("Gagal menghubungi server backend")
      setIsSubmitting(false)
    }

    if (username === "admin" && password === "admin") {
         setTimeout(() => {
            // Kita tetap set cookie buat middleware (biar ga ditendang middleware)
            // TAPI... karena useEffect di atas dihapus, saat refresh dia bakal minta login lagi
            document.cookie = "admin_session=true; path=/; max-age=86400; SameSite=Lax"
            
            setIsLoggedIn(true)
            setIsSubmitting(false)
         }, 800)
    } else {
         setError("Username atau password salah")
         setIsSubmitting(false)
    }
  }

  const handleLogout = () => {
    document.cookie = "admin_session=; path=/; max-age=0"
    setIsLoggedIn(false)
    setUsername("")
    setPassword("")
  }

  // HAPUS TAMPILAN LOADING AWAL
  /*
  if (isLoadingCheck) {
      return <div className="min-h-screen w-full bg-slate-100" /> 
  }
  */

  // KONDISI SUDAH LOGIN -> DASHBOARD
  if (isLoggedIn) {
    return (
      <KioskProvider>
        <AdminScreen 
            onLogout={handleLogout}
            onPreviewKiosk={() => router.push('/')}
        />
      </KioskProvider>
    )
  }

  // ... (SISA KODE KE BAWAH/TAMPILAN FORM TETAP SAMA) ...
  return (
    <div className="min-h-screen w-full bg-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
        {/* ... Paste sisa kode tampilan form login yang tadi disini ... */}
        {/* ... Pastikan kode return UI-nya lengkap seperti sebelumnya ... */}
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[2.5rem] relative z-10 animate-in fade-in zoom-in duration-300">
            <CardContent className="p-8 sm:p-10">
                <div className="flex flex-col items-center text-center mb-10">
                    <div className="relative h-24 w-24 bg-white rounded-2xl shadow-lg p-2 mb-6 flex items-center justify-center">
                        <Image 
                            src="/logoSipinterLobar.png" 
                            alt="Logo Instansi" 
                            width={80}
                            height={80}
                            className="object-contain"
                            priority
                        />
                    </div>
                    <h1 className="text-2xl font-black text-[#0F4C81] tracking-wide uppercase">Admin Portal</h1>
                    <p className="text-slate-500 font-medium text-sm mt-1">SIPINTER Kab. Lombok Barat</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    {/* ... Input Username ... */}
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
                                disabled={isSubmitting}
                                required
                            />
                        </div>
                    </div>

                    {/* ... Input Password ... */}
                    <div className="space-y-2">
                        <div className="relative group">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0F4C81] transition-colors">
                                <Lock className="h-6 w-6" />
                            </div>
                            <Input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="Password" 
                                className="pl-14 pr-14 h-16 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-[#0F4C81]/20 focus:ring-4 focus:ring-[#0F4C81]/10 text-lg font-medium transition-all shadow-inner"
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isSubmitting}
                                required
                            />
                            <button
                                type="button" 
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0F4C81] transition-colors focus:outline-none"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm font-bold p-4 rounded-xl text-center border border-red-100 flex items-center justify-center gap-2 animate-in fade-in duration-200">
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    <Button 
                        type="submit" 
                        disabled={isSubmitting} 
                        className="w-full h-16 rounded-2xl bg-[#0F4C81] hover:bg-[#0b3d69] text-white text-lg font-bold shadow-lg shadow-blue-900/20 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 mt-4"
                    >
                        {isSubmitting ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="h-5 w-5 animate-spin" /> 
                            Masuk
                        </div>
                        ) : (
                        "Login"
                        )}
                    </Button>
                </form>
                
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
        <div className="absolute bottom-6 text-slate-400 text-xs font-medium opacity-60">
            &copy; {new Date().getFullYear()} DPMPTSP Lombok Barat
        </div>
    </div>
  )
}