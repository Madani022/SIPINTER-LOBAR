"use client"

import { useState } from "react"
import { 
  LayoutDashboard, FileText, Settings, Download, 
  Upload, Trash2, Edit, Wifi, WifiOff, RefreshCw, 
  Search, Filter, CheckCircle2, AlertCircle, PieChart, BarChart
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NavigationBar } from "./navigation-bar"
import { Badge } from "@/components/ui/badge" // Asumsi ada komponen Badge, jika tidak bisa pakai span biasa
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// --- DUMMY DATA: DOKUMEN ---
// Struktur ini disiapkan agar mudah diganti dengan data dari Database/API nanti
const initialDocs = [
  { id: "1", title: "SOP Pelayanan Perizinan", category: "sop", size: "1.2 MB", downloads: 145, status: "active", date: "2024-01-10" },
  { id: "2", title: "Standar Pelayanan (SP) IMB", category: "sp", size: "2.4 MB", downloads: 89, status: "active", date: "2024-01-12" },
  { id: "3", title: "Formulir Pendaftaran UMKM", category: "formulir", size: "0.5 MB", downloads: 230, status: "active", date: "2024-02-01" },
  { id: "4", title: "Pedoman Tata Ruang", category: "pedoman", size: "5.1 MB", downloads: 45, status: "inactive", date: "2023-11-20" },
  { id: "5", title: "Surat Edaran Bupati No. 5", category: "surat-edaran", size: "0.8 MB", downloads: 310, status: "active", date: "2024-01-05" },
]

// --- DUMMY DATA: ANALYTICS ---
const statsData = {
  totalVisitors: 1240,
  totalDownloads: 850,
  avgSession: "3m 45s",
  storageUsed: "45%"
}

export function AdminScreen() {
  // State untuk Data
  const [documents, setDocuments] = useState(initialDocs)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // State untuk Kiosk Control
  const [isOnline, setIsOnline] = useState(true)
  const [isCaching, setIsCaching] = useState(false)
  const [lastSync, setLastSync] = useState("Hari ini, 08:00 WITA")
  
  // State untuk Export
  const [isExporting, setIsExporting] = useState(false)

  // --- LOGIC FILTERING ---
  const filteredDocs = documents.filter(doc => {
    const matchSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchCat = selectedCategory === "all" || doc.category === selectedCategory
    return matchSearch && matchCat
  })

  // --- MOCK FUNCTIONS ---
  
  const handleExportPDF = () => {
    setIsExporting(true)
    // Simulasi proses generate PDF
    setTimeout(() => {
      setIsExporting(false)
      alert("Laporan Statistik berhasil diunduh (Simulasi PDF)")
    }, 2000)
  }

  const handleSyncData = () => {
    setIsCaching(true)
    // Simulasi caching data baru
    setTimeout(() => {
      setIsCaching(false)
      setLastSync(`Hari ini, ${new Date().toLocaleTimeString()} WITA`)
      alert("Data Kiosk berhasil diperbarui & dicache!")
    }, 1500)
  }

  const handleDelete = (id: string) => {
    if(confirm("Hapus dokumen ini?")) {
      setDocuments(prev => prev.filter(d => d.id !== id))
    }
  }

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <NavigationBar title="Admin Dashboard" showBack={false} />

      <div className="flex-1 overflow-y-auto p-4 lg:p-8">
        <Tabs defaultValue="analytics" className="space-y-6">
          
          <TabsList className="bg-white p-1 border shadow-sm">
            <TabsTrigger value="analytics" className="gap-2"><PieChart className="h-4 w-4"/> Analytics</TabsTrigger>
            <TabsTrigger value="documents" className="gap-2"><FileText className="h-4 w-4"/> Dokumen</TabsTrigger>
            <TabsTrigger value="controls" className="gap-2"><Settings className="h-4 w-4"/> Kiosk Control</TabsTrigger>
          </TabsList>

          {/* === TAB 1: ANALYTICS LOCAL === */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
               <StatsCard title="Total Pengunjung" value={statsData.totalVisitors} icon={<LayoutDashboard className="text-blue-500" />} />
               <StatsCard title="Dokumen Diunduh" value={statsData.totalDownloads} icon={<Download className="text-green-500" />} />
               <StatsCard title="Rata-rata Sesi" value={statsData.avgSession} icon={<RefreshCw className="text-orange-500" />} />
               <StatsCard title="Penyimpanan" value={statsData.storageUsed} icon={<Settings className="text-purple-500" />} />
            </div>

            <Card className="shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Laporan Aktivitas Bulanan</CardTitle>
                    <CardDescription>Rekapitulasi interaksi user pada Kiosk</CardDescription>
                  </div>
                  <Button onClick={handleExportPDF} disabled={isExporting} className="bg-slate-800 text-white gap-2">
                    {isExporting ? <RefreshCw className="h-4 w-4 animate-spin"/> : <FileText className="h-4 w-4"/>}
                    {isExporting ? "Memproses..." : "Export Laporan PDF"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-slate-100 rounded-xl border border-dashed border-slate-300">
                   <div className="text-center text-slate-400">
                      <BarChart className="h-16 w-16 mx-auto mb-2 opacity-50"/>
                      <p>Grafik Visualisasi Data akan tampil di sini</p>
                   </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* === TAB 2: MANAJEMEN DOKUMEN === */}
          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                   <CardTitle>Pustaka Dokumen</CardTitle>
                   <CardDescription>Kelola file, link, dan pengelompokan (Tag)</CardDescription>
                </div>
                <Button className="bg-[#0F4C81] hover:bg-[#0b3d69] gap-2">
                   <Upload className="h-4 w-4" /> Upload Baru
                </Button>
              </CardHeader>
              <CardContent>
                
                {/* Tools Bar: Search & Filter */}
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                   <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input 
                        placeholder="Cari judul dokumen..." 
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)} 
                      />
                   </div>
                   <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-slate-500" />
                      <select 
                        className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:ring-2 focus:ring-ring"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                      >
                        <option value="all">Semua Kategori</option>
                        <option value="sp">SP (Standar Pelayanan)</option>
                        <option value="sop">SOP</option>
                        <option value="formulir">Formulir</option>
                        <option value="pedoman">Pedoman</option>
                        <option value="surat-edaran">Surat Edaran</option>
                      </select>
                   </div>
                </div>

                {/* Table */}
                <div className="rounded-md border">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium">
                      <tr>
                        <th className="p-4">Nama Dokumen</th>
                        <th className="p-4">Tag / Kategori</th>
                        <th className="p-4">Statistik</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDocs.map((doc) => (
                        <tr key={doc.id} className="border-t hover:bg-slate-50/50">
                          <td className="p-4 font-medium text-slate-700">{doc.title}</td>
                          <td className="p-4">
                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-blue-100 text-blue-700 uppercase">
                              {doc.category}
                            </span>
                          </td>
                          <td className="p-4 text-slate-500">{doc.downloads} views</td>
                          <td className="p-4">
                            {doc.status === 'active' ? (
                              <span className="flex items-center gap-1 text-green-600 text-xs font-bold">
                                <CheckCircle2 className="h-3 w-3"/> Aktif
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-slate-400 text-xs font-bold">
                                <AlertCircle className="h-3 w-3"/> Draft
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-right">
                             <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500">
                                   <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDelete(doc.id)}>
                                   <Trash2 className="h-4 w-4" />
                                </Button>
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredDocs.length === 0 && (
                    <div className="p-8 text-center text-slate-500">Tidak ada dokumen ditemukan.</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* === TAB 3: KIOSK CONTROL === */}
          <TabsContent value="controls" className="space-y-6">
             <div className="grid gap-6 md:grid-cols-2">
                
                {/* Connectivity Control */}
                <Card>
                   <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                         {isOnline ? <Wifi className="h-5 w-5 text-green-500"/> : <WifiOff className="h-5 w-5 text-red-500"/>}
                         Mode Koneksi
                      </CardTitle>
                      <CardDescription>Atur perilaku aplikasi saat terhubung internet</CardDescription>
                   </CardHeader>
                   <CardContent className="flex items-center justify-between">
                      <div>
                         <p className="font-medium">Status: {isOnline ? "Online Mode" : "Offline Mode"}</p>
                         <p className="text-xs text-slate-500 mt-1">
                            {isOnline 
                              ? "Aplikasi akan mengambil data terbaru langsung dari server." 
                              : "Aplikasi menggunakan data lokal (Cache). Fitur Peta Online dimatikan."}
                         </p>
                      </div>
                      <div className="flex items-center space-x-2">
                         <Button 
                            variant={isOnline ? "default" : "outline"} 
                            onClick={() => setIsOnline(true)}
                            className={isOnline ? "bg-green-600 hover:bg-green-700" : ""}
                         >
                            Online
                         </Button>
                         <Button 
                            variant={!isOnline ? "default" : "outline"} 
                            onClick={() => setIsOnline(false)}
                            className={!isOnline ? "bg-slate-600 hover:bg-slate-700" : ""}
                         >
                            Offline
                         </Button>
                      </div>
                   </CardContent>
                </Card>

                {/* Caching Control */}
                <Card>
                   <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                         <RefreshCw className={`h-5 w-5 text-blue-500 ${isCaching ? "animate-spin" : ""}`}/>
                         Sinkronisasi & Cache
                      </CardTitle>
                      <CardDescription>Update konten lokal agar tersedia saat Offline</CardDescription>
                   </CardHeader>
                   <CardContent className="flex items-center justify-between">
                      <div>
                         <p className="font-medium">Terakhir Sinkronisasi:</p>
                         <p className="text-sm text-slate-500 font-mono mt-1">{lastSync}</p>
                      </div>
                      <Button onClick={handleSyncData} disabled={isCaching}>
                         {isCaching ? "Sedang Mengunduh..." : "Sync Data Sekarang"}
                      </Button>
                   </CardContent>
                </Card>

             </div>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  )
}

// Helper Component for Stats
function StatsCard({ title, value, icon }: { title: string, value: string | number, icon: any }) {
  return (
    <Card>
      <CardContent className="p-6 flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-xl">
           {icon}
        </div>
        <div>
           <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</p>
           <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        </div>
      </CardContent>
    </Card>
  )
}