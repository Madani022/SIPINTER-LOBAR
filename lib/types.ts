// Type definitions for DPMPTSP Kiosk System

// ===========================================
// DATABASE TYPES (matching Prisma schema)
// ===========================================

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  documents?: Document[]
}

export interface Document {
  id: string
  title: string
  slug: string
  description: string | null
  categoryId: string
  category?: Category
  filePath: string
  fileSize: number
  qrCode: string | null
  downloadUrl: string | null
  version: string
  isActive: boolean
  isFeatured: boolean
  viewCount: number
  downloadCount: number
  createdAt: Date
  updatedAt: Date
}

export interface DocumentStat {
  id: string
  documentId: string
  action: "view" | "download" | "qr_scan"
  ipAddress: string | null
  userAgent: string | null
  sessionId: string | null
  createdAt: Date
}

export interface DailyStat {
  id: string
  date: Date
  totalViews: number
  totalDownloads: number
  totalQrScans: number
  uniqueVisitors: number
  createdAt: Date
  updatedAt: Date
}

export interface KioskSession {
  id: string
  sessionToken: string
  startedAt: Date
  endedAt: Date | null
  pageViews: number
  documentsViewed: number
  lastActivity: Date
}

export interface SyncLog {
  id: string
  syncType: "full" | "incremental" | "documents" | "stats"
  status: "pending" | "in_progress" | "completed" | "failed"
  recordsSync: number
  errorMessage: string | null
  startedAt: Date
  completedAt: Date | null
}

export interface Setting {
  id: string
  key: string
  value: string
  type: "string" | "number" | "boolean" | "json"
  createdAt: Date
  updatedAt: Date
}

// ===========================================
// FRONTEND TYPES (for kiosk-provider compatibility)
// ===========================================

/**
 * DocumentItem - Used by frontend kiosk components
 * This is the simplified version of Document for frontend use
 */
export interface DocumentItem {
  id: string
  title: string
  description: string
  pdfUrl: string
  driveUrl?: string
  thumbnail?: string
  category?: "sp" | "sop" | "formulir" | "pedoman" | "surat-edaran" | "lainnya"
  categoryId?: string
}

/**
 * Convert database Document to frontend DocumentItem
 */
export function toDocumentItem(doc: Document): DocumentItem {
  return {
    id: doc.id,
    title: doc.title,
    description: doc.description || "",
    pdfUrl: doc.filePath,
    driveUrl: doc.downloadUrl || undefined,
    thumbnail: undefined, // Can be generated from PDF later
    category: mapCategorySlug(doc.category?.slug),
    categoryId: doc.categoryId,
  }
}

function mapCategorySlug(
  slug?: string
): "sp" | "sop" | "formulir" | "pedoman" | "surat-edaran" | "lainnya" | undefined {
  if (!slug) return undefined
  const mapping: Record<string, "sp" | "sop" | "formulir" | "pedoman" | "surat-edaran" | "lainnya"> = {
    "standar-pelayanan": "sp",
    sp: "sp",
    sop: "sop",
    formulir: "formulir",
    pedoman: "pedoman",
    "surat-edaran": "surat-edaran",
  }
  return mapping[slug] || "lainnya"
}

// ===========================================
// API TYPES
// ===========================================

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// ===========================================
// REQUEST TYPES
// ===========================================

export interface CreateDocumentInput {
  title: string
  slug?: string
  description?: string
  categoryId: string
  filePath: string
  fileSize: number
  qrCode?: string
  downloadUrl?: string
  version?: string
  isActive?: boolean
  isFeatured?: boolean
}

export interface UpdateDocumentInput {
  title?: string
  description?: string
  categoryId?: string
  filePath?: string
  fileSize?: number
  qrCode?: string
  downloadUrl?: string
  version?: string
  isActive?: boolean
  isFeatured?: boolean
}

export interface CreateCategoryInput {
  name: string
  slug?: string
  description?: string
  icon?: string
  order?: number
  isActive?: boolean
}

export interface UpdateCategoryInput {
  name?: string
  description?: string
  icon?: string
  order?: number
  isActive?: boolean
}

export interface TrackStatInput {
  documentId: string
  action: "view" | "download" | "qr_scan"
  sessionId?: string
}

// ===========================================
// STATISTICS TYPES
// ===========================================

export interface DashboardStats {
  totalDocuments: number
  totalCategories: number
  totalViews: number
  totalDownloads: number
  todayViews: number
  todayDownloads: number
  weeklyStats: WeeklyStatItem[]
  topDocuments: TopDocument[]
  recentActivity: RecentActivity[]
}

export interface WeeklyStatItem {
  date: string
  views: number
  downloads: number
  qrScans: number
}

export interface TopDocument {
  id: string
  title: string
  viewCount: number
  downloadCount: number
  category: string
}

export interface RecentActivity {
  id: string
  documentTitle: string
  action: string
  createdAt: Date
}

// ===========================================
// AUTH TYPES
// ===========================================

export interface AuthSession {
  isAuthenticated: boolean
  expiresAt: number
}

export interface LoginCredentials {
  username: string
  password: string
}

// ===========================================
// SYNC TYPES
// ===========================================

export interface SyncResult {
  success: boolean
  syncedRecords: number
  errors: string[]
  timestamp: Date
}

export interface SyncStatus {
  lastSync: Date | null
  nextScheduledSync: Date | null
  status: "idle" | "syncing" | "error"
  pendingChanges: number
}
