"use client"

import { useState, useEffect, useRef } from "react"
import { useKiosk, type DocumentItem } from "./kiosk-provider"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X, QrCode, Loader2, Home, Smartphone } from "lucide-react"

// --- PDF.JS SETUP ---
import * as pdfjsLib from "pdfjs-dist"

// Kita gunakan CDN yang sesuai dengan versi library agar aman, 
// atau fallback ke path local jika Anda sudah setup file-nya.
// Jika error worker, pastikan versi CDN sama dengan versi package.json
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`

interface PDFViewerScreenProps {
  document: DocumentItem
}

export function PDFViewerScreen({ document }: PDFViewerScreenProps) {
  const { goBack, goHome } = useKiosk()
  
  // State UI
  const [isLoading, setIsLoading] = useState(true)
  const [showQrModal, setShowQrModal] = useState(false)
  
  // State PDF
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const renderTaskRef = useRef<any>(null)

  // 1. Load Dokumen PDF (Hanya sekali saat mount/document berubah)
  useEffect(() => {
    let isCancelled = false

    const loadPdf = async () => {
      try {
        setIsLoading(true)
        // Bersihkan state lama
        if (renderTaskRef.current) {
            await renderTaskRef.current.cancel().catch(() => {})
        }
        
        const loadingTask = pdfjsLib.getDocument(document.pdfUrl)
        const pdf = await loadingTask.promise
        
        if (!isCancelled) {
          setPdfDoc(pdf)
          setTotalPages(pdf.numPages)
          setCurrentPage(1)
        }
      } catch (error) {
        console.error("Error loading PDF:", error)
      } finally {
        if (!isCancelled) setIsLoading(false)
      }
    }

    loadPdf()

    return () => {
      isCancelled = true
    }
  }, [document.pdfUrl])

  // 2. Render Halaman ke Canvas
  useEffect(() => {
    const renderPage = async () => {
      if (!pdfDoc || !canvasRef.current || !containerRef.current) return

      try {
        setIsLoading(true)

        // Cancel render sebelumnya jika user klik tombol terlalu cepat
        if (renderTaskRef.current) {
           try {
             await renderTaskRef.current.cancel()
           } catch (e) {
             // Ignore cancel error
           }
        }

        const page = await pdfDoc.getPage(currentPage)
        const canvas = canvasRef.current
        const container = containerRef.current
        
        // --- LOGIKA SKALA RESPONSIF ---
        // Kita ambil viewport asli (skala 1)
        const unscaledViewport = page.getViewport({ scale: 1 })
        
        // Hitung rasio agar muat di container (dikurangi padding dikit)
        const containerWidth = container.clientWidth
        const containerHeight = container.clientHeight
        
        const scaleX = (containerWidth - 40) / unscaledViewport.width
        const scaleY = (containerHeight - 40) / unscaledViewport.height
        // Pilih yang paling kecil agar PDF tidak terpotong (contain)
        const scale = Math.min(scaleX, scaleY)

        const viewport = page.getViewport({ scale })

        // Support High DPI Screens (Retina) agar teks tajam di TV 4K/FHD
        const outputScale = window.devicePixelRatio || 1

        canvas.width = Math.floor(viewport.width * outputScale)
        canvas.height = Math.floor(viewport.height * outputScale)
        canvas.style.width = `${Math.floor(viewport.width)}px`
        canvas.style.height = `${Math.floor(viewport.height)}px`

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Transform agar sesuai skala DPI
        const transform = outputScale !== 1 
          ? [outputScale, 0, 0, outputScale, 0, 0] 
          : undefined

        const renderContext = {
          canvasContext: ctx,
          viewport: viewport,
          transform
        }

        renderTaskRef.current = page.render(renderContext)
        await renderTaskRef.current.promise
        
        setIsLoading(false)

      } catch (error: any) {
        if (error.name !== 'RenderingCancelledException') {
            console.error("Render error:", error)
            setIsLoading(false)
        }
      }
    }

    // Beri sedikit delay agar layout container stabil dulu
    // atau requestAnimationFrame
    requestAnimationFrame(() => renderPage())

  }, [pdfDoc, currentPage])


  // Handlers
  const handlePrevPage = () => setCurrentPage(p => Math.max(1, p - 1))
  const handleNextPage = () => setCurrentPage(p => Math.min(totalPages, p + 1))
  
  const downloadUrl = `https://drive.google.com/file/d/example/${document.id}`

  return (
    <div className="flex h-full flex-col bg-foreground/95">
      {/* --- UI HEADER: Menggunakan Style Lama --- */}
      <header className="flex items-center justify-between border-b border-border/20 bg-card px-6 py-4">
        <div className="flex items-center gap-3">
          <Button
            size="lg" variant="ghost" onClick={goBack}
            className="h-14 gap-3 px-6 text-lg font-semibold hover:bg-muted"
          >
            <X className="h-6 w-6" /> Tutup
          </Button>
          <Button
            size="lg" variant="outline" onClick={goHome}
            className="h-14 gap-2 px-6 text-lg font-semibold bg-transparent"
          >
            <Home className="h-5 w-5" /> Beranda
          </Button>
        </div>

        <h1 className="max-w-lg truncate text-xl font-bold text-foreground">
          {document.title}
        </h1>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              size="lg" variant="outline" onClick={handlePrevPage}
              disabled={currentPage <= 1}
              className="h-14 w-14 bg-transparent"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            
            <div className="flex min-w-[120px] items-center justify-center rounded-lg bg-muted px-4 py-3">
              <span className="text-lg font-bold">
                {totalPages > 0 ? `${currentPage} / ${totalPages}` : "..."}
              </span>
            </div>

            <Button
              size="lg" variant="outline" onClick={handleNextPage}
              disabled={currentPage >= totalPages}
              className="h-14 w-14 bg-transparent"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>

          <Button
            size="lg" variant="secondary" onClick={() => setShowQrModal(true)}
            className="h-14 gap-2 px-6 text-lg font-semibold"
          >
            <QrCode className="h-5 w-5" /> Unduh via HP
          </Button>
        </div>
      </header>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="relative flex flex-1 items-center justify-center p-8 overflow-hidden bg-gray-900/50">
        
        {/* Container untuk Canvas (sebagai pengganti iframe) */}
        <div 
            ref={containerRef}
            className="relative h-full w-full max-w-5xl flex items-center justify-center rounded-lg shadow-2xl overflow-hidden"
        >
            {/* Loading Indicator */}
            {isLoading && (
                 <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/50 text-white backdrop-blur-sm">
                    <Loader2 className="h-16 w-16 animate-spin" />
                    <p className="mt-4 text-xl font-medium">Memuat halaman...</p>
                 </div>
            )}

            {/* Canvas Render */}
            <canvas 
                ref={canvasRef} 
                className="block shadow-lg rounded bg-white"
            />
        </div>

        {/* Touch Navigation Overlay (Tombol Besar Kiri/Kanan) */}
        {!isLoading && totalPages > 0 && (
          <>
            <button
              type="button" onClick={handlePrevPage} disabled={currentPage <= 1}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-card/80 p-4 shadow-lg backdrop-blur-sm transition-all hover:bg-card disabled:opacity-30 z-10"
            >
              <ChevronLeft className="h-10 w-10 text-foreground" />
            </button>
            <button
              type="button" onClick={handleNextPage} disabled={currentPage >= totalPages}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-card/80 p-4 shadow-lg backdrop-blur-sm transition-all hover:bg-card disabled:opacity-30 z-10"
            >
              <ChevronRight className="h-10 w-10 text-foreground" />
            </button>
          </>
        )}
      </main>

      {/* QR Modal (Tetap sama) */}
      {showQrModal && (
        <QrDownloadModal
          documentTitle={document.title}
          downloadUrl={downloadUrl}
          onClose={() => setShowQrModal(false)}
        />
      )}
    </div>
  )
}

