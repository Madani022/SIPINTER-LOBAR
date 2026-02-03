"use client"

import { useState, useEffect, useRef } from "react"
import { useKiosk } from "./kiosk-provider"
import { Button } from "@/components/ui/button"
import { Document, Page, pdfjs } from "react-pdf"
import { 
  ChevronLeft, ChevronRight, 
  ZoomIn, ZoomOut, 
  Loader2, RefreshCw, X, 
  QrCode, Download 
} from "lucide-react"

// --- SETUP WORKER (Wajib) ---
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface PDFViewerScreenProps {
  document: any
}

export function PDFViewerScreen({ document }: PDFViewerScreenProps) {
  const { navigateTo } = useKiosk()
  
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [scale, setScale] = useState<number>(1.0) // 1.0 = Fit to Screen
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // State untuk menghitung tinggi layar
  const [basePageHeight, setBasePageHeight] = useState(600)
  const containerRef = useRef<HTMLDivElement>(null)

  // Ambil URL
  const fileUrl = document.url || document.pdfUrl

  // Hitung tinggi container agar pas layar
  useEffect(() => {
    function handleResize() {
      if (containerRef.current) {
        // Kurangi padding atas bawah biar rapi
        setBasePageHeight(containerRef.current.clientHeight - 40) 
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

  // Fungsi Zoom
  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.2, 2.0)) // Max 2x
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.2, 1.0)) // Min 1x (Fit)

  // Fungsi QR Download
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
            <Button size="lg" className="mt-8 text-lg" onClick={() => navigateTo({ type: "home" })}>
                Kembali ke Menu Utama
            </Button>
        </div>
      )
  }

  return (
    <div className="flex h-screen flex-col bg-slate-100 overflow-hidden">
      
      {/* 1. HEADER (Judul & Close) */}
      <div className="bg-white px-6 py-4 shadow-sm z-10 flex items-center justify-between shrink-0">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">DOKUMEN</span>
            <h1 className="text-xl font-bold text-slate-800 line-clamp-1">
                {document.title || "Tampilan Dokumen"}
            </h1>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-12 w-12 rounded-full bg-slate-100 hover:bg-red-100 hover:text-red-600"
            onClick={() => navigateTo({ type: "home" })}
          >
             <X className="h-6 w-6" />
          </Button>
      </div>

      {/* 2. AREA PDF (Tengah) */}
      <div className="flex-1 relative overflow-auto flex justify-center bg-slate-200/50 p-4" ref={containerRef}>
        
        {loading && (
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-20">
                <Loader2 className="h-16 w-16 animate-spin text-[#0F4C81] mb-4" />
                <p className="text-xl font-medium text-slate-600">Membuka Halaman...</p>
             </div>
        )}

        {error ? (
            <div className="self-center text-center">
                <p className="text-red-500 text-xl font-bold">{error}</p>
            </div>
        ) : (
            <div className="shadow-2xl border border-slate-200 bg-white self-start transition-all duration-200 ease-out origin-top">
                <Document
                    file={fileUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    loading={null}
                >
                    <Page 
                        pageNumber={pageNumber} 
                        // Logic Zoom: Tinggi Dasar x Skala Zoom
                        height={basePageHeight * scale} 
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        className="bg-white"
                    />
                </Document>
            </div>
        )}
      </div>

      {/* 3. FOOTER NAVIGASI (The Control Center) */}
      <div className="bg-white border-t border-slate-200 px-4 py-3 shrink-0 z-20 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between gap-4">
            
            {/* ZONA KIRI: ZOOM & DOWNLOAD */}
            <div className="flex items-center gap-2">
                {/* Tombol Zoom */}
                <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-12 w-12 rounded-lg hover:bg-white hover:shadow-sm"
                        onClick={handleZoomOut}
                        disabled={scale <= 1.0}
                    >
                        <ZoomOut className="h-6 w-6 text-slate-600" />
                    </Button>
                    <span className="w-12 text-center font-bold text-slate-600 text-sm">
                        {Math.round(scale * 100)}%
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-12 w-12 rounded-lg hover:bg-white hover:shadow-sm"
                        onClick={handleZoomIn}
                        disabled={scale >= 2.0}
                    >
                        <ZoomIn className="h-6 w-6 text-slate-600" />
                    </Button>
                </div>

                {/* Tombol QR Download */}
                <Button 
                    className="h-14 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold gap-2 shadow-sm"
                    onClick={handleQrDownload}
                >
                    <QrCode className="h-6 w-6" />
                    <span className="hidden xl:inline">AMBIL FILE</span>
                </Button>
            </div>

            {/* ZONA TENGAH: NAVIGASI HALAMAN (Paling Besar) */}
            <div className="flex items-center gap-3 flex-1 justify-center max-w-3xl">
                <Button
                    size="lg"
                    className="h-14 px-6 xl:px-8 text-base xl:text-lg font-bold rounded-xl bg-slate-200 text-slate-700 hover:bg-slate-300 hover:text-slate-900 active:scale-95 transition-all flex-1 max-w-[200px]"
                    onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
                    disabled={pageNumber <= 1 || loading}
                >
                    <ChevronLeft className="h-6 w-6 mr-1" />
                    SEBELUMNYA
                </Button>

                <div className="flex flex-col items-center px-4 min-w-[100px]">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">HALAMAN</span>
                    <span className="text-3xl font-black text-slate-800 tabular-nums">
                        {loading ? "-" : pageNumber}<span className="text-lg text-slate-400 font-normal">/{numPages}</span>
                    </span>
                </div>

                <Button
                    size="lg"
                    className="h-14 px-6 xl:px-8 text-base xl:text-lg font-bold rounded-xl bg-[#0F4C81] hover:bg-[#0b3d69] text-white shadow-md hover:shadow-lg active:scale-95 transition-all flex-1 max-w-[200px]"
                    onClick={() => setPageNumber((prev) => Math.min(prev + 1, numPages))}
                    disabled={pageNumber >= numPages || loading}
                >
                    SELANJUTNYA
                    <ChevronRight className="h-6 w-6 ml-1" />
                </Button>
            </div>

            {/* ZONA KANAN: Spacer agar tengah seimbang (Hidden di mobile) */}
            <div className="hidden lg:block w-[280px]"></div>

        </div>
      </div>
    </div>
  )
}