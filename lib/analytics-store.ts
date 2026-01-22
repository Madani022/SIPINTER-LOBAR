"use client"

// Local analytics storage for kiosk usage tracking

export interface AnalyticsData {
  menuClicks: Record<string, number>
  documentViews: Record<string, number>
  dailyInteractions: Record<string, number> // date string -> count
  lastUpdated: string
}

const STORAGE_KEY = "kiosk_analytics"

function getDefaultData(): AnalyticsData {
  return {
    menuClicks: {},
    documentViews: {},
    dailyInteractions: {},
    lastUpdated: new Date().toISOString(),
  }
}

export function getAnalytics(): AnalyticsData {
  if (typeof window === "undefined") return getDefaultData()
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {
    console.error("Failed to load analytics:", e)
  }
  return getDefaultData()
}

function saveAnalytics(data: AnalyticsData): void {
  if (typeof window === "undefined") return
  
  try {
    data.lastUpdated = new Date().toISOString()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.error("Failed to save analytics:", e)
  }
}

export function trackMenuClick(menuId: string, menuTitle: string): void {
  const data = getAnalytics()
  const key = `${menuId}:${menuTitle}`
  data.menuClicks[key] = (data.menuClicks[key] || 0) + 1
  
  const today = new Date().toISOString().split("T")[0]
  data.dailyInteractions[today] = (data.dailyInteractions[today] || 0) + 1
  
  saveAnalytics(data)
}

export function trackDocumentView(docId: string, docTitle: string): void {
  const data = getAnalytics()
  const key = `${docId}:${docTitle}`
  data.documentViews[key] = (data.documentViews[key] || 0) + 1
  
  const today = new Date().toISOString().split("T")[0]
  data.dailyInteractions[today] = (data.dailyInteractions[today] || 0) + 1
  
  saveAnalytics(data)
}

export function getTopMenus(limit: number = 5): Array<{ name: string; count: number }> {
  const data = getAnalytics()
  return Object.entries(data.menuClicks)
    .map(([key, count]) => ({ name: key.split(":")[1] || key, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

export function getTopDocuments(limit: number = 5): Array<{ name: string; count: number }> {
  const data = getAnalytics()
  return Object.entries(data.documentViews)
    .map(([key, count]) => ({ name: key.split(":")[1] || key, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

export function getTodayInteractions(): number {
  const data = getAnalytics()
  const today = new Date().toISOString().split("T")[0]
  return data.dailyInteractions[today] || 0
}

export function getTotalInteractions(): number {
  const data = getAnalytics()
  return Object.values(data.dailyInteractions).reduce((a, b) => a + b, 0)
}

export function clearAnalytics(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(STORAGE_KEY)
}
