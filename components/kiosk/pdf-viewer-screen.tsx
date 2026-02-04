"use client"

import { useState, useEffect, useRef } from "react"
import { useKiosk } from "./kiosk-provider"
import { Button } from "@/components/ui/button"
import { Document, Page, pdfjs } from "react-pdf"
import { 
  ChevronLeft, ChevronRight, 
  Loader2, RefreshCw, 
  QrCode, Home, FileText, ArrowLeft
} from "lucide-react"

// --- SETUP WORKER ---
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface PDFViewerScreenProps {
  document: any
}

export function PDFViewerScreen({ document }: PDFViewerScreenProps) {
  const { navigateTo, goBack } = useKiosk()
  
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Base height container
  const [containerHeight, setContainerHeight] = useState(600)
  const containerRef = useRef<HTMLDivElement>(null)

  const fileUrl = document.url || document.pdfUrl

  useEffect(() => {
    function handleResize() {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.clientHeight - 20) 
      }
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
    setLoading(false)
  }

  function onDocumentLoadError(err: Error) {
    console.error("PDF Error:", err)
    setLoading(false)
    setError("Gagal memuat dokumen.")
  }

  const handleQrDownload = () => {
    navigateTo({
        type: "qr-page",
        title: "Download Dokumen",
        url: fileUrl,
        description: `Scan QR Code ini untuk mengunduh dokumen "${document.title}" ke HP Anda.`
    })
  }

  // --- TAMPILAN ERROR ---
  if (!fileUrl) {
      return (
        <div className="flex h-full flex-col items-center justify-center p-8 text-center bg-slate-50">
            <div className="rounded-full bg-red-100 p-6 mb-4">
                <RefreshCw className="h-12 w-12 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">Dokumen Tidak Ditemukan</h3>
            <Button size="lg" className="mt-8 text-lg" onClick={() => goBack()}>
                Kembali
            </Button>
        </div>
      )
  }

  return (
    <div className="flex h-screen flex-col bg-slate-50 overflow-hidden">
      
      {/* 1. HEADER */}
      <header className="bg-white px-8 py-5 border-b border-slate-200 shadow-sm z-10 shrink-0 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-[#0F4C81]">
             <FileText className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">MODE BACA</span>
            <h1 className="text-2xl font-bold text-slate-800 line-clamp-1 leading-tight">
                {document.title || "Tampilan Dokumen"}
            </h1>
          </div>
      </header>

      {/* 2. AREA PDF */}
      <div className="flex-1 relative overflow-hidden flex justify-center bg-slate-100/50 p-6" ref={containerRef}>
        
        {loading && (
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 z-20 backdrop-blur-sm">
                <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center">
                    <Loader2 className="h-10 w-10 animate-spin text-[#0F4C81] mb-3" />
                    <p className="text-lg font-bold text-slate-600">Memuat Dokumen...</p>
                </div>
             </div>
        )}

        {error ? (
            <div className="self-center text-center p-8 bg-white rounded-2xl shadow-lg border border-red-100">
                <p className="text-red-500 text-xl font-bold mb-2">Gagal Memuat</p>
                <p className="text-slate-400">{error}</p>
            </div>
        ) : (
            <div className="shadow-2xl border-[1px] border-slate-300/60 bg-white self-center rounded-2xl overflow-hidden">
                <Document
                    file={fileUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    loading={null}
                >
                    <Page 
                        pageNumber={pageNumber} 
                        height={containerHeight} 
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        className="bg-white"
                    />
                </Document>
            </div>
        )}
      </div>

      {/* 3. FOOTER NAVIGASI */}
      <div className="bg-white border-t border-slate-200 px-6 py-4 shrink-0 z-30 shadow-[0_-5px_30px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between gap-6">
            
            {/* --- ZONA KIRI: NAVIGASI UTAMA (Back & Home) --- */}
            <div className="flex items-center gap-3">
                {/* Tombol Kembali */}
                <Button 
                    className="h-14 px-6 rounded-xl bg-red-50 text-red-600 border border-red-100 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors font-bold gap-2"
                    onClick={() => goBack()} 
                >
                    <ArrowLeft className="h-5 w-5" />
                    <span>KEMBALI</span>
                </Button>

                {/* Tombol Home */}
                <Button 
                    className="h-14 px-6 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 hover:border-blue-200 font-bold gap-2"
                    onClick={() => navigateTo({ type: "home" })}
                >
                    <Home className="h-5 w-5" />
                    <span className="hidden xl:inline">BERANDA</span>
                </Button>
            </div>

            {/* --- ZONA TENGAH: NAVIGASI PDF --- */}
            <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-200 shadow-inner">
                <Button
                    size="lg"
                    className="h-12 px-6 rounded-xl bg-white text-slate-700 hover:bg-slate-200 hover:text-black border border-slate-200 shadow-sm font-semibold"
                    onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
                    disabled={pageNumber <= 1 || loading}
                >
                    <ChevronLeft className="h-6 w-6 mr-2" />
                    Sebelumnya
                </Button>

                <div className="flex flex-col items-center px-6 min-w-[100px]">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">HALAMAN</span>
                    <span className="text-2xl font-black text-slate-800 tabular-nums leading-none">
                        {loading ? "-" : pageNumber}<span className="text-lg text-slate-400 font-medium">/{numPages}</span>
                    </span>
                </div>

                <Button
                    size="lg"
                    className="h-12 px-6 rounded-xl bg-[#0F4C81] hover:bg-[#0b3d69] text-white shadow-md hover:shadow-lg transition-all font-semibold"
                    onClick={() => setPageNumber((prev) => Math.min(prev + 1, numPages))}
                    disabled={pageNumber >= numPages || loading}
                >
                    Selanjutnya
                    <ChevronRight className="h-6 w-6 ml-2" />
                </Button>
            </div>

            {/* --- ZONA KANAN: DOWNLOAD --- */}
            <div className="flex items-center">
                <Button 
                    variant="outline" 
                    className="h-14 px-6 border-2 border-emerald-100 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-200 rounded-xl font-bold gap-3 transition-colors"
                    onClick={handleQrDownload}
                >
                    <QrCode className="h-6 w-6" />
                    <span className="text-lg">AMBIL FILE</span>
                </Button>
            </div>

        </div>
      </div>
    </div>
  )
}