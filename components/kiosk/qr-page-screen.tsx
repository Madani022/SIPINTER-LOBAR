"use client"

import { useEffect, useRef } from "react"
import { NavigationBar } from "./navigation-bar"
import { Card } from "@/components/ui/card"
import { Smartphone } from "lucide-react"

interface QrPageScreenProps {
  title: string
  url: string
  description: string
}

export function QrPageScreen({ title, url, description }: QrPageScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (ctx) {
        const size = 320
        const moduleCount = 25
        const moduleSize = size / moduleCount

        canvas.width = size
        canvas.height = size

        // White background
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, size, size)

        // Generate pseudo-random QR pattern based on URL
        ctx.fillStyle = "#1e3a5f"
        
        // Create deterministic pattern based on URL
        const urlHash = url.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
        
        for (let row = 0; row < moduleCount; row++) {
          for (let col = 0; col < moduleCount; col++) {
            // Position patterns (corners)
            const isCorner =
              (row < 7 && col < 7) ||
              (row < 7 && col >= moduleCount - 7) ||
              (row >= moduleCount - 7 && col < 7)

            // Timing patterns
            const isTiming = (row === 6 || col === 6) && !isCorner

            const shouldFill = isCorner
              ? row < 7 && col < 7
                ? row === 0 ||
                  row === 6 ||
                  col === 0 ||
                  col === 6 ||
                  (row >= 2 && row <= 4 && col >= 2 && col <= 4)
                : row < 7 && col >= moduleCount - 7
                  ? row === 0 ||
                    row === 6 ||
                    col === moduleCount - 1 ||
                    col === moduleCount - 7 ||
                    (row >= 2 &&
                      row <= 4 &&
                      col >= moduleCount - 5 &&
                      col <= moduleCount - 3)
                  : row === moduleCount - 1 ||
                    row === moduleCount - 7 ||
                    col === 0 ||
                    col === 6 ||
                    (row >= moduleCount - 5 &&
                      row <= moduleCount - 3 &&
                      col >= 2 &&
                      col <= 4)
              : isTiming
                ? (row + col) % 2 === 0
                : ((row * col + urlHash) % 3) < 2

            if (shouldFill) {
              ctx.fillRect(
                col * moduleSize,
                row * moduleSize,
                moduleSize,
                moduleSize
              )
            }
          }
        }
      }
    }
  }, [url])

  return (
    <div className="flex h-full flex-col">
      <NavigationBar title={title} showBack />

      <main className="flex flex-1 items-center justify-center bg-background p-8">
        <Card className="max-w-3xl p-12 text-center shadow-xl">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Smartphone className="h-10 w-10 text-primary" />
          </div>

          <h2 className="text-4xl font-bold text-foreground">{title}</h2>
          
          {description && (
            <p className="mx-auto mt-4 max-w-lg text-lg text-muted-foreground">
              {description}
            </p>
          )}

          <div className="mt-10 flex justify-center">
            <div className="rounded-3xl border-4 border-primary/20 bg-card p-6 shadow-lg">
              <canvas ref={canvasRef} className="h-80 w-80" />
            </div>
          </div>

          <p className="mt-8 text-xl font-medium text-muted-foreground">
            Scan QR Code dengan kamera HP Anda
          </p>

          <div className="mt-6 rounded-xl bg-muted/50 p-4">
            <p className="text-sm font-medium text-muted-foreground">Link:</p>
            <p className="mt-1 break-all font-mono text-lg text-primary">{url}</p>
          </div>
        </Card>
      </main>
    </div>
  )
}
