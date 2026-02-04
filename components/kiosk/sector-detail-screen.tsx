"use client"

import { useState } from "react"
import { useKiosk, type DocumentItem } from "./kiosk-provider"
import { getDocuments, getSectorById } from "@/lib/kiosk-data"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { NavigationBar } from "./navigation-bar"
import { FileText, ChevronLeft, ChevronRight } from "lucide-react"

interface SectorDetailScreenProps {
  sectorId: string
  sectorTitle: string
}

const ITEMS_PER_PAGE = 6

export function SectorDetailScreen({ sectorId, sectorTitle }: SectorDetailScreenProps) {
  const { navigateTo, trackDocument } = useKiosk()
  const [currentPage, setCurrentPage] = useState(0)

  // Although we don't display the sector description anymore, we might still need the ID for fetching documents
  const sector = getSectorById(sectorId) 
  const allDocuments = getDocuments(sectorId)
  const totalPages = Math.ceil(allDocuments.length / ITEMS_PER_PAGE)
  const documents = allDocuments.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  )

  const handleDocumentClick = (doc: DocumentItem) => {
    trackDocument(doc.id, doc.title)
    navigateTo({ type: "pdf-viewer", document: doc })
  }

  return (
    <div className="flex h-screen w-full flex-col bg-slate-50">
      
      {/* Main Content Area 
          Added padding bottom (pb-24 lg:pb-32) to prevent content from being hidden behind the fixed bottom navbar
      */}
      <main className="flex-1 overflow-y-auto p-4 lg:p-8 pb-24 lg:pb-32">
        {allDocuments.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="rounded-full bg-slate-100 p-6 mb-4">
               <FileText className="h-12 w-12 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-700">Belum ada dokumen</h3>
            <p className="text-slate-400">Belum ada dokumen tersedia untuk sektor ini</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
            {documents.map((doc) => (
              <Card
                key={doc.id}
                onClick={() => handleDocumentClick(doc)}
                className="group flex cursor-pointer flex-col items-center justify-center p-6 text-center shadow-sm border border-slate-200 rounded-2xl hover:shadow-md hover:border-[#0F4C81] transition-all bg-white h-full"
              >
                <div className="mb-4 rounded-xl bg-blue-50 p-4 text-[#0F4C81] transition-colors group-hover:bg-[#0F4C81] group-hover:text-white">
                  <FileText className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold leading-tight text-slate-800 lg:text-lg line-clamp-2">
                    {doc.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-400 line-clamp-2">
                    {doc.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Pagination (Only shown if needed) */}
      {totalPages > 1 && (
        <div className="fixed bottom-20 left-0 w-full z-40 px-4 py-2 pointer-events-none">
           <div className="flex items-center justify-center gap-4 pointer-events-auto bg-white/80 backdrop-blur-sm p-2 rounded-2xl border border-slate-200 shadow-sm w-fit mx-auto">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="h-10 w-10 rounded-full hover:bg-slate-100"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            
            <span className="text-sm font-bold text-slate-600 min-w-[3rem] text-center">
              {currentPage + 1} / {totalPages}
            </span>

            <Button
              size="icon"
              variant="ghost"
              onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage === totalPages - 1}
              className="h-10 w-10 rounded-full hover:bg-slate-100"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </div>
      )}

      {/* Navigation Bar Fixed at Bottom */}
      <NavigationBar title={sectorTitle} showBack />
    </div>
  )
}