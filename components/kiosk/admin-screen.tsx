"use client"

import { useState, useEffect } from "react"
import { useKiosk } from "./kiosk-provider"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  getTopMenus, 
  getTopDocuments, 
  getTodayInteractions, 
  getTotalInteractions,
  clearAnalytics 
} from "@/lib/analytics-store"
import { Home, BarChart3, FileText, MousePointer, Trash2, RefreshCw } from "lucide-react"

interface TopItem {
  name: string
  count: number
}

export function AdminScreen() {
  const { goHome, isOnline } = useKiosk()
  const [topMenus, setTopMenus] = useState<TopItem[]>([])
  const [topDocs, setTopDocs] = useState<TopItem[]>([])
  const [todayCount, setTodayCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    setTopMenus(getTopMenus(5))
    setTopDocs(getTopDocuments(5))
    setTodayCount(getTodayInteractions())
    setTotalCount(getTotalInteractions())
  }, [refreshKey])

  const handleClearAnalytics = () => {
    if (confirm("Yakin ingin menghapus semua data analytics?")) {
      clearAnalytics()
      setRefreshKey(prev => prev + 1)
    }
  }

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border bg-primary px-4 py-3 lg:px-8 lg:py-4">
        <h1 className="text-lg font-bold text-primary-foreground lg:text-2xl">
          Admin - Analytics Dashboard
        </h1>
        <div className="flex items-center gap-2 lg:gap-4">
          <div className={`rounded-full px-3 py-1 text-xs font-medium lg:px-4 lg:py-2 lg:text-sm ${
            isOnline ? "bg-green-500/20 text-green-100" : "bg-amber-500/20 text-amber-100"
          }`}>
            {isOnline ? "Online" : "Offline"}
          </div>
          <Button
            size="lg"
            variant="secondary"
            onClick={goHome}
            className="h-10 gap-2 px-4 text-sm font-semibold lg:h-14 lg:px-8 lg:text-lg"
          >
            <Home className="h-4 w-4 lg:h-6 lg:w-6" />
            <span className="hidden sm:inline">Beranda</span>
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto bg-background p-4 lg:p-8">
        {/* Summary Cards */}
        <div className="mb-6 grid grid-cols-2 gap-4 lg:mb-8 lg:grid-cols-4 lg:gap-6">
          <Card className="flex flex-col items-center justify-center p-4 lg:p-6">
            <MousePointer className="mb-2 h-6 w-6 text-primary lg:h-8 lg:w-8" />
            <p className="text-2xl font-bold text-foreground lg:text-4xl">{todayCount}</p>
            <p className="text-xs text-muted-foreground lg:text-sm">Interaksi Hari Ini</p>
          </Card>
          <Card className="flex flex-col items-center justify-center p-4 lg:p-6">
            <BarChart3 className="mb-2 h-6 w-6 text-primary lg:h-8 lg:w-8" />
            <p className="text-2xl font-bold text-foreground lg:text-4xl">{totalCount}</p>
            <p className="text-xs text-muted-foreground lg:text-sm">Total Interaksi</p>
          </Card>
          <Card className="flex flex-col items-center justify-center p-4 lg:p-6">
            <FileText className="mb-2 h-6 w-6 text-primary lg:h-8 lg:w-8" />
            <p className="text-2xl font-bold text-foreground lg:text-4xl">{topMenus.length}</p>
            <p className="text-xs text-muted-foreground lg:text-sm">Menu Diklik</p>
          </Card>
          <Card className="flex flex-col items-center justify-center p-4 lg:p-6">
            <FileText className="mb-2 h-6 w-6 text-primary lg:h-8 lg:w-8" />
            <p className="text-2xl font-bold text-foreground lg:text-4xl">{topDocs.length}</p>
            <p className="text-xs text-muted-foreground lg:text-sm">Dokumen Dilihat</p>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          {/* Top 5 Menu */}
          <Card className="p-4 lg:p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold lg:text-xl">
              <BarChart3 className="h-5 w-5 text-primary lg:h-6 lg:w-6" />
              Top 5 Menu Paling Sering Dibuka
            </h2>
            {topMenus.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">Belum ada data</p>
            ) : (
              <div className="space-y-3">
                {topMenus.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground lg:h-8 lg:w-8">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium lg:text-base">{item.name}</p>
                    </div>
                    <span className="rounded-full bg-muted px-3 py-1 text-sm font-semibold">
                      {item.count}x
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Top 5 Documents */}
          <Card className="p-4 lg:p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold lg:text-xl">
              <FileText className="h-5 w-5 text-primary lg:h-6 lg:w-6" />
              Top 5 Dokumen Paling Sering Diakses
            </h2>
            {topDocs.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">Belum ada data</p>
            ) : (
              <div className="space-y-3">
                {topDocs.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground lg:h-8 lg:w-8">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="line-clamp-1 text-sm font-medium lg:text-base">{item.name}</p>
                    </div>
                    <span className="rounded-full bg-muted px-3 py-1 text-sm font-semibold">
                      {item.count}x
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap justify-center gap-4 lg:mt-8">
          <Button
            size="lg"
            variant="outline"
            onClick={handleRefresh}
            className="h-12 gap-2 px-6 text-base lg:h-14 lg:px-8 lg:text-lg bg-transparent"
          >
            <RefreshCw className="h-5 w-5" />
            Refresh Data
          </Button>
          <Button
            size="lg"
            variant="destructive"
            onClick={handleClearAnalytics}
            className="h-12 gap-2 px-6 text-base lg:h-14 lg:px-8 lg:text-lg"
          >
            <Trash2 className="h-5 w-5" />
            Hapus Semua Data
          </Button>
        </div>
      </main>
    </div>
  )
}
