"use client"

import { useState, useMemo, useEffect } from "react"
import { 
  LayoutDashboard, FileText, Settings, 
  Upload, Trash2, Edit, Wifi, WifiOff,
  Search, MonitorPlay, LogOut, Link as LinkIcon,
  MousePointerClick, Star, TrendingUp, Activity, Server, AlertTriangle 
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Dialog, DialogContent, DialogFooter, 
  DialogHeader, DialogTitle 
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog" // ✅ IMPORT BARU
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
  SelectGroup, SelectLabel
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

// --- SERVER ACTIONS ---
import { getDocuments, createDocument, updateDocument, deleteDocument } from "@/actions/documents"
import { getCategories } from "@/actions/categories" 
import { getDashboardStats } from "@/actions/dashboard"

// --- KONFIGURASI DROPDOWN ---
const DROPDOWN_STRUCTURE = [
  { label: "PENANAMAN MODAL", matchers: ["ipro", "lkpm"] },
  { label: "PERIZINAN (SP & SOP)", matchers: ["sp", "sop", "standar pelayanan"] },
  { label: "PERIZINAN (LAYANAN SEKTOR)", matchers: ["industri", "perdagangan", "kesehatan", "lingkungan", "putr", "perhubungan", "pariwisata", "koperasi", "tenaga kerja", "kelautan", "pertanian", "pendidikan", "bpjs"] },
  { label: "INFORMASI TATA RUANG", matchers: ["rdtr", "tata ruang"] },
  { label: "INFORMASI PUBLIK DAN MPP", matchers: ["regulasi", "dasar hukum", "persyaratan", "mpp"] }
]

// --- TIPE DATA ---
type Category = { id: string; name: string; slug: string }
type Document = {
  id: string; title: string; slug: string; categoryId: string; category?: Category;
  filePath: string; fileSize: number; downloadUrl?: string; 
  downloadCount: number; viewCount: number;
  isActive: boolean; isFeatured: boolean; createdAt: Date
}
type Log = { id: number; action: string; detail: string; time: string }

interface AdminScreenProps {
  onLogout?: () => void;
  onPreviewKiosk?: () => void;
}

export function AdminScreen({ onLogout, onPreviewKiosk }: AdminScreenProps) {
  // STATE
  const [activeTab, setActiveTab] = useState<"analytics" | "documents" | "controls">("analytics")
  const [documents, setDocuments] = useState<Document[]>([])
  const [categories, setCategories] = useState<Category[]>([]) 
  const [dashboardStats, setDashboardStats] = useState({
    docCount: 0, catCount: 0, totalViews: 0,
    mostPopularName: "-", mostPopularCount: 0,
    top5Docs: [] as any[], logs: [] as Log[]
  })
  const [networkError, setNetworkError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // FILTERS & MODALS
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")
  
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null)

  // ✅ STATE BARU: ID DOKUMEN YANG AKAN DIHAPUS
  const [deleteId, setDeleteId] = useState<string | null>(null) 

  // --- FETCH DATA ---
  const fetchMainData = async () => {
    try {
      const catRes = await getCategories(true)
      if (catRes.success && catRes.data) setCategories(catRes.data)

      const docRes = await getDocuments({ limit: 500 }) 
      if (docRes.success && docRes.data) setDocuments(docRes.data as Document[])

      const dashRes = await getDashboardStats()
      if (dashRes.success && dashRes.data) {
         setDashboardStats({
            docCount: dashRes.data.docCount,
            catCount: dashRes.data.categoryCount,
            totalViews: dashRes.data.totalViews,
            mostPopularName: dashRes.data.mostPopular?.title || "Belum ada data",
            mostPopularCount: dashRes.data.mostPopular?.viewCount || 0,
            top5Docs: dashRes.data.top5Docs,
            logs: dashRes.data.recentActivity.map((doc: any) => ({
                id: Math.random(),
                action: doc.createdAt === doc.updatedAt ? "Dokumen Baru" : "Update Dokumen",
                detail: `Mengelola "${doc.title}"`,
                time: new Date(doc.updatedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
            }))
         })
         setNetworkError(false)
      }
    } catch (error) {
      console.error("Connection Error:", error)
      setNetworkError(true)
    }
  }

  useEffect(() => { 
    fetchMainData() 
    const interval = setInterval(fetchMainData, 15000)
    return () => clearInterval(interval)
  }, [])

  // --- LOGIKA GROUPING ---
  const groupedCategoriesFromDB = useMemo(() => {
    const groups: Record<string, Category[]> = {}
    DROPDOWN_STRUCTURE.forEach(struct => groups[struct.label] = [])
    groups["LAINNYA"] = [] 

    const usedCategoryIds = new Set<string>()

    DROPDOWN_STRUCTURE.forEach(struct => {
      categories.forEach(cat => {
        if (usedCategoryIds.has(cat.id)) return 
        const isMatch = struct.matchers.some(keyword => 
          cat.name.toLowerCase().includes(keyword.toLowerCase()) || 
          cat.slug.toLowerCase().includes(keyword.toLowerCase())
        )
        if (isMatch) {
          groups[struct.label].push(cat)
          usedCategoryIds.add(cat.id)
        }
      })
    })

    categories.forEach(cat => {
      if (!usedCategoryIds.has(cat.id)) {
        groups["LAINNYA"].push(cat)
      }
    })
    return groups
  }, [categories])

  // --- FILTER LOGIC ---
  const filteredDocs = useMemo(() => {
    let data = documents
    if (searchQuery) data = data.filter(doc => doc.title.toLowerCase().includes(searchQuery.toLowerCase()))
    if (filterCategory && filterCategory !== "all") data = data.filter(doc => doc.categoryId === filterCategory)
    
    return data.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime()
        const dateB = new Date(b.createdAt).getTime()
        return sortOrder === "newest" ? dateB - dateA : dateA - dateB
    })
  }, [documents, searchQuery, filterCategory, sortOrder])

  // --- ACTIONS ---
  
  // ✅ FUNGSI 1: TRIGGER POPUP KONFIRMASI
  const confirmDelete = (id: string) => {
    setDeleteId(id)
  }

  // ✅ FUNGSI 2: EKSEKUSI HAPUS (SETELAH KLIK YES DI POPUP)
  const executeDelete = async () => {
    if (!deleteId) return
    
    const res = await deleteDocument(deleteId)
    if (res.success) {
        setDocuments(prev => prev.filter(d => d.id !== deleteId))
        fetchMainData()
        setDeleteId(null) // Tutup popup
    } else {
        alert(res.error)
    }
  }

  const handleSaveUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const form = e.target as HTMLFormElement
    
    const title = (form.elements.namedItem('title') as HTMLInputElement).value
    const categoryId = (form.elements.namedItem('category') as HTMLInputElement).value
    const fileInput = form.elements.namedItem('file') as HTMLInputElement
    const downloadUrl = (form.elements.namedItem('downloadUrl') as HTMLInputElement).value 

    if (!fileInput.files || !fileInput.files[0]) {
        alert("Pilih file PDF"); setIsSubmitting(false); return;
    }

    try {
        const formData = new FormData()
        formData.append("file", fileInput.files[0])
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData })
        const uploadData = await uploadRes.json()

        if (!uploadData.success) throw new Error(uploadData.error)

        const res = await createDocument({
            title, 
            categoryId,
            filePath: uploadData.data.filePath, 
            fileSize: uploadData.data.fileSize,
            downloadUrl: downloadUrl 
        })

        if (res.success && res.data) {
            setDocuments([res.data as Document, ...documents])
            setIsUploadOpen(false)
            form.reset()
            fetchMainData()
        } else alert(res.error)
    } catch (err: any) { alert(err.message) }
    finally { setIsSubmitting(false) }
  }

  const handleSaveEdit = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!selectedDoc) return
      setIsSubmitting(true)
      const form = e.target as HTMLFormElement
      const title = (form.elements.namedItem('title') as HTMLInputElement).value
      const categoryId = (form.elements.namedItem('category') as HTMLInputElement).value
      const downloadUrl = (form.elements.namedItem('downloadUrl') as HTMLInputElement).value 
      
      try {
          const res = await updateDocument(selectedDoc.id, { 
              title, 
              categoryId,
              downloadUrl 
          })
          if (res.success && res.data) {
              setDocuments(prev => prev.map(d => d.id === selectedDoc.id ? (res.data as Document) : d))
              setIsEditOpen(false); setSelectedDoc(null)
              fetchMainData()
          } else alert(res.error)
      } catch(err) { alert("Gagal update dokumen") }
      finally { setIsSubmitting(false) }
  }

  const openEditModal = (doc: Document) => { setSelectedDoc(doc); setIsEditOpen(true) }
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B'; const sizes = ['B', 'KB', 'MB']; const i = Math.floor(Math.log(bytes) / Math.log(1024)); return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
  }

  // --- RENDER COMPONENT ---
  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-slate-700">
           <div className="h-8 w-8 rounded bg-blue-500 flex items-center justify-center mr-3 font-bold">SP</div>
           <span className="font-bold text-lg">SIPINTER Admin</span>
        </div>
        <div className="flex-1 py-6 px-3 space-y-1">
           <SidebarButton active={activeTab === "analytics"} onClick={() => setActiveTab("analytics")} icon={<LayoutDashboard className="h-5 w-5"/>} label="Dashboard" />
           <SidebarButton active={activeTab === "documents"} onClick={() => setActiveTab("documents")} icon={<FileText className="h-5 w-5"/>} label="Dokumen" />
           <SidebarButton active={activeTab === "controls"} onClick={() => setActiveTab("controls")} icon={<Settings className="h-5 w-5"/>} label="Pengaturan" />
        </div>
        <div className="p-4 border-t border-slate-700 space-y-2">
           <Button variant="secondary" className="w-full justify-start gap-2 bg-slate-800 text-slate-200 border-none" onClick={onPreviewKiosk}>
              <MonitorPlay className="h-4 w-4" /> Preview Kiosk
           </Button>
           <Button variant="destructive" className="w-full justify-start gap-2" onClick={onLogout}>
              <LogOut className="h-4 w-4" /> Logout
           </Button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 shrink-0 z-10">
           <h1 className="text-xl font-bold text-slate-800 capitalize">{activeTab === "analytics" ? "Dashboard" : activeTab === "documents" ? "Manajemen Dokumen" : "Pengaturan Sistem"}</h1>
           <div className="flex items-center gap-4">
              <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border select-none transition-colors", networkError ? "bg-red-50 border-red-200 text-red-600" : "bg-emerald-50 border-emerald-200 text-emerald-600")}>
                  {networkError ? <WifiOff className="h-4 w-4" /> : <Wifi className="h-4 w-4" />}
                  <span>{networkError ? "SYSTEM OFFLINE" : "SYSTEM ONLINE"}</span>
              </div>
              <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">A</div>
           </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
           {/* === DASHBOARD === */}
           {activeTab === "analytics" && (
              <div className="space-y-6 animate-in fade-in">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatsCard title="Total Dokumen" value={dashboardStats.docCount} icon={<FileText className="text-blue-500"/>} trend="Database File" />
                    <StatsCard title="Total Interaksi" value={dashboardStats.totalViews} icon={<MousePointerClick className="text-purple-500"/>} trend="Views + DL" />
                    <StatsCard title="Kategori" value={dashboardStats.catCount} icon={<Settings className="text-orange-500"/>} trend="Grup Menu" />
                    <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-[#0F4C81] to-blue-900 text-white">
                        <CardContent className="p-4 flex flex-col justify-between h-full">
                           <div><p className="text-xs font-bold uppercase opacity-70 mb-1">Terpopuler</p><h3 className="text-sm font-semibold line-clamp-2" title={dashboardStats.mostPopularName}>{dashboardStats.mostPopularName}</h3></div>
                           <div className="flex items-center gap-2 mt-2"><Star className="h-4 w-4 text-yellow-400 fill-yellow-400"/><span className="text-xl font-bold">{dashboardStats.mostPopularCount} Views</span></div>
                        </CardContent>
                    </Card>
                 </div>
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2 border-slate-200 shadow-sm">
                        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><TrendingUp className="h-4 w-4 text-green-500" /> 5 Dokumen Teratas</CardTitle></CardHeader>
                        <CardContent>
                            <table className="w-full text-sm text-left"><thead className="bg-slate-50 text-slate-500 font-medium"><tr><th className="p-3 pl-4 rounded-l-md">Judul</th><th className="p-3">Kategori</th><th className="p-3 text-right rounded-r-md">Views</th></tr></thead>
                                <tbody className="divide-y">{dashboardStats.top5Docs.map((doc, idx) => (<tr key={doc.id}><td className="p-3 pl-4 font-medium flex gap-3"><span className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold ${idx===0?'bg-yellow-100 text-yellow-700':'bg-slate-100 text-slate-500'}`}>{idx+1}</span><span className="truncate max-w-[250px]">{doc.title}</span></td><td className="p-3 text-slate-500 text-xs">{doc.category?.name||"-"}</td><td className="p-3 text-right font-bold text-slate-700">{doc.viewCount}</td></tr>))}</tbody>
                            </table>
                        </CardContent>
                    </Card>
                    <Card className="border-slate-200 shadow-sm flex flex-col">
                        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Activity className="h-4 w-4 text-blue-500" /> Aktivitas Terakhir</CardTitle></CardHeader>
                        <CardContent className="flex-1 overflow-y-auto max-h-[300px] pr-2 space-y-4">
                           {dashboardStats.logs.length===0 ? (<p className="text-sm text-slate-400 text-center py-4">Belum ada aktivitas.</p>) : dashboardStats.logs.map(log => (<div key={log.id} className="flex gap-3 pb-3 border-b border-slate-50 last:border-0"><div><div className="h-2 w-2 rounded-full bg-blue-500"/><div className="w-[1px] h-full bg-slate-100 mt-1 mx-auto"/></div><div><p className="text-xs font-bold text-slate-700">{log.action}</p><p className="text-xs text-slate-500">{log.detail}</p><p className="text-[10px] text-slate-400 mt-1">{log.time}</p></div></div>))}
                        </CardContent>
                    </Card>
                 </div>
              </div>
           )}

           {/* === DOKUMEN === */}
           {activeTab === "documents" && (
              <div className="space-y-4 animate-in fade-in">
                 <div className="flex flex-col xl:flex-row gap-4 justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                    <div className="flex flex-col md:flex-row gap-3 flex-1">
                        <div className="relative w-full md:max-w-xs"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /><Input placeholder="Cari dokumen..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
                        
                        <Select value={filterCategory} onValueChange={setFilterCategory}>
                            <SelectTrigger className="w-[200px]"><SelectValue placeholder="Semua Kategori" /></SelectTrigger>
                            <SelectContent className="max-h-[300px] overflow-y-auto [&>span]:hidden" position="popper" sideOffset={5}>
                                <SelectItem value="all">Semua Kategori</SelectItem>
                                {Object.entries(groupedCategoriesFromDB).map(([groupName, items]) => {
                                    if (items.length === 0) return null
                                    return (
                                        <SelectGroup key={groupName}>
                                            <SelectLabel className="pl-2 py-1.5 text-xs font-bold text-slate-400 bg-slate-50 border-b border-slate-100 sticky top-0 z-10">{groupName}</SelectLabel>
                                            {items.map(cat => (
                                                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    )
                                })}
                            </SelectContent>
                        </Select>

                        <Select value={sortOrder} onValueChange={(val:any) => setSortOrder(val)}><SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="newest">Terbaru</SelectItem><SelectItem value="oldest">Terlama</SelectItem></SelectContent></Select>
                    </div>
                    <Button onClick={() => setIsUploadOpen(true)} className="bg-[#0F4C81] gap-2"><Upload className="h-4 w-4" /> Upload Dokumen</Button>
                 </div>
                 
                 <div className="flex items-center justify-between px-1">
                    <div className="text-sm text-slate-500 font-medium">
                        Menampilkan <span className="text-slate-900 font-bold">{filteredDocs.length}</span> dokumen
                        {(searchQuery || filterCategory !== "all") && (
                            <span className="font-normal ml-1">dari total {documents.length}</span>
                        )}
                    </div>
                 </div>

                 <Card className="border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b"><tr><th className="p-4">Nama Dokumen</th><th className="p-4">Kategori</th><th className="p-4">Tanggal</th><th className="p-4">Size</th><th className="p-4 text-right">Aksi</th></tr></thead>
                        <tbody className="divide-y">{filteredDocs.map(doc => (
                            <tr key={doc.id} className="hover:bg-slate-50 bg-white">
                                <td className="p-4 font-medium flex items-center gap-3">
                                    <div className="h-8 w-8 rounded bg-red-50 text-red-500 flex items-center justify-center border border-red-100 shrink-0"><FileText className="h-4 w-4"/></div>
                                    <div className="flex flex-col max-w-[200px]">
                                        <span className="truncate font-medium" title={doc.title}>{doc.title}</span>
                                        {/* INDIKATOR LINK GDRIVE */}
                                        {doc.downloadUrl && (
                                            <span className="flex items-center gap-1 text-[10px] text-blue-600 font-medium">
                                                <LinkIcon className="h-3 w-3" /> GDrive Linked
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="p-4"><Badge variant="outline" className="font-normal bg-slate-50">{doc.category?.name||"-"}</Badge></td>
                                <td className="p-4 text-slate-500">{new Date(doc.createdAt).toLocaleDateString('id-ID')}</td>
                                <td className="p-4 text-slate-500 text-sm">{formatSize(doc.fileSize)}</td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-1">
                                        <Button variant="ghost" size="icon" onClick={() => openEditModal(doc)} className="text-blue-500 hover:bg-blue-50">
                                            <Edit className="h-4 w-4"/>
                                        </Button>
                                        
                                        {/* ✅ KLIK TOMBOL INI MEMBUKA ALERT DIALOG */}
                                        <Button variant="ghost" size="icon" onClick={() => confirmDelete(doc.id)} className="text-slate-400 hover:bg-red-50 hover:text-red-600">
                                            <Trash2 className="h-4 w-4"/>
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}</tbody>
                    </table>
                 </Card>
              </div>
           )}

           {activeTab === "controls" && (
                <div className="space-y-6 animate-in fade-in">
                    <Card className="border-slate-200 shadow-sm"><CardHeader><CardTitle className="flex items-center gap-2"><Server className="h-5 w-5 text-blue-500"/> System Health</CardTitle></CardHeader><CardContent><div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100"><div><p className="font-bold text-slate-700">Database Connection</p><p className="text-xs text-slate-500">Koneksi ke server pusat.</p></div><Badge className={networkError ? "bg-red-100 text-red-700 hover:bg-red-100" : "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"}>{networkError ? "Disconnected" : "Connected"}</Badge></div></CardContent></Card>
                </div>
           )}
        </main>
        
        {/* --- MODAL UPLOAD --- */}
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSaveUpload}>
                    <DialogHeader><DialogTitle>Upload Dokumen</DialogTitle></DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2"><Label>Judul</Label><Input name="title" required /></div>
                        <div className="grid gap-2"><Label>Kategori</Label>
                            <Select name="category" required>
                                <SelectTrigger><SelectValue placeholder="Pilih Kategori" /></SelectTrigger>
                                <SelectContent className="max-h-[300px] overflow-y-auto [&>span]:hidden" position="popper" sideOffset={5}>
                                    {Object.entries(groupedCategoriesFromDB).map(([groupName, items]) => {
                                        if (items.length === 0) return null
                                        return (
                                            <SelectGroup key={groupName}>
                                                <SelectLabel className="pl-2 py-1.5 text-xs font-bold text-slate-400 bg-slate-50 border-b border-slate-100 sticky top-0 z-10">{groupName}</SelectLabel>
                                                {items.map(cat => (<SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>))}
                                            </SelectGroup>
                                        )
                                    })}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="my-2 border-t border-slate-100" />
                        <div className="grid gap-2">
                             <Label className="flex items-center justify-between">File PDF (Wajib) <span className="text-[10px] text-slate-400 font-normal">Tampil di Layar Kiosk</span></Label>
                             <Input type="file" name="file" accept=".pdf" required />
                        </div>
                        <div className="grid gap-2">
                             <Label className="flex items-center justify-between">Link GDrive (Opsional) <span className="text-[10px] text-blue-500 font-normal">Untuk QR Code Download</span></Label>
                             <div className="relative">
                                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input name="downloadUrl" placeholder="https://drive.google.com/..." className="pl-9" />
                             </div>
                        </div>
                    </div>
                    <DialogFooter><Button type="submit" disabled={isSubmitting}>Simpan</Button></DialogFooter>
                </form>
            </DialogContent>
        </Dialog>

        {/* --- MODAL EDIT --- */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSaveEdit}>
                    <DialogHeader><DialogTitle>Edit Dokumen</DialogTitle></DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2"><Label>Judul</Label><Input name="title" defaultValue={selectedDoc?.title} required /></div>
                        <div className="grid gap-2"><Label>Kategori</Label>
                            <Select name="category" key={selectedDoc?.id} defaultValue={selectedDoc?.categoryId}>
                                <SelectTrigger><SelectValue placeholder="Pilih Kategori" /></SelectTrigger>
                                <SelectContent className="max-h-[300px] overflow-y-auto [&>span]:hidden" position="popper" sideOffset={5}>
                                    {Object.entries(groupedCategoriesFromDB).map(([groupName, items]) => {
                                        if (items.length === 0) return null
                                        return (
                                            <SelectGroup key={groupName}>
                                                <SelectLabel className="pl-2 py-1.5 text-xs font-bold text-slate-400 bg-slate-50 border-b border-slate-100 sticky top-0 z-10">{groupName}</SelectLabel>
                                                {items.map(cat => (<SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>))}
                                            </SelectGroup>
                                        )
                                    })}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                             <Label>Link Google Drive</Label>
                             <div className="relative">
                                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input name="downloadUrl" defaultValue={selectedDoc?.downloadUrl} placeholder="https://drive.google.com/..." className="pl-9" />
                             </div>
                        </div>
                    </div>
                    <DialogFooter><Button type="submit" disabled={isSubmitting}>Simpan</Button></DialogFooter>
                </form>
            </DialogContent>
        </Dialog>

        {/* ✅ MODAL ALERT DELETE (BARU) */}
        <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="h-5 w-5" />
                        Hapus Dokumen?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Tindakan ini tidak dapat dibatalkan. Dokumen ini akan dihapus secara permanen dari server dan database Kiosk.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction 
                        onClick={executeDelete}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        Ya, Hapus Permanen
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

      </div>
    </div>
  )
}

function SidebarButton({ active, onClick, icon, label }: any) { return <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${active ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}>{icon}{label}</button> }
function StatsCard({ title, value, icon, trend }: any) { return <Card className="shadow-sm border-slate-200"><CardContent className="p-4 flex items-center gap-4"><div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center border text-lg">{icon}</div><div><p className="text-xs text-slate-400 uppercase font-bold">{title}</p><h3 className="text-xl font-bold">{value}</h3><p className="text-[10px] text-slate-400">{trend}</p></div></CardContent></Card> }