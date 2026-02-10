"use server"

import { prisma } from "@/lib/prisma"

export async function getDashboardStats() {
  try {
    // 1. Jalankan semua query secara PARALEL biar ngebut
    const [
      docCount,
      categoryCount,
      interactionStats,
      mostPopular,
      top5Docs,
      recentActivity
    ] = await prisma.$transaction([
      // A. Total Dokumen
      prisma.document.count({ where: { isActive: true } }),

      // B. Total Kategori
      prisma.category.count({ where: { isActive: true } }),

      // C. Total Interaksi (Sum ViewCount)
      prisma.document.aggregate({
        _sum: {
          viewCount: true,
          downloadCount: true
        }
      }),

      // D. Dokumen Terpopuler (Juara 1)
      prisma.document.findFirst({
        where: { isActive: true },
        orderBy: { viewCount: 'desc' },
        include: { category: true } // Include kategori biar namanya muncul
      }),

      // E. 5 Dokumen Teratas
      prisma.document.findMany({
        where: { isActive: true },
        take: 5,
        orderBy: { viewCount: 'desc' },
        include: { category: true }
      }),

      // F. Log Aktivitas (Kita ambil dari dokumen yang baru diupdate/create)
      prisma.document.findMany({
        take: 5,
        orderBy: { updatedAt: 'desc' },
        select: {
            id: true,
            title: true,
            updatedAt: true,
            createdAt: true
        }
      })
    ])

    // Hitung total interaksi
    const totalViews = interactionStats._sum.viewCount || 0
    // const totalDownloads = interactionStats._sum.downloadCount || 0 // Kalau mau dipakai

    return {
      success: true,
      data: {
        docCount,
        categoryCount,
        totalViews, // Gabungan view + download kalau mau
        mostPopular,
        top5Docs,
        recentActivity
      }
    }

  } catch (error) {
    console.error("Dashboard Stats Error:", error)
    return { success: false, error: "Gagal mengambil data dashboard" }
  }
}