"use client"

import { useRouter } from "next/navigation"
import { AdminScreen } from "@/components/kiosk/admin-screen" // Kita pakai UI yang sudah kamu buat
import { logout } from "@/actions/auth" // Import Server Action Logout

export default function DashboardPage() {
  const router = useRouter()

  // Wrapper untuk Logout agar bisa memanggil Server Action
  const handleLogout = async () => {
    await logout() // Panggil fungsi logout (Hapus cookie & Redirect)
  }

  // Wrapper untuk tombol "Lihat Kiosk"
  const handlePreview = () => {
    router.push("/") // Pindah ke halaman depan (Home)
  }

  return (
    <div className="min-h-screen bg-slate-50 animate-in fade-in duration-300">
       {/* Kita render komponen AdminScreen di sini.
          Kita oper fungsi handleLogout dan handlePreview sebagai props.
       */}
       <AdminScreen 
          onLogout={handleLogout}
          onPreviewKiosk={handlePreview}
       />
    </div>
  )
}