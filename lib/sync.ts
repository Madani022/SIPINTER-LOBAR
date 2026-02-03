// Sync utilities for DPMPTSP Kiosk System
// This module handles synchronization between local SQLite and central MySQL server

import prisma from "@/lib/prisma"
import type { SyncResult, SyncStatus } from "@/lib/types"

// ===========================================
// SYNC CONFIGURATION
// ===========================================

interface SyncConfig {
  centralServerUrl: string
  apiKey: string
  kioskId: string
  syncInterval: number // in seconds
}

function getSyncConfig(): SyncConfig | null {
  const serverUrl = process.env.CENTRAL_SERVER_URL
  const apiKey = process.env.CENTRAL_API_KEY
  const kioskId = process.env.KIOSK_ID

  if (!serverUrl || !apiKey || !kioskId) {
    return null
  }

  return {
    centralServerUrl: serverUrl,
    apiKey,
    kioskId,
    syncInterval: parseInt(process.env.SYNC_INTERVAL || "3600"),
  }
}

// ===========================================
// SYNC STATUS
// ===========================================

/**
 * Get current sync status
 */
export async function getSyncStatus(): Promise<SyncStatus> {
  try {
    // Get last successful sync
    const lastSync = await prisma.syncLog.findFirst({
      where: { status: "completed" },
      orderBy: { completedAt: "desc" },
    })

    // Check for pending sync
    const pendingSync = await prisma.syncLog.findFirst({
      where: { status: "in_progress" },
    })

    // Count pending changes (documents/stats created after last sync)
    const lastSyncTime = lastSync?.completedAt || new Date(0)
    
    const pendingDocuments = await prisma.document.count({
      where: { updatedAt: { gt: lastSyncTime } },
    })

    const pendingStats = await prisma.documentStat.count({
      where: { createdAt: { gt: lastSyncTime } },
    })

    const config = getSyncConfig()
    const syncInterval = config?.syncInterval || 3600

    return {
      lastSync: lastSync?.completedAt || null,
      nextScheduledSync: lastSync?.completedAt
        ? new Date(lastSync.completedAt.getTime() + syncInterval * 1000)
        : null,
      status: pendingSync ? "syncing" : "idle",
      pendingChanges: pendingDocuments + pendingStats,
    }
  } catch (error) {
    console.error("Error getting sync status:", error)
    return {
      lastSync: null,
      nextScheduledSync: null,
      status: "error",
      pendingChanges: 0,
    }
  }
}

// ===========================================
// SYNC OPERATIONS
// ===========================================

/**
 * Sync documents to central server
 */
export async function syncDocuments(): Promise<SyncResult> {
  const config = getSyncConfig()
  
  if (!config) {
    return {
      success: false,
      syncedRecords: 0,
      errors: ["Sync not configured. Set CENTRAL_SERVER_URL, CENTRAL_API_KEY, and KIOSK_ID environment variables."],
      timestamp: new Date(),
    }
  }

  // Create sync log entry
  const syncLog = await prisma.syncLog.create({
    data: {
      syncType: "documents",
      status: "in_progress",
    },
  })

  try {
    // Get last successful sync timestamp
    const lastSync = await prisma.syncLog.findFirst({
      where: { 
        status: "completed",
        syncType: "documents",
      },
      orderBy: { completedAt: "desc" },
    })

    const lastSyncTime = lastSync?.completedAt || new Date(0)

    // Get documents updated since last sync
    const documents = await prisma.document.findMany({
      where: { updatedAt: { gt: lastSyncTime } },
      include: { category: true },
    })

    if (documents.length === 0) {
      await prisma.syncLog.update({
        where: { id: syncLog.id },
        data: {
          status: "completed",
          recordsSync: 0,
          completedAt: new Date(),
        },
      })

      return {
        success: true,
        syncedRecords: 0,
        errors: [],
        timestamp: new Date(),
      }
    }

    // TODO: Replace with actual API call when central server is available
    // const response = await fetch(`${config.centralServerUrl}/api/sync/documents`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "X-API-Key": config.apiKey,
    //     "X-Kiosk-ID": config.kioskId,
    //   },
    //   body: JSON.stringify({ documents }),
    // })

    // Simulate sync for development
    console.log(`[Sync] Would sync ${documents.length} documents to central server`)
    
    await prisma.syncLog.update({
      where: { id: syncLog.id },
      data: {
        status: "completed",
        recordsSync: documents.length,
        completedAt: new Date(),
      },
    })

    return {
      success: true,
      syncedRecords: documents.length,
      errors: [],
      timestamp: new Date(),
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"

    await prisma.syncLog.update({
      where: { id: syncLog.id },
      data: {
        status: "failed",
        errorMessage,
        completedAt: new Date(),
      },
    })

    return {
      success: false,
      syncedRecords: 0,
      errors: [errorMessage],
      timestamp: new Date(),
    }
  }
}

/**
 * Sync statistics to central server
 */
export async function syncStats(): Promise<SyncResult> {
  const config = getSyncConfig()
  
  if (!config) {
    return {
      success: false,
      syncedRecords: 0,
      errors: ["Sync not configured"],
      timestamp: new Date(),
    }
  }

  // Create sync log entry
  const syncLog = await prisma.syncLog.create({
    data: {
      syncType: "stats",
      status: "in_progress",
    },
  })

  try {
    // Get last successful stats sync
    const lastSync = await prisma.syncLog.findFirst({
      where: { 
        status: "completed",
        syncType: "stats",
      },
      orderBy: { completedAt: "desc" },
    })

    const lastSyncTime = lastSync?.completedAt || new Date(0)

    // Get stats created since last sync
    const documentStats = await prisma.documentStat.findMany({
      where: { createdAt: { gt: lastSyncTime } },
    })

    const dailyStats = await prisma.dailyStat.findMany({
      where: { updatedAt: { gt: lastSyncTime } },
    })

    const totalRecords = documentStats.length + dailyStats.length

    if (totalRecords === 0) {
      await prisma.syncLog.update({
        where: { id: syncLog.id },
        data: {
          status: "completed",
          recordsSync: 0,
          completedAt: new Date(),
        },
      })

      return {
        success: true,
        syncedRecords: 0,
        errors: [],
        timestamp: new Date(),
      }
    }

    // TODO: Replace with actual API call when central server is available
    console.log(`[Sync] Would sync ${documentStats.length} document stats and ${dailyStats.length} daily stats to central server`)
    
    await prisma.syncLog.update({
      where: { id: syncLog.id },
      data: {
        status: "completed",
        recordsSync: totalRecords,
        completedAt: new Date(),
      },
    })

    return {
      success: true,
      syncedRecords: totalRecords,
      errors: [],
      timestamp: new Date(),
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"

    await prisma.syncLog.update({
      where: { id: syncLog.id },
      data: {
        status: "failed",
        errorMessage,
        completedAt: new Date(),
      },
    })

    return {
      success: false,
      syncedRecords: 0,
      errors: [errorMessage],
      timestamp: new Date(),
    }
  }
}

/**
 * Full sync - documents and stats
 */
export async function fullSync(): Promise<SyncResult> {
  const config = getSyncConfig()
  
  if (!config) {
    return {
      success: false,
      syncedRecords: 0,
      errors: ["Sync not configured. Set CENTRAL_SERVER_URL, CENTRAL_API_KEY, and KIOSK_ID environment variables."],
      timestamp: new Date(),
    }
  }

  // Create sync log entry
  const syncLog = await prisma.syncLog.create({
    data: {
      syncType: "full",
      status: "in_progress",
    },
  })

  try {
    const documentsResult = await syncDocuments()
    const statsResult = await syncStats()

    const totalSynced = documentsResult.syncedRecords + statsResult.syncedRecords
    const errors = [...documentsResult.errors, ...statsResult.errors]
    const success = documentsResult.success && statsResult.success

    await prisma.syncLog.update({
      where: { id: syncLog.id },
      data: {
        status: success ? "completed" : "failed",
        recordsSync: totalSynced,
        errorMessage: errors.length > 0 ? errors.join("; ") : null,
        completedAt: new Date(),
      },
    })

    return {
      success,
      syncedRecords: totalSynced,
      errors,
      timestamp: new Date(),
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"

    await prisma.syncLog.update({
      where: { id: syncLog.id },
      data: {
        status: "failed",
        errorMessage,
        completedAt: new Date(),
      },
    })

    return {
      success: false,
      syncedRecords: 0,
      errors: [errorMessage],
      timestamp: new Date(),
    }
  }
}

/**
 * Get sync history
 */
export async function getSyncHistory(limit = 10) {
  try {
    const logs = await prisma.syncLog.findMany({
      orderBy: { startedAt: "desc" },
      take: limit,
    })

    return { success: true, data: logs }
  } catch (error) {
    console.error("Error getting sync history:", error)
    return { success: false, error: "Failed to get sync history" }
  }
}
