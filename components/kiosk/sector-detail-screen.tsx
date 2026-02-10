"use client"

import { DocumentsScreen } from "./documents-screen"

interface SectorDetailScreenProps {
  sectorId: string
  sectorTitle: string
  categorySlug?: string
}

export function SectorDetailScreen({ sectorId, sectorTitle, categorySlug }: SectorDetailScreenProps) {
  // LOGIKA CERDAS:
  // Kita langsung "meminjam" tampilan DocumentsScreen.
  // Kita oper 'categorySlug' yang didapat dari database/kiosk-data.
  
  return (
    <DocumentsScreen 
      categorySlug={categorySlug} 
      categoryTitle={sectorTitle} 
    />
  )
}