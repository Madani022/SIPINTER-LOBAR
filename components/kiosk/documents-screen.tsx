"use client"

import { useState, useEffect } from "react"
import { useKiosk } from "./kiosk-provider"
import { getDocuments } from "@/actions/documents" // SERVER ACTION
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { NavigationBar } from "./navigation-bar"
import { FileText, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"

interface DocumentsScreenProps {
  categorySlug?: string 
  categoryTitle: string
}

const ITEMS_PER_PAGE = 8

export function DocumentsScreen({ categorySlug, categoryTitle }: DocumentsScreenProps) {
  const { navigateTo, trackDocument } = useKiosk()
  
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)

  // FETCH DATA DARI DB
  useEffect(() => {
    async function fetchData() {
      if (!categorySlug) { setLoading(false); return }
      
      setLoading(true)
      try {
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

  // Pagination Logic
  const totalPages = Math.ceil(documents.length / ITEMS_PER_PAGE)
  const paginatedDocs = documents.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  )

  const handleDocumentClick = (doc: any) => {
    trackDocument(doc.id, doc.title)
    navigateTo({ 
        type: "pdf-viewer", 
        document: {
            id: doc.id,
            title: doc.title,
            description: doc.description,
            url: doc.filePath, // Path dari DB (/uploads/documents/...)
            type: "pdf"
        } 
    })
  }

  // RENDER UI (SAMA PERSIS DENGAN SEBELUMNYA)
  if (loading) return (
     <div className="flex h-full flex-col">
        <NavigationBar title={categoryTitle} showBack />
        <div className="flex-1 flex items-center justify-center"><Loader2 className="animate-spin h-10 w-10 text-primary"/></div>
     </div>
  )

  return (
    <div className="flex h-full flex-col">
      <NavigationBar title={categoryTitle} showBack />

      <main className="flex-1 bg-background p-3 lg:p-6">
          {documents.length === 0 ? (
            <div className="flex h-full items-center justify-center flex-col text-muted-foreground">
                <FileText className="h-16 w-16 mb-4 opacity-30"/>
                <p>Belum ada dokumen yang diupload Admin</p>
                <p className="text-xs mt-2">Kategori: {categorySlug}</p>
            </div>
          ) : (
            <div className="grid h-full grid-cols-2 lg:grid-cols-4 grid-rows-2 gap-3 lg:gap-5 content-start">
                {paginatedDocs.map((doc) => (
                <Card
                    key={doc.id}
                    onClick={() => handleDocumentClick(doc)}
                    className="group flex cursor-pointer flex-col items-center justify-center gap-2 p-3 shadow-md hover:scale-[1.02] bg-card hover:bg-primary hover:text-primary-foreground transition-all"
                >
                    <div className="rounded-lg bg-primary/10 p-3 group-hover:bg-card/20">
                    <FileText className="h-6 w-6 lg:h-10 lg:w-10" />
                    </div>
                    <div className="text-center w-full">
                    <h3 className="line-clamp-2 text-sm font-bold leading-tight lg:text-lg">{doc.title}</h3>
                    <p className="mt-1 line-clamp-1 text-xs opacity-70">
                        {doc.fileSize ? `${(doc.fileSize/1024/1024).toFixed(1)} MB` : 'PDF'}
                    </p>
                    </div>
                </Card>
                ))}
            </div>
          )}
      </main>

      {totalPages > 1 && (
        <footer className="border-t border-border bg-card px-4 py-3 lg:px-8 lg:py-4">
          <div className="flex items-center justify-center gap-4">
            <Button variant="outline" onClick={() => setCurrentPage((p) => Math.max(0, p - 1))} disabled={currentPage === 0}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Sebelumnya
            </Button>
            <span className="text-sm">Hal {currentPage + 1} / {totalPages}</span>
            <Button variant="outline" onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))} disabled={currentPage === totalPages - 1}>
              Selanjutnya <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </footer>
      )}
    </div>
  )
}