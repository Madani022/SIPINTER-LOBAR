"use client"

// Offline data caching for kiosk mode

import { menuItems, documents, sectors } from "./kiosk-data"

const CACHE_KEY = "kiosk_offline_cache"
const CACHE_VERSION = "1.0"

export interface CachedData {
  version: string
  timestamp: string
  menuItems: typeof menuItems
  documents: typeof documents
  sectors: typeof sectors
}

export function cacheDataForOffline(): void {
  if (typeof window === "undefined") return
  
  try {
    const cacheData: CachedData = {
      version: CACHE_VERSION,
      timestamp: new Date().toISOString(),
      menuItems,
      documents,
      sectors,
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))
  } catch (e) {
    console.error("Failed to cache data:", e)
  }
}

export function getCachedData(): CachedData | null {
  if (typeof window === "undefined") return null
  
  try {
    const stored = localStorage.getItem(CACHE_KEY)
    if (stored) {
      const data = JSON.parse(stored) as CachedData
      if (data.version === CACHE_VERSION) {
        return data
      }
    }
  } catch (e) {
    console.error("Failed to load cached data:", e)
  }
  return null
}

export function isCacheValid(): boolean {
  const cached = getCachedData()
  if (!cached) return false
  
  // Cache is valid for 24 hours
  const cacheTime = new Date(cached.timestamp).getTime()
  const now = Date.now()
  const hoursDiff = (now - cacheTime) / (1000 * 60 * 60)
  
  return hoursDiff < 24
}

export function clearCache(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(CACHE_KEY)
}