function QrDownloadModal({
  documentTitle,
  downloadUrl,
  onClose,
}: {
  documentTitle: string
  downloadUrl: string
  onClose: () => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (ctx) {
        const size = 280
        const moduleCount = 25
        const moduleSize = size / moduleCount

        canvas.width = size
        canvas.height = size

        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, size, size)

        ctx.fillStyle = "#1e3a5f"
        const urlHash = downloadUrl
          .split("")
          .reduce((acc, char) => acc + char.charCodeAt(0), 0)

        for (let row = 0; row < moduleCount; row++) {
          for (let col = 0; col < moduleCount; col++) {
            const isCorner =
              (row < 7 && col < 7) ||
              (row < 7 && col >= moduleCount - 7) ||
              (row >= moduleCount - 7 && col < 7)
            const isTiming = (row === 6 || col === 6) && !isCorner
            const shouldFill = isCorner
              ? row < 7 && col < 7
                ? row === 0 || row === 6 || col === 0 || col === 6 || (row >= 2 && row <= 4 && col >= 2 && col <= 4)
                : row < 7 && col >= moduleCount - 7
                  ? row === 0 || row === 6 || col === moduleCount - 1 || col === moduleCount - 7 || (row >= 2 && row <= 4 && col >= moduleCount - 5 && col <= moduleCount - 3)
                  : row === moduleCount - 1 || row === moduleCount - 7 || col === 0 || col === 6 || (row >= moduleCount - 5 && row <= moduleCount - 3 && col >= 2 && col <= 4)
              : isTiming ? (row + col) % 2 === 0 : ((row * col + urlHash) % 3) < 2
            if (shouldFill) {
              ctx.fillRect(col * moduleSize, row * moduleSize, moduleSize, moduleSize)
            }
          }
        }
      }
    }
  }, [downloadUrl])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-3xl bg-card p-10 shadow-2xl">
        <Button size="lg" variant="ghost" onClick={onClose} className="absolute right-4 top-4 h-14 w-14 rounded-full">
          <X className="h-8 w-8" />
        </Button>
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Smartphone className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Unduh Dokumen</h2>
          <p className="mt-2 text-muted-foreground">{documentTitle}</p>
        </div>
        <div className="mt-8 flex justify-center">
          <div className="rounded-2xl border-4 border-primary/20 bg-card p-4">
            <canvas ref={canvasRef} className="h-[280px] w-[280px]" />
          </div>
        </div>
        <p className="mt-6 text-center text-base text-muted-foreground">Scan QR Code dengan HP untuk mengunduh dokumen</p>
        <div className="mt-4 rounded-xl bg-muted/50 p-3 text-center">
          <p className="break-all font-mono text-sm text-primary">{downloadUrl}</p>
        </div>
        <Button size="lg" onClick={onClose} className="mt-8 h-14 w-full text-xl font-semibold">Tutup</Button>
      </div>
    </div>
  )
}