"use server"

import prisma from "@/lib/prisma"
import type { TrackStatInput, DashboardStats } from "@/lib/types"

export async function trackDocumentStat(input: TrackStatInput) {
  try {
    // Create stat record
    await prisma.documentStat.create({
      data: {
        documentId: input.documentId,
        action: input.action,
        sessionId: input.sessionId,
        ipAddress: null, // Can be filled from headers
        userAgent: null,
      },
    })

    // Update document counters
    if (input.action === "view") {
      await prisma.document.update({
        where: { id: input.documentId },
        data: { viewCount: { increment: 1 } },
      })
    } else if (input.action === "download") {
      await prisma.document.update({
        where: { id: input.documentId },
        data: { downloadCount: { increment: 1 } },
      })
    }

    // Update daily stats
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const dailyStatUpdate: any = {}
    if (input.action === "view") dailyStatUpdate.totalViews = { increment: 1 }
    if (input.action === "download") dailyStatUpdate.totalDownloads = { increment: 1 }
    if (input.action === "qr_scan") dailyStatUpdate.totalQrScans = { increment: 1 }

    await prisma.dailyStat.upsert({
      where: { date: today },
      update: dailyStatUpdate,
      create: {
        date: today,
        ...Object.fromEntries(
          Object.entries(dailyStatUpdate).map(([key, value]: [string, any]) => [
            key,
            value.increment,
          ])
        ),
      },
    })

    return { success: true }
  } catch (error) {
    console.error("Error tracking stat:", error)
    return { success: false, error: "Failed to track stat" }
  }
}

export async function trackSession(sessionToken: string) {
  try {
    await prisma.kioskSession.upsert({
      where: { sessionToken },
      update: {
        lastActivity: new Date(),
        pageViews: { increment: 1 },
      },
      create: {
        sessionToken,
        startedAt: new Date(),
        lastActivity: new Date(),
        pageViews: 1,
      },
    })

    return { success: true }
  } catch (error) {
    console.error("Error tracking session:", error)
    return { success: false }
  }
}

export async function endSession(sessionToken: string) {
  try {
    await prisma.kioskSession.update({
      where: { sessionToken },
      data: {
        endedAt: new Date(),
      },
    })

    return { success: true }
  } catch (error) {
    console.error("Error ending session:", error)
    return { success: false }
  }
}

export async function getDashboardStats(): Promise<{ success: boolean; data?: DashboardStats }> {
  try {
    // Get basic counts
    const [totalDocuments, totalCategories, todayStats, weeklyStats, topDocuments] =
      await Promise.all([
        prisma.document.count({ where: { isActive: true } }),
        prisma.category.count({ where: { isActive: true } }),
        getTodayStats(),
        getWeeklyStats(),
        getTopDocuments(),
      ])

    // Calculate total views and downloads
    const allTimeStats = await prisma.document.aggregate({
      _sum: {
        viewCount: true,
        downloadCount: true,
      },
    })

    const data: DashboardStats = {
      totalDocuments,
      totalCategories,
      totalViews: allTimeStats._sum.viewCount || 0,
      totalDownloads: allTimeStats._sum.downloadCount || 0,
      todayViews: todayStats.totalViews,
      todayDownloads: todayStats.totalDownloads,
      weeklyStats,
      topDocuments,
      recentActivity: [],
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error getting dashboard stats:", error)
    return { success: false }
  }
}

async function getTodayStats() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const stats = await prisma.dailyStat.findUnique({
    where: { date: today },
  })

  return {
    totalViews: stats?.totalViews || 0,
    totalDownloads: stats?.totalDownloads || 0,
    totalQrScans: stats?.totalQrScans || 0,
  }
}

async function getWeeklyStats() {
  const today = new Date()
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

  const stats = await prisma.dailyStat.findMany({
    where: {
      date: {
        gte: weekAgo,
        lte: today,
      },
    },
    orderBy: { date: "asc" },
  })

  return stats.map((s) => ({
    date: s.date.toISOString().split("T")[0],
    views: s.totalViews,
    downloads: s.totalDownloads,
    qrScans: s.totalQrScans,
  }))
}

async function getTopDocuments() {
  const docs = await prisma.document.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: { viewCount: "desc" },
    take: 10,
  })

  return docs.map((d) => ({
    id: d.id,
    title: d.title,
    viewCount: d.viewCount,
    downloadCount: d.downloadCount,
    category: d.category.name,
  }))
}