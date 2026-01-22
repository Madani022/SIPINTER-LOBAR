"use client";

import { useSearchParams } from "next/navigation";
import { KioskProvider } from "@/components/kiosk/kiosk-provider";
import { AdminScreen } from "@/components/kiosk/admin-screen";

export default function AdminPage() {
  const searchParams = useSearchParams();
  const key = searchParams.get("key");

  if (key !== "ADMIN123") {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="max-w-md text-center space-y-3">
          <h1 className="text-2xl font-bold">Akses Ditolak</h1>
          <p className="text-white/70">Halaman ini hanya untuk admin.</p>
          <p className="text-white/50 text-sm">Key kamu: {String(key)}</p>
        </div>
      </div>
    );
  }

  return (
    <KioskProvider>
      <div className="h-screen w-screen overflow-hidden">
        <AdminScreen />
      </div>
    </KioskProvider>
  );
}
