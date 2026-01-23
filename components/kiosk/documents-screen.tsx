"use client"

import { useState } from "react"
import { useKiosk, type DocumentItem } from "./kiosk-provider"
import { getDocuments } from "@/lib/kiosk-data" // KEMBALI MENGGUNAKAN INI
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { NavigationBar } from "./navigation-bar"
import { FileText, ChevronLeft, ChevronRight } from "lucide-react"

interface DocumentsScreenProps {
  categoryId: string
  categoryTitle: string
}

const ITEMS_PER_PAGE = 8

export function DocumentsScreen({ categoryId, categoryTitle }: DocumentsScreenProps) {
  const { navigateTo, trackDocument } = useKiosk()
  const [currentPage, setCurrentPage] = useState(0)

  // 1. KEMBALIKAN SUMBER DATA ASLI (Agar dokumen muncul lagi)
  const allDocuments = getDocuments(categoryId)

  // 2. LOGIC PAGINATION (Langsung dari allDocuments, tanpa filter kategori lagi)
  const totalPages = Math.ceil(allDocuments.length / ITEMS_PER_PAGE)
  const documents = allDocuments.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  )

  const handleDocumentClick = (doc: DocumentItem) => {
    trackDocument(doc.id, doc.title)
    navigateTo({ type: "pdf-viewer", document: doc })
  }

  // Logic Grid Asli Anda
  const getGridClass = () => {
    const count = documents.length
    if (count <= 4) return "grid-cols-2 grid-rows-2"
    if (count <= 6) return "grid-cols-3 grid-rows-2"
    return "grid-cols-4 grid-rows-2"
  }

  // --- RENDER ---

  if (allDocuments.length === 0) {
    return (
      <div className="flex h-full flex-col">
        <NavigationBar title={categoryTitle} showBack />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <FileText className="mx-auto h-16 w-16 text-muted-foreground/50 lg:h-20 lg:w-20" />
            <p className="mt-4 text-lg font-medium text-muted-foreground lg:text-2xl">
              Belum ada dokumen tersedia
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <NavigationBar title={categoryTitle} showBack />

      {/* --- FILTER DIHAPUS DISINI --- */}

      {/* Documents Grid */}
      <main className="flex-1 bg-background p-3 lg:p-6">
          <div className={`grid h-full gap-3 lg:gap-5 ${getGridClass()}`}>
            {documents.map((doc) => (
              <Card
                key={doc.id}
                onClick={() => handleDocumentClick(doc)}
                className="group flex cursor-pointer flex-col items-center justify-center gap-2 p-3 shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] bg-card text-card-foreground hover:bg-primary hover:text-primary-foreground lg:gap-3 lg:p-6"
              >
                <div className="rounded-lg bg-primary/10 p-3 transition-colors group-hover:bg-card/20 lg:rounded-xl lg:p-4">
                  <FileText className="h-6 w-6 lg:h-10 lg:w-10" />
                </div>
                <div className="text-center">
                  <h3 className="line-clamp-2 text-sm font-bold leading-tight lg:text-lg">{doc.title}</h3>
                  <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground group-hover:text-primary-foreground/80 lg:mt-1 lg:text-sm">
                    {doc.description}
                  </p>
                  
                  {/* Tag kategori tetap ada sebagai info, tapi bukan filter */}
                  {doc.category && (
                    <span className="mt-1.5 inline-block rounded-full bg-muted/50 px-2 py-0.5 text-xs font-medium uppercase group-hover:bg-card/20 lg:mt-2 lg:px-3 lg:py-1">
                      {doc.category}
                    </span>
                  )}
                </div>
              </Card>
            ))}
          </div>
      </main>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <footer className="border-t border-border bg-card px-4 py-3 lg:px-8 lg:py-4">
          <div className="flex items-center justify-center gap-4 lg:gap-6">
            <Button
              size="lg"
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="h-10 px-4 text-sm font-semibold lg:h-14 lg:px-8 lg:text-lg"
            >
              <ChevronLeft className="mr-1 h-4 w-4 lg:mr-2 lg:h-6 lg:w-6" />
              Sebelumnya
            </Button>
            <div className="flex items-center gap-2 lg:gap-3">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`h-3 w-3 rounded-full transition-all lg:h-4 lg:w-4 ${
                    i === currentPage
                      ? "scale-125 bg-primary"
                      : "bg-muted hover:bg-muted-foreground/50"
                  }`}
                />
              ))}
            </div>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage === totalPages - 1}
              className="h-10 px-4 text-sm font-semibold lg:h-14 lg:px-8 lg:text-lg"
            >
              Selanjutnya
              <ChevronRight className="ml-1 h-4 w-4 lg:ml-2 lg:h-6 lg:w-6" />
            </Button>
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground lg:mt-3 lg:text-sm">
            Halaman {currentPage + 1} dari {totalPages} ({allDocuments.length} dokumen)
          </p>
        </footer>
      )}
    </div>
  )
}