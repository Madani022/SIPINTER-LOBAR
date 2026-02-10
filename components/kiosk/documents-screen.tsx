"use client"

import { useState, useEffect } from "react"
import { useKiosk } from "./kiosk-provider"
import { getDocuments, incrementViewCount } from "@/actions/documents" 
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { NavigationBar } from "./navigation-bar"
import { cn } from "@/lib/utils"
import { FileText, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"

interface DocumentsScreenProps {
  categorySlug?: string 
  categoryTitle: string
}

export function DocumentsScreen({ categorySlug, categoryTitle }: DocumentsScreenProps) {
  const { navigateTo } = useKiosk()
  
  // ✅ 1. SETUP PAGINATION (Sama seperti SectorScreen)
  const ITEMS_PER_PAGE = 8 
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  // FETCH DATA
  useEffect(() => {
    async function fetchData() {
      if (!categorySlug) { setLoading(false); return }
      setLoading(true)
      try {
        // Ambil SEMUA data aktif (misal 10 dokumen)
        const res = await getDocuments({ categorySlug: categorySlug, isActive: true })
        if (res.success && res.data) {
          setDocuments(res.data)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [categorySlug])

  // LOGIKA SLICING HALAMAN
  const totalPages = Math.ceil(documents.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedDocs = documents.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handleNext = () => { if (currentPage < totalPages) setCurrentPage(prev => prev + 1) }
  const handlePrev = () => { if (currentPage > 1) setCurrentPage(prev => prev - 1) }

  const handleDocumentClick = async (doc: any) => {
    incrementViewCount(doc.id) 
    navigateTo({ 
        type: "pdf-viewer", 
        document: {
            id: doc.id,
            title: doc.title,
            description: doc.description,
            url: doc.filePath,
            downloadUrl: doc.downloadUrl,
            type: "pdf"
        } as any // ✅ TAMBAHKAN INI AGAR TYPESCRIPT DIAM
    })
  }

  if (loading) return (
     <div className="flex h-full flex-col bg-slate-50">
        <div className="flex-1 flex items-center justify-center"><Loader2 className="animate-spin h-10 w-10 text-[#0F4C81]"/></div>
        <NavigationBar title={categoryTitle} showBack />
     </div>
  )

  return (
    <div className="flex h-screen w-full flex-col bg-slate-50">
      
      {/* Container Utama (Contek SectorScreen) */}
      <div className="flex-1 overflow-hidden p-6 lg:p-8 pb-24 lg:pb-32 flex flex-col">
          
          {documents.length === 0 ? (
            <div className="flex h-full items-center justify-center flex-col text-slate-400">
                <FileText className="h-16 w-16 mb-4 opacity-30"/>
                <p>Belum ada dokumen yang diupload Admin</p>
            </div>
          ) : (
            <>
                {/* GRID CARD (Layout 4 Kolom x 2 Baris) */}
                <div className="grid flex-1 gap-4 lg:gap-5 grid-cols-2 lg:grid-cols-4 grid-rows-2 mb-2 content-start">
                    {paginatedDocs.map((doc) => (
                    <Card
                        key={doc.id}
                        onClick={() => handleDocumentClick(doc)}
                        className={cn(
                            "group relative flex cursor-pointer flex-col items-center justify-center text-center",
                            "p-4 lg:p-5",
                            "bg-white border border-slate-200 shadow-sm transition-all hover:translate-y-[-4px] hover:shadow-md hover:border-[#0F4C81]",
                            "h-full w-full rounded-2xl"
                        )}
                    >
                        <div className="mb-3 flex h-16 w-16 lg:h-20 lg:w-20 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 transition-colors group-hover:bg-[#0F4C81] group-hover:text-white">
                           <FileText className="h-8 w-8 lg:h-10 lg:w-10" />
                        </div>
                        <div className="w-full px-1">
                            <h3 className="text-sm font-bold leading-tight text-slate-800 lg:text-base line-clamp-2">{doc.title}</h3>
                            <p className="mt-2 text-xs text-slate-400 font-mono bg-slate-50 py-1 px-2 rounded-full inline-block">
                                {doc.fileSize ? `${(doc.fileSize/1024/1024).toFixed(1)} MB` : 'PDF'}
                            </p>
                        </div>
                    </Card>
                    ))}
                </div>

                {/* PAGINATION AREA (Contek SectorScreen) */}
                {totalPages > 1 && (
                    <div className="shrink-0 flex flex-col items-center justify-center gap-2 py-2 mb-4 lg:mb-6">
                        <div className="flex items-center gap-4">
                             <Button 
                                variant="outline" 
                                onClick={handlePrev} 
                                disabled={currentPage === 1} 
                                className="h-12 px-6 gap-2 rounded-xl border-2 text-base font-bold text-slate-700 hover:text-[#0F4C81] hover:border-[#0F4C81]"
                             >
                                <ChevronLeft className="h-5 w-5 stroke-[3]" /> Sebelumnya
                             </Button>

                             <div className="flex gap-2 mx-4">
                                {Array.from({ length: totalPages }).map((_, i) => (
                                  <div key={i} className={cn("h-3 w-3 rounded-full transition-colors", currentPage === i + 1 ? "bg-[#0F4C81]" : "bg-slate-300")} />
                                ))}
                             </div>

                             <Button 
                                variant="outline" 
                                onClick={handleNext} 
                                disabled={currentPage === totalPages} 
                                className="h-12 px-6 gap-2 rounded-xl border-2 text-base font-bold text-slate-700 hover:text-[#0F4C81] hover:border-[#0F4C81]"
                             >
                                Selanjutnya <ChevronRight className="h-5 w-5 stroke-[3]" />
                             </Button>
                        </div>
                        <div className="text-center text-slate-400 font-medium text-xs lg:text-sm">
                           Halaman {currentPage} dari {totalPages}
                        </div>
                    </div>
                )}
            </>
          )}
      </div>

      {/* Navbar Fixed di Bawah (Sesuai SectorScreen) */}
      <NavigationBar title={categoryTitle} showBack />
    </div>
  )
}