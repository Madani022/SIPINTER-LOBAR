"use client"

import { useState, useMemo, useEffect } from "react"
import { 
  LayoutDashboard, FileText, Settings, 
  Upload, Trash2, Edit, Wifi, WifiOff,
  Search, MonitorPlay, LogOut, 
  MousePointerClick, Star, Filter, 
  TrendingUp, Activity, Server, ArrowUpDown
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  SelectGroup, SelectLabel
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

// Import Server Actions
import { getDocuments, createDocument, updateDocument, deleteDocument } from "@/actions/documents"
// HAPUS import createCategory/deleteCategory karena kita pakai sistem FIX
import { getCategories } from "@/actions/categories" 

// --- DEFINISI KATEGORI FIX (HARDCODED UNTUK UI) ---
// Ini untuk memastikan urutan dan grouping di dropdown Admin rapi
// Pastikan ID atau Nama di database SAMA dengan yang ada di sini nanti.
const CATEGORY_GROUPS = {
  "PERIZINAN": [
    "Standar Pelayanan (SP)",
    "SOP Perizinan",
    "Formulir Permohonan",
    "Pedoman Teknis",
    "Daftar Retribusi"
  ],
  "PENANAMAN MODAL": [
    "Peta Potensi Investasi (IPRO)",
    "Kajian Investasi",
    "Laporan LKPM",
    "Insentif Daerah"
  ],
  "TATA RUANG": [
    "Peta RTRW",
    "Peta RDTR",
    "Peraturan Zonasi",
    "Informasi KRK"
  ],
  "INFORMASI PUBLIK (MPP)": [
    "Profil Pejabat",
    "Visi Misi",
    "Maklumat Pelayanan",
    "Struktur Organisasi",
    "Video Profil"
  ]
}

// --- TIPE DATA ---
type Category = { id: string; name: string; slug: string }
type Document = {
  id: string; title: string; slug: string; categoryId: string; category?: Category;
  filePath: string; fileSize: number; downloadCount: number; viewCount: number;
  isActive: boolean; isFeatured: boolean; createdAt: Date
}
type Log = { id: number; action: string; detail: string; time: string }

interface AdminScreenProps {
  onLogout?: () => void;
  onPreviewKiosk?: () => void;
}

export function AdminScreen({ onLogout, onPreviewKiosk }: AdminScreenProps) {
  // STATE TAB (Hanya 3: Dashboard, Dokumen, Settings)
  const [activeTab, setActiveTab] = useState<"analytics" | "documents" | "controls">("analytics")
  
  // DATA STATES
  const [documents, setDocuments] = useState<Document[]>([])
  const [categories, setCategories] = useState<Category[]>([]) // Data kategori dari DB
  const [logs, setLogs] = useState<Log[]>([])
  
  // SYSTEM STATUS
  const [networkError, setNetworkError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // FILTERS
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")

  // MODAL STATES
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null)

  // --- FETCH DATA ---
  const fetchData = async () => {
    try {
      const catRes = await getCategories(true)
      if (catRes.success && catRes.data) {
          setCategories(catRes.data)
          setNetworkError(false)
      }
      const docRes = await getDocuments({ limit: 500 }) 
      if (docRes.success && docRes.data) {
          setDocuments(docRes.data as Document[])
      }
    } catch (error) {
      console.error("Connection Error:", error)
      setNetworkError(true)
      addLog("System Error", "Koneksi terputus")
    }
  }

  // Auto-check status setiap 15 detik
  useEffect(() => { 
    fetchData() 
    const interval = setInterval(fetchData, 15000) 
    return () => clearInterval(interval)
  }, [])

  // --- LOGIC MAPPING KATEGORI DB KE GROUP UI ---
  // Fungsi ini mencocokkan Kategori dari DB dengan Grup yang kita definisikan di atas
  const groupedCategoriesFromDB = useMemo(() => {
    const groups: Record<string, Category[]> = {
      "PERIZINAN": [], "PENANAMAN MODAL": [], "TATA RUANG": [], "INFORMASI PUBLIK (MPP)": [], "LAINNYA": []
    }

    categories.forEach((cat) => {
      // Cek masuk ke grup mana berdasarkan nama
      let found = false
      for (const [groupName, catNames] of Object.entries(CATEGORY_GROUPS)) {
        // Logika pencocokan sederhana (bisa diperketat jika perlu)
        if (catNames.some(name => cat.name.includes(name) || name.includes(cat.name))) {
           groups[groupName].push(cat)
           found = true
           break
        }
      }
      if (!found) groups["LAINNYA"].push(cat)
    })
    return groups
  }, [categories])

  // --- FILTER DOCS ---
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

  // --- STATS ---
  const stats = useMemo(() => {
    const totalViews = documents.reduce((acc, doc) => acc + (doc.viewCount || 0), 0)
    const mostPopularDoc = [...documents].sort((a, b) => b.viewCount - a.viewCount)[0]
    const top5Docs = [...documents].sort((a, b) => b.viewCount - a.viewCount).slice(0, 5)
    return {
       docCount: documents.length,
       catCount: categories.length,
       totalViews,
       mostPopularName: mostPopularDoc ? mostPopularDoc.title : "-",
       mostPopularCount: mostPopularDoc ? mostPopularDoc.viewCount : 0,
       top5Docs
    }
  }, [documents, categories])

  const addLog = (action: string, detail: string) => {
    const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    setLogs(prev => [{ id: Date.now(), action, detail, time }, ...prev])
  }

  // --- HANDLERS ---
  const handleDeleteDoc = async (id: string) => {
    if(!confirm("Hapus dokumen ini?")) return
    const res = await deleteDocument(id)
    if (res.success) {
        setDocuments(prev => prev.filter(d => d.id !== id))
        addLog("Hapus Dokumen", "Dokumen berhasil dihapus")
        fetchData()
    } else alert(res.error)
  }

  const handleSaveUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const form = e.target as HTMLFormElement
    const title = (form.elements.namedItem('title') as HTMLInputElement).value
    const categoryId = (form.elements.namedItem('category') as HTMLInputElement).value
    const fileInput = form.elements.namedItem('file') as HTMLInputElement

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
            title, categoryId,
            filePath: uploadData.data.filePath,
            fileSize: uploadData.data.fileSize,
            isActive: true, isFeatured: false
        })

        if (res.success && res.data) {
            setDocuments([res.data as Document, ...documents])
            addLog("Upload", `Dokumen ${title} ditambahkan`)
            setIsUploadOpen(false)
            form.reset()
            fetchData()
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
      try {
          const res = await updateDocument(selectedDoc.id, { title, categoryId })
          if (res.success && res.data) {
              setDocuments(prev => prev.map(d => d.id === selectedDoc.id ? (res.data as Document) : d))
              addLog("Edit", `Dokumen ${title} diperbarui`)
              setIsEditOpen(false); setSelectedDoc(null)
              fetchData()
          } else alert(res.error)
      } catch(err) { alert("Gagal update dokumen") }
      finally { setIsSubmitting(false) }
  }

  const openEditModal = (doc: Document) => { setSelectedDoc(doc); setIsEditOpen(true) }
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B'; const sizes = ['B', 'KB', 'MB']; const i = Math.floor(Math.log(bytes) / Math.log(1024)); return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
  }

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
        
        {/* HEADER */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 shrink-0 z-10">
           <h1 className="text-xl font-bold text-slate-800 capitalize">{activeTab === "analytics" ? "Dashboard" : activeTab === "documents" ? "Manajemen Dokumen" : "Pengaturan Sistem"}</h1>
           
           <div className="flex items-center gap-4">
              {/* STATUS BINARY (HIJAU/MERAH) */}
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
                    <StatsCard title="Total Dokumen" value={stats.docCount} icon={<FileText className="text-blue-500"/>} trend="Database File" />
                    <StatsCard title="Total Interaksi" value={stats.totalViews} icon={<MousePointerClick className="text-purple-500"/>} trend="Views + DL" />
                    <StatsCard title="Kategori" value={stats.catCount} icon={<Settings className="text-orange-500"/>} trend="Grup Menu" />
                    <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-[#0F4C81] to-blue-900 text-white">
                        <CardContent className="p-4 flex flex-col justify-between h-full">
                           <div><p className="text-xs font-bold uppercase opacity-70 mb-1">Terpopuler</p><h3 className="text-sm font-semibold line-clamp-2" title={stats.mostPopularName}>{stats.mostPopularName}</h3></div>
                           <div className="flex items-center gap-2 mt-2"><Star className="h-4 w-4 text-yellow-400 fill-yellow-400"/><span className="text-xl font-bold">{stats.mostPopularCount} Views</span></div>
                        </CardContent>
                    </Card>
                 </div>
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2 border-slate-200 shadow-sm">
                        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><TrendingUp className="h-4 w-4 text-green-500" /> 5 Dokumen Teratas</CardTitle></CardHeader>
                        <CardContent><table className="w-full text-sm text-left"><thead className="bg-slate-50 text-slate-500 font-medium"><tr><th className="p-3 pl-4 rounded-l-md">Judul</th><th className="p-3">Kategori</th><th className="p-3 text-right rounded-r-md">Views</th></tr></thead><tbody className="divide-y">{stats.top5Docs.map((doc, idx) => (<tr key={doc.id}><td className="p-3 pl-4 font-medium flex gap-3"><span className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold ${idx===0?'bg-yellow-100 text-yellow-700':'bg-slate-100 text-slate-500'}`}>{idx+1}</span><span className="truncate max-w-[250px]">{doc.title}</span></td><td className="p-3 text-slate-500 text-xs">{doc.category?.name||"-"}</td><td className="p-3 text-right font-bold text-slate-700">{doc.viewCount}</td></tr>))}</tbody></table></CardContent>
                    </Card>
                    <Card className="border-slate-200 shadow-sm flex flex-col">
                        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Activity className="h-4 w-4 text-blue-500" /> Log Aktivitas</CardTitle></CardHeader>
                        <CardContent className="flex-1 overflow-y-auto max-h-[300px] pr-2 space-y-4">
                           {logs.length===0?<p className="text-sm text-slate-400 text-center py-4">Kosong.</p>:logs.map(log=>(<div key={log.id} className="flex gap-3 pb-3 border-b border-slate-50 last:border-0"><div><div className="h-2 w-2 rounded-full bg-blue-500"/><div className="w-[1px] h-full bg-slate-100 mt-1 mx-auto"/></div><div><p className="text-xs font-bold text-slate-700">{log.action}</p><p className="text-xs text-slate-500">{log.detail}</p><p className="text-[10px] text-slate-400 mt-1">{log.time}</p></div></div>))}
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
                        <Select value={filterCategory} onValueChange={setFilterCategory}><SelectTrigger className="w-[200px]"><SelectValue placeholder="Semua Kategori" /></SelectTrigger><SelectContent className="max-h-[300px]"><SelectItem value="all">Semua Kategori</SelectItem>{categories.map(cat => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}</SelectContent></Select>
                        <Select value={sortOrder} onValueChange={(val:any) => setSortOrder(val)}><SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="newest">Terbaru</SelectItem><SelectItem value="oldest">Terlama</SelectItem></SelectContent></Select>
                    </div>
                    <Button onClick={() => setIsUploadOpen(true)} className="bg-[#0F4C81] gap-2"><Upload className="h-4 w-4" /> Upload Dokumen</Button>
                 </div>
                 <Card className="border-slate-200 shadow-sm overflow-hidden"><table className="w-full text-sm text-left"><thead className="bg-slate-50 text-slate-500 font-medium border-b"><tr><th className="p-4">Nama Dokumen</th><th className="p-4">Kategori</th><th className="p-4">Tanggal</th><th className="p-4">Size</th><th className="p-4 text-right">Aksi</th></tr></thead><tbody className="divide-y">{filteredDocs.length===0?(<tr><td colSpan={5} className="p-8 text-center text-slate-400">Tidak ada dokumen.</td></tr>):filteredDocs.map(doc => (<tr key={doc.id} className="hover:bg-slate-50 bg-white"><td className="p-4 font-medium flex items-center gap-3"><div className="h-8 w-8 rounded bg-red-50 text-red-500 flex items-center justify-center border border-red-100 shrink-0"><FileText className="h-4 w-4"/></div><div className="truncate max-w-[200px]" title={doc.title}>{doc.title}</div></td><td className="p-4"><Badge variant="outline" className="font-normal bg-slate-50">{doc.category?.name||"-"}</Badge></td><td className="p-4 text-slate-500">{new Date(doc.createdAt).toLocaleDateString('id-ID')}</td><td className="p-4 text-slate-500 font-mono text-xs">{formatSize(doc.fileSize)}</td><td className="p-4 text-right"><div className="flex justify-end gap-1"><Button variant="ghost" size="icon" onClick={() => openEditModal(doc)} className="text-blue-500 hover:bg-blue-50"><Edit className="h-4 w-4"/></Button><Button variant="ghost" size="icon" onClick={() => handleDeleteDoc(doc.id)} className="text-slate-400 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4"/></Button></div></td></tr>))}</tbody></table></Card>
              </div>
           )}

           {activeTab === "controls" && (
                <div className="space-y-6 animate-in fade-in">
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader><CardTitle className="flex items-center gap-2"><Server className="h-5 w-5 text-blue-500"/> System Health</CardTitle></CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                                <div><p className="font-bold text-slate-700">Database Connection</p><p className="text-xs text-slate-500">Koneksi ke server pusat.</p></div>
                                <Badge className={networkError ? "bg-red-100 text-red-700 hover:bg-red-100" : "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"}>{networkError ? "Disconnected" : "Connected"}</Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>
           )}
        </main>
        
        {/* MODAL UPLOAD */}
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSaveUpload}>
                    <DialogHeader><DialogTitle>Upload Dokumen</DialogTitle></DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2"><Label>Judul</Label><Input name="title" required /></div>
                        <div className="grid gap-2"><Label>Kategori</Label>
                            <Select name="category" required>
                                <SelectTrigger><SelectValue placeholder="Pilih Kategori" /></SelectTrigger>
                                <SelectContent className="max-h-[300px]">
                                    {Object.entries(groupedCategoriesFromDB).map(([groupName, items]) => items.length > 0 && (
                                        <SelectGroup key={groupName}>
                                            <SelectLabel className="pl-2 py-1.5 text-xs font-bold text-slate-400 bg-slate-50 border-b border-slate-100 sticky top-0 z-10">{groupName}</SelectLabel>
                                            {items.map(cat => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}
                                        </SelectGroup>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2"><Label>File PDF</Label><Input type="file" name="file" accept=".pdf" required /></div>
                    </div>
                    <DialogFooter><Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Uploading..." : "Simpan"}</Button></DialogFooter>
                </form>
            </DialogContent>
        </Dialog>

        {/* MODAL EDIT */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSaveEdit}>
                    <DialogHeader><DialogTitle>Edit Dokumen</DialogTitle></DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2"><Label>Judul</Label><Input name="title" defaultValue={selectedDoc?.title} required /></div>
                        <div className="grid gap-2"><Label>Kategori</Label>
                            <Select name="category" defaultValue={selectedDoc?.categoryId}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent className="max-h-[300px]">
                                    {Object.entries(groupedCategoriesFromDB).map(([groupName, items]) => items.length > 0 && (
                                        <SelectGroup key={groupName}>
                                            <SelectLabel className="pl-2 py-1.5 text-xs font-bold text-slate-400 bg-slate-50 border-b border-slate-100 sticky top-0 z-10">{groupName}</SelectLabel>
                                            {items.map(cat => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}
                                        </SelectGroup>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter><Button type="submit" disabled={isSubmitting}>Simpan</Button></DialogFooter>
                </form>
            </DialogContent>
        </Dialog>

      </div>
    </div>
  )
}

function SidebarButton({ active, onClick, icon, label }: any) { return <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${active ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}>{icon}{label}</button> }
function StatsCard({ title, value, icon, trend }: any) { return <Card className="shadow-sm border-slate-200"><CardContent className="p-4 flex items-center gap-4"><div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center border text-lg">{icon}</div><div><p className="text-xs text-slate-400 uppercase font-bold">{title}</p><h3 className="text-xl font-bold">{value}</h3><p className="text-[10px] text-slate-400">{trend}</p></div></CardContent></Card> }