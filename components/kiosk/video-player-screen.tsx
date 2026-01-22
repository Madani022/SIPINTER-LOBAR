"use client"

import { useKiosk } from "./kiosk-provider"
import { Button } from "@/components/ui/button"
import { X, Play } from "lucide-react"

interface VideoPlayerScreenProps {
  title: string
  videoUrl: string
}

export function VideoPlayerScreen({ title, videoUrl }: VideoPlayerScreenProps) {
  const { goBack, goHome } = useKiosk()

  return (
    <div className="flex h-full flex-col bg-foreground/95">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border/20 bg-card px-6 py-4">
        <Button
          size="lg"
          variant="ghost"
          onClick={goBack}
          className="h-14 gap-3 px-6 text-lg font-semibold hover:bg-muted"
        >
          <X className="h-6 w-6" />
          Tutup
        </Button>

        <h1 className="text-2xl font-bold text-foreground">{title}</h1>

        <Button
          size="lg"
          variant="outline"
          onClick={goHome}
          className="h-14 px-6 text-lg font-semibold bg-transparent"
        >
          Beranda
        </Button>
      </header>

      {/* Video Container */}
      <main className="flex flex-1 items-center justify-center p-8">
        <div className="relative aspect-video w-full max-w-6xl overflow-hidden rounded-2xl bg-card shadow-2xl">
          {videoUrl.includes("youtube") ? (
            <iframe
              src={videoUrl}
              title={title}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-muted">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                <Play className="h-12 w-12 text-primary" />
              </div>
              <p className="text-xl font-medium text-muted-foreground">
                Video akan diputar di sini
              </p>
              <p className="mt-2 text-muted-foreground/70">{videoUrl}</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/20 bg-card px-8 py-4">
        <p className="text-center text-muted-foreground">
          Sentuh tombol Tutup atau Beranda untuk kembali
        </p>
      </footer>
    </div>
  )
}
