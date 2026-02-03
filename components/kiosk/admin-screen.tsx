"use client"

import { useState, useMemo, useEffect } from "react"
import { 
  LayoutDashboard, FileText, Settings, 
  Upload, Trash2, Edit, Wifi, WifiOff, RefreshCw, 
  Search, MonitorPlay, LogOut, ChevronRight,
  MousePointerClick, Star, QrCode, Loader2
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"

// Import Server Actions (Pastikan path-nya sesuai struktur foldermu)
import { getDocuments, createDocument, updateDocument, deleteDocument } from "@/actions/documents"
import { getCategories } from "@/actions/categories"

// --- TIPE DATA ---
// Disesuaikan dengan Prisma Result
type Category = {
  id: string
  name: string
  slug: string
}

type Document = {
  id: string
  title: string
  slug: string
  description?: string | null
  categoryId: string
  category?: Category
  filePath: string
  fileSize: number
  downloadCount: number
  viewCount: number
  isActive: boolean
  isFeatured: boolean
  createdAt: Date
}

type Log = {
  id: number
  action: string
  detail: string
  time: string
}

interface AdminScreenProps {
  onLogout?: () => void;
  onPreviewKiosk?: () => void;
}

export function AdminScreen({ onLogout, onPreviewKiosk }: AdminScreenProps) {
  // STATE UTAMA
  const [activeTab, setActiveTab] = useState<"analytics" | "documents" | "controls">("analytics")
  const [documents, setDocuments] = useState<Document[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [logs, setLogs] = useState<Log[]>([])
  
  // STATE LOADING & STATUS
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isOnline, setIsOnline] = useState(true)

  // STATE FILTER & MODAL
  const [searchQuery, setSearchQuery] = useState("")
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null)

  // --- FETCH DATA (INIT) ---
  const fetchData = async () => {
    setIsLoading(true)
    try {
      // 1. Fetch Categories
      const catRes = await getCategories(true)
      if (catRes.success && catRes.data) {
        setCategories(catRes.data)
      }

      // 2. Fetch Documents
      const docRes = await getDocuments({ limit: 100 }) // Ambil 100 teratas
      if (docRes.success && docRes.data) {
        setDocuments(docRes.data as Document[])
      }
    } catch (error) {
      console.error("Gagal mengambil data:", error)
      addLog("System Error", "Gagal mengambil data dari server")
    } finally {
      setIsLoading(false)
    }
  }

  // Panggil fetchData saat komponen di-mount
  useEffect(() => {
    fetchData()
  }, [])

  // --- LOGIC STATISTIK ---
  const stats = useMemo(() => {
    const totalViews = documents.reduce((acc, doc) => acc + (doc.viewCount || 0), 0)
    const totalDownloads = documents.reduce((acc, doc) => acc + (doc.downloadCount || 0), 0)
    
    return {
       interactions: totalViews + totalDownloads, // Total interaksi kasar
       docOpens: totalViews,
       docCount: documents.length,
       qrScans: documents.reduce((acc, doc) => acc + (doc.downloadCount || 0), 0) // Asumsi download via QR
    }
  }, [documents])

  const filteredDocs = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // --- HELPER LOG ---
  const addLog = (action: string, detail: string) => {
    const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    setLogs(prev => [{ id: Date.now(), action, detail, time }, ...prev])
  }

  // --- HANDLERS (CRUD) ---

  // 1. DELETE DOKUMEN
  const handleDelete = async (id: string) => {
    if(!confirm("Yakin ingin menghapus dokumen ini? Data fisik file juga akan dihapus.")) return

    try {
      const result = await deleteDocument(id)
      if (result.success) {
        setDocuments(prev => prev.filter(d => d.id !== id))
        addLog("Hapus Dokumen", `Dokumen ID-${id.substring(0,6)}... dihapus`)
      } else {
        alert("Gagal menghapus: " + result.error)
      }
    } catch (error) {
      console.error(error)
      alert("Terjadi kesalahan sistem")
    }
  }

  // 2. UPLOAD & CREATE DOKUMEN
  const handleSaveUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const form = e.target as HTMLFormElement
    const title = (form.elements.namedItem('title') as HTMLInputElement).value
    const categoryId = (form.elements.namedItem('category') as HTMLInputElement).value
    const fileInput = form.elements.namedItem('file') as HTMLInputElement
    
    // Validasi sederhana
    if (!fileInput.files || fileInput.files.length === 0) {
        alert("Harap pilih file PDF")
        setIsSubmitting(false)
        return
    }

    try {
        // A. Upload File Fisik ke API Route (/api/upload)
        const formData = new FormData()
        formData.append("file", fileInput.files[0])

        const uploadRes = await fetch("/api/upload", {
            method: "POST",
            body: formData
        })

        const uploadData = await uploadRes.json()

        if (!uploadData.success) {
            throw new Error(uploadData.error || "Gagal upload file fisik")
        }

        // B. Simpan Metadata ke Database via Server Action
        const createRes = await createDocument({
            title: title,
            categoryId: categoryId,
            filePath: uploadData.data.filePath, // Path dari API Upload
            fileSize: uploadData.data.fileSize,
            isActive: true,
            isFeatured: false
        })

        if (createRes.success && createRes.data) {
            // Update UI State langsung tanpa reload
            setDocuments([createRes.data as Document, ...documents])
            addLog("Upload Dokumen", `Berhasil menambahkan ${title}`)
            setIsUploadOpen(false)
            form.reset()
        } else {
            throw new Error(createRes.error || "Gagal menyimpan ke database")
        }

    } catch (error: any) {
        console.error(error)
        alert(error.message)
        addLog("Error Upload", error.message)
    } finally {
        setIsSubmitting(false)
    }
  }

  // 3. EDIT DOKUMEN (Metadata Only)
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDoc) return
    setIsSubmitting(true)

    const form = e.target as HTMLFormElement
    const updatedTitle = (form.elements.namedItem('title') as HTMLInputElement).value
    const updatedCategoryId = (form.elements.namedItem('category') as HTMLInputElement).value

    try {
        const result = await updateDocument(selectedDoc.id, {
            title: updatedTitle,
            categoryId: updatedCategoryId
        })

        if (result.success && result.data) {
            // Update State
            setDocuments(prev => prev.map(doc => 
                doc.id === selectedDoc.id ? (result.data as Document) : doc
            ))
            addLog("Edit Dokumen", `Mengubah data ${updatedTitle}`)
            setIsEditOpen(false)
            setSelectedDoc(null)
        } else {
            alert("Gagal update: " + result.error)
        }
    } catch (error) {
        console.error(error)
        alert("Gagal mengupdate dokumen")
    } finally {
        setIsSubmitting(false)
    }
  }

  const openEditModal = (doc: Document) => {
      setSelectedDoc(doc)
      setIsEditOpen(true)
  }

  // --- HELPER UTILS ---
  const getMenuColor = (menuName: string) => {
    const colors: Record<string, string> = {
      "Standar Pelayanan": "bg-blue-100 text-blue-700", 
      "SOP": "bg-purple-100 text-purple-700",
      "Formulir": "bg-orange-100 text-orange-700", 
      "Pedoman": "bg-green-100 text-green-700",
      "Umum": "bg-slate-100 text-slate-700"
    }
    return colors[menuName] || colors["Umum"]
  }

  const formatFileSize = (bytes: number) => {
      if (bytes === 0) return '0 B'
      const k = 1024
      const sizes = ['B', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  // --- RENDER ---
  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-slate-700">
           <div className="h-8 w-8 rounded bg-blue-500 flex items-center justify-center mr-3 font-bold text-white">SP</div>
           <span className="font-bold text-lg tracking-wide">SIPINTER Admin</span>
        </div>
        <div className="flex-1 py-6 px-3 space-y-1">
           <SidebarButton active={activeTab === "analytics"} onClick={() => setActiveTab("analytics")} icon={<LayoutDashboard className="h-5 w-5"/>} label="Dashboard" />
           <SidebarButton active={activeTab === "documents"} onClick={() => setActiveTab("documents")} icon={<FileText className="h-5 w-5"/>} label="Dokumen" />
           <SidebarButton active={activeTab === "controls"} onClick={() => setActiveTab("controls")} icon={<Settings className="h-5 w-5"/>} label="Kiosk Control" />
        </div>
        <div className="p-4 border-t border-slate-700 space-y-2">
           <Button variant="secondary" className="w-full justify-start gap-2 bg-slate-800 text-slate-200 hover:bg-slate-700 border-none" onClick={onPreviewKiosk}>
              <MonitorPlay className="h-4 w-4" /> Preview Kiosk
           </Button>
           <Button variant="destructive" className="w-full justify-start gap-2" onClick={() => { if(confirm("Yakin ingin keluar?")) onLogout?.() }}>
              <LogOut className="h-4 w-4" /> Logout
           </Button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 shrink-0 z-10">
           <h1 className="text-xl font-bold text-slate-800 capitalize">
              {activeTab === "analytics" ? "Overview Statistik" : activeTab === "documents" ? "Manajemen Dokumen" : "Pengaturan Sistem"}
           </h1>
           <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border cursor-pointer hover:opacity-80 transition-opacity ${isOnline ? "bg-green-50 text-green-700 border-green-200" : "bg-slate-100 text-slate-600 border-slate-200"}`} onClick={() => setIsOnline(!isOnline)}>
                 {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
                 {isOnline ? "SYSTEM ONLINE" : "OFFLINE MODE"}
              </div>
              <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">A</div>
           </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
           
           {/* === TAB ANALYTICS === */}
           {activeTab === "analytics" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                 {/* Stat Cards */}
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatsCard title="Total Views" value={`${stats.docOpens}`} icon={<MousePointerClick className="text-blue-500" />} />
                    <StatsCard title="Total Dokumen" value={`${stats.docCount}`} icon={<FileText className="text-indigo-500" />} />
                    <StatsCard title="Popularity" value={`${stats.interactions}`} icon={<Star className="text-yellow-500" />} />
                    <StatsCard title="Est. QR Scans" value={`${stats.qrScans}`} icon={<QrCode className="text-green-500" />} />
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Log Aktivitas Terbaru */}
                    <Card className="shadow-sm border-slate-200 flex flex-col lg:col-span-3">
                        <CardHeader><CardTitle className="text-base">Aktivitas Admin</CardTitle><CardDescription>Log aktivitas sesi ini</CardDescription></CardHeader>
                        <CardContent>
                           {logs.length === 0 ? (
                               <div className="text-center text-slate-400 text-sm py-8">Belum ada aktivitas baru</div>
                           ) : (
                               <div className="space-y-4 max-h-[300px] overflow-y-auto">
                                  {logs.map((log) => (
                                     <div key={log.id} className="flex gap-3 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                                        <div className="h-2 w-2 mt-2 rounded-full bg-blue-500 shrink-0" />
                                        <div>
                                           <p className="text-sm font-medium text-slate-800">{log.action}</p>
                                           <p className="text-xs text-slate-500">{log.detail}</p>
                                           <p className="text-[10px] text-slate-400 mt-1">{log.time}</p>
                                        </div>
                                     </div>
                                  ))}
                               </div>
                           )}
                        </CardContent>
                    </Card>
                 </div>
              </div>
           )}

           {/* === TAB DOCUMENTS (CRUD) === */}
           {activeTab === "documents" && (
              <div className="space-y-4 animate-in fade-in duration-300">
                 <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="relative w-full max-w-sm">
                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                       <Input 
                        placeholder="Cari dokumen..." 
                        className="pl-9 bg-white" 
                        value={searchQuery} 
                        onChange={(e) => setSearchQuery(e.target.value)} 
                       />
                    </div>
                    
                    {/* BUTTON UPLOAD DENGAN DIALOG */}
                    <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-[#0F4C81] hover:bg-[#0b3d69] gap-2"><Upload className="h-4 w-4" /> Upload Dokumen</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <form onSubmit={handleSaveUpload}>
                                <DialogHeader>
                                    <DialogTitle>Upload Dokumen Baru</DialogTitle>
                                    <DialogDescription>Isi detail dokumen yang akan ditampilkan di Kiosk.</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="title">Judul Dokumen</Label>
                                        <Input id="title" name="title" placeholder="Contoh: SOP Pelayanan..." required disabled={isSubmitting} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="category">Kategori / Menu</Label>
                                        <Select name="category" required disabled={isSubmitting}>
                                            <SelectTrigger><SelectValue placeholder="Pilih Kategori" /></SelectTrigger>
                                            <SelectContent>
                                                {categories.map((cat) => (
                                                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="file">File PDF</Label>
                                        <Input id="file" name="file" type="file" accept=".pdf" required disabled={isSubmitting} />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setIsUploadOpen(false)} disabled={isSubmitting}>Batal</Button>
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Uploading...</> : "Simpan Dokumen"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                 </div>

                 <Card className="border-slate-200 shadow-sm">
                    {isLoading ? (
                        <div className="p-8 text-center text-slate-500 flex flex-col items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin mb-2 text-[#0F4C81]"/>
                            Memuat data dokumen...
                        </div>
                    ) : (
                        <div className="rounded-md">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-medium border-b">
                            <tr>
                                <th className="p-4 w-[40%]">Nama Dokumen</th>
                                <th className="p-4">Kategori</th>
                                <th className="p-4">Ukuran</th>
                                <th className="p-4">Views</th>
                                <th className="p-4 text-right">Aksi</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y">
                            {filteredDocs.length === 0 ? (
                                <tr><td colSpan={5} className="p-4 text-center text-slate-400">Tidak ada dokumen ditemukan.</td></tr>
                            ) : (
                                filteredDocs.map((doc) => (
                                    <tr key={doc.id} className="hover:bg-slate-50 bg-white transition-colors">
                                        <td className="p-4 font-medium text-slate-700 flex items-center gap-3">
                                            <div className="h-8 w-8 rounded bg-red-50 text-red-500 flex items-center justify-center border border-red-100 shrink-0">
                                                <FileText className="h-4 w-4"/>
                                            </div>
                                            <div className="flex flex-col truncate">
                                                <span className="truncate">{doc.title}</span>
                                                <span className="text-[10px] text-slate-400">{doc.slug}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <Badge className={`${getMenuColor(doc.category?.name || "Umum")} border-none px-2.5 py-0.5 font-semibold text-xs rounded-md shadow-none`}>
                                                {doc.category?.name || "Uncategorized"}
                                            </Badge>
                                        </td>
                                        <td className="p-4 text-slate-500 font-mono text-xs">{formatFileSize(doc.fileSize)}</td>
                                        <td className="p-4 text-slate-500">{doc.viewCount}</td>
                                        <td className="p-4 text-right flex justify-end gap-1">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600" onClick={() => openEditModal(doc)}><Edit className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600" onClick={() => handleDelete(doc.id)}><Trash2 className="h-4 w-4" /></Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                        </div>
                    )}
                 </Card>

                 {/* DIALOG EDIT (POPUP TERPISAH) */}
                 <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogContent className="sm:max-w-[500px]">
                        <form onSubmit={handleSaveEdit}>
                            <DialogHeader>
                                <DialogTitle>Edit Dokumen</DialogTitle>
                                <DialogDescription>Ubah informasi metadata dokumen.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label>Judul Dokumen</Label>
                                    <Input id="edit-title" name="title" defaultValue={selectedDoc?.title} required disabled={isSubmitting} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Kategori</Label>
                                    <Select name="category" defaultValue={selectedDoc?.categoryId} disabled={isSubmitting}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {categories.map((cat) => (
                                                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} disabled={isSubmitting}>Batal</Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                 </Dialog>
              </div>
           )}

           {/* === TAB KIOSK CONTROL === */}
           {activeTab === "controls" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="grid gap-6 md:grid-cols-2">
                      <Card className="border-slate-200 shadow-sm">
                         <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Wifi className="h-5 w-5 text-blue-500"/> Mode Koneksi</CardTitle><CardDescription>Status sinkronisasi data</CardDescription></CardHeader>
                         <CardContent>
                            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-lg border border-slate-100">
                               <span className="font-medium text-sm text-slate-700">Status Sync</span>
                               <Button variant="outline" size="sm" className="gap-2 bg-white" onClick={fetchData} disabled={isLoading}>
                                    <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`}/> Sync Now
                               </Button>
                            </div>
                         </CardContent>
                      </Card>
                  </div>
              </div>
           )}
        </main>
      </div>
    </div>
  )
}

// --- SUB COMPONENTS (TIDAK BERUBAH) ---
function SidebarButton({ active, onClick, icon, label }: any) {
   return (
      <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${active ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}>
         {icon}{label}{active && <ChevronRight className="ml-auto h-4 w-4 opacity-50" />}
      </button>
   )
}

function StatsCard({ title, value, icon }: any) {
   return (
     <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
       <CardContent className="p-5 flex items-center gap-4">
         <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center shrink-0 text-xl border border-slate-100">{icon}</div>
         <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</p>
            <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
         </div>
       </CardContent>
     </Card>
   )
}