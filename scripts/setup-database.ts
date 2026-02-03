/**
 * Database Setup Script for DPMPTSP Kiosk System
 * 
 * This script initializes the SQLite database with:
 * - All required tables
 * - Default categories
 * - Default settings
 * - Sample documents
 * 
 * Run with: npx tsx scripts/setup-database.ts
 */

import Database from "better-sqlite3"
import { randomUUID } from "crypto"
import path from "path"
import fs from "fs"

// Database path
const DB_PATH = process.env.DATABASE_PATH || path.join(process.cwd(), "prisma", "dev.db")

// Ensure prisma directory exists
const prismaDir = path.dirname(DB_PATH)
if (!fs.existsSync(prismaDir)) {
  fs.mkdirSync(prismaDir, { recursive: true })
}

// Initialize database
const db = new Database(DB_PATH)
db.pragma("journal_mode = WAL")

console.log(`📦 Initializing database at: ${DB_PATH}`)

// ===========================================
// CREATE TABLES
// ===========================================

console.log("🔨 Creating tables...")

db.exec(`
  -- Drop tables if exist (for clean reset)
  DROP TABLE IF EXISTS DocumentStat;
  DROP TABLE IF EXISTS Document;
  DROP TABLE IF EXISTS Category;
  DROP TABLE IF EXISTS DailyStat;
  DROP TABLE IF EXISTS KioskSession;
  DROP TABLE IF EXISTS SyncLog;
  DROP TABLE IF EXISTS Setting;

  -- Category table
  CREATE TABLE Category (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    "order" INTEGER DEFAULT 0,
    isActive INTEGER DEFAULT 1,
    createdAt TEXT DEFAULT (datetime('now')),
    updatedAt TEXT DEFAULT (datetime('now'))
  );

  -- Document table
  CREATE TABLE Document (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    categoryId TEXT NOT NULL,
    filePath TEXT NOT NULL,
    fileSize INTEGER NOT NULL,
    qrCode TEXT,
    downloadUrl TEXT,
    version TEXT DEFAULT '1.0',
    isActive INTEGER DEFAULT 1,
    isFeatured INTEGER DEFAULT 0,
    viewCount INTEGER DEFAULT 0,
    downloadCount INTEGER DEFAULT 0,
    createdAt TEXT DEFAULT (datetime('now')),
    updatedAt TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (categoryId) REFERENCES Category(id) ON DELETE CASCADE
  );

  CREATE INDEX idx_document_categoryId ON Document(categoryId);
  CREATE INDEX idx_document_isActive ON Document(isActive);
  CREATE INDEX idx_document_isFeatured ON Document(isFeatured);

  -- DocumentStat table
  CREATE TABLE DocumentStat (
    id TEXT PRIMARY KEY,
    documentId TEXT NOT NULL,
    action TEXT NOT NULL,
    ipAddress TEXT,
    userAgent TEXT,
    sessionId TEXT,
    createdAt TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (documentId) REFERENCES Document(id) ON DELETE CASCADE
  );

  CREATE INDEX idx_documentstat_documentId ON DocumentStat(documentId);
  CREATE INDEX idx_documentstat_action ON DocumentStat(action);
  CREATE INDEX idx_documentstat_createdAt ON DocumentStat(createdAt);

  -- DailyStat table
  CREATE TABLE DailyStat (
    id TEXT PRIMARY KEY,
    date TEXT UNIQUE NOT NULL,
    totalViews INTEGER DEFAULT 0,
    totalDownloads INTEGER DEFAULT 0,
    totalQrScans INTEGER DEFAULT 0,
    uniqueVisitors INTEGER DEFAULT 0,
    createdAt TEXT DEFAULT (datetime('now')),
    updatedAt TEXT DEFAULT (datetime('now'))
  );

  CREATE INDEX idx_dailystat_date ON DailyStat(date);

  -- KioskSession table
  CREATE TABLE KioskSession (
    id TEXT PRIMARY KEY,
    sessionToken TEXT UNIQUE NOT NULL,
    startedAt TEXT DEFAULT (datetime('now')),
    endedAt TEXT,
    pageViews INTEGER DEFAULT 0,
    documentsViewed INTEGER DEFAULT 0,
    lastActivity TEXT DEFAULT (datetime('now'))
  );

  CREATE INDEX idx_kiosksession_startedAt ON KioskSession(startedAt);

  -- SyncLog table
  CREATE TABLE SyncLog (
    id TEXT PRIMARY KEY,
    syncType TEXT NOT NULL,
    status TEXT NOT NULL,
    recordsSync INTEGER DEFAULT 0,
    errorMessage TEXT,
    startedAt TEXT DEFAULT (datetime('now')),
    completedAt TEXT
  );

  CREATE INDEX idx_synclog_status ON SyncLog(status);
  CREATE INDEX idx_synclog_startedAt ON SyncLog(startedAt);

  -- Setting table
  CREATE TABLE Setting (
    id TEXT PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    type TEXT DEFAULT 'string',
    createdAt TEXT DEFAULT (datetime('now')),
    updatedAt TEXT DEFAULT (datetime('now'))
  );
`)

console.log("✅ Tables created successfully")

// ===========================================
// SEED CATEGORIES
// ===========================================

console.log("📁 Seeding categories...")

const categories = [
  { name: "Standar Pelayanan", slug: "standar-pelayanan", description: "Standar pelayanan publik DPMPTSP", icon: "FileCheck", order: 1 },
  { name: "SOP", slug: "sop", description: "Standar Operasional Prosedur", icon: "ClipboardList", order: 2 },
  { name: "Formulir", slug: "formulir", description: "Formulir dan blanko perizinan", icon: "FileText", order: 3 },
  { name: "Pedoman", slug: "pedoman", description: "Pedoman dan panduan layanan", icon: "BookOpen", order: 4 },
  { name: "Surat Edaran", slug: "surat-edaran", description: "Surat edaran dan pengumuman", icon: "Mail", order: 5 },
  { name: "Lainnya", slug: "lainnya", description: "Dokumen lainnya", icon: "Folder", order: 6 },
]

const insertCategory = db.prepare(`
  INSERT INTO Category (id, name, slug, description, icon, "order", isActive)
  VALUES (?, ?, ?, ?, ?, ?, 1)
`)

const categoryIds: Record<string, string> = {}

for (const cat of categories) {
  const id = `cat_${cat.slug.replace(/-/g, "_")}`
  categoryIds[cat.slug] = id
  insertCategory.run(id, cat.name, cat.slug, cat.description, cat.icon, cat.order)
}

console.log(`✅ Created ${categories.length} categories`)

// ===========================================
// SEED SETTINGS
// ===========================================

console.log("⚙️ Seeding settings...")

const settings = [
  { key: "kiosk_name", value: "DPMPTSP Kiosk", type: "string" },
  { key: "kiosk_location", value: "Lobby Utama", type: "string" },
  { key: "idle_timeout", value: "180", type: "number" },
  { key: "sync_interval", value: "3600", type: "number" },
  { key: "auto_sync_enabled", value: "false", type: "boolean" },
  { key: "maintenance_mode", value: "false", type: "boolean" },
  { key: "organization_name", value: "DPMPTSP", type: "string" },
  { key: "organization_logo", value: "/images/logo-dpmptsp.png", type: "string" },
  { key: "theme_primary_color", value: "#1e40af", type: "string" },
  { key: "theme_secondary_color", value: "#3b82f6", type: "string" },
]

const insertSetting = db.prepare(`
  INSERT INTO Setting (id, key, value, type)
  VALUES (?, ?, ?, ?)
`)

for (const setting of settings) {
  insertSetting.run(randomUUID(), setting.key, setting.value, setting.type)
}

console.log(`✅ Created ${settings.length} settings`)

// ===========================================
// SEED SAMPLE DOCUMENTS
// ===========================================

console.log("📄 Seeding sample documents...")

const documents = [
  {
    title: "Standar Pelayanan Izin Usaha Mikro Kecil (IUMK)",
    slug: "sp-iumk",
    description: "Standar pelayanan untuk penerbitan Izin Usaha Mikro Kecil sesuai dengan Peraturan Pemerintah",
    categorySlug: "standar-pelayanan",
    filePath: "/uploads/documents/sp-iumk.pdf",
    fileSize: 524288,
    version: "1.0",
    isFeatured: true,
  },
  {
    title: "Standar Pelayanan Izin Lokasi",
    slug: "sp-izin-lokasi",
    description: "Standar pelayanan untuk penerbitan izin lokasi kegiatan usaha",
    categorySlug: "standar-pelayanan",
    filePath: "/uploads/documents/sp-izin-lokasi.pdf",
    fileSize: 614400,
    version: "1.0",
    isFeatured: true,
  },
  {
    title: "SOP Pendaftaran NIB",
    slug: "sop-nib",
    description: "Prosedur operasional standar pendaftaran Nomor Induk Berusaha melalui OSS",
    categorySlug: "sop",
    filePath: "/uploads/documents/sop-nib.pdf",
    fileSize: 409600,
    version: "2.0",
    isFeatured: false,
  },
  {
    title: "SOP Penerbitan Izin Usaha",
    slug: "sop-izin-usaha",
    description: "Prosedur operasional standar penerbitan berbagai jenis izin usaha",
    categorySlug: "sop",
    filePath: "/uploads/documents/sop-izin-usaha.pdf",
    fileSize: 358400,
    version: "1.5",
    isFeatured: false,
  },
  {
    title: "Formulir Permohonan Izin Lokasi",
    slug: "form-izin-lokasi",
    description: "Formulir permohonan izin lokasi untuk kegiatan usaha",
    categorySlug: "formulir",
    filePath: "/uploads/documents/form-izin-lokasi.pdf",
    fileSize: 204800,
    version: "1.0",
    isFeatured: false,
  },
  {
    title: "Formulir Permohonan SIUP",
    slug: "form-siup",
    description: "Formulir permohonan Surat Izin Usaha Perdagangan",
    categorySlug: "formulir",
    filePath: "/uploads/documents/form-siup.pdf",
    fileSize: 184320,
    version: "1.0",
    isFeatured: false,
  },
  {
    title: "Panduan Penggunaan OSS",
    slug: "panduan-oss",
    description: "Panduan lengkap penggunaan sistem Online Single Submission untuk perizinan berusaha",
    categorySlug: "pedoman",
    filePath: "/uploads/documents/panduan-oss.pdf",
    fileSize: 1048576,
    version: "3.0",
    isFeatured: true,
  },
  {
    title: "Panduan Investasi Daerah",
    slug: "panduan-investasi",
    description: "Panduan bagi investor untuk berinvestasi di daerah",
    categorySlug: "pedoman",
    filePath: "/uploads/documents/panduan-investasi.pdf",
    fileSize: 819200,
    version: "2.0",
    isFeatured: false,
  },
  {
    title: "Surat Edaran Jam Pelayanan",
    slug: "se-jam-pelayanan",
    description: "Informasi jam operasional pelayanan DPMPTSP",
    categorySlug: "surat-edaran",
    filePath: "/uploads/documents/se-jam-pelayanan.pdf",
    fileSize: 102400,
    version: "1.0",
    isFeatured: false,
  },
]

const insertDocument = db.prepare(`
  INSERT INTO Document (id, title, slug, description, categoryId, filePath, fileSize, version, isFeatured, isActive)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
`)

for (const doc of documents) {
  const categoryId = categoryIds[doc.categorySlug]
  if (categoryId) {
    insertDocument.run(
      randomUUID(),
      doc.title,
      doc.slug,
      doc.description,
      categoryId,
      doc.filePath,
      doc.fileSize,
      doc.version,
      doc.isFeatured ? 1 : 0
    )
  }
}

console.log(`✅ Created ${documents.length} sample documents`)

// ===========================================
// SEED INITIAL STATS
// ===========================================

console.log("📊 Initializing daily stats...")

const today = new Date().toISOString().split("T")[0]
const insertDailyStat = db.prepare(`
  INSERT INTO DailyStat (id, date, totalViews, totalDownloads, totalQrScans, uniqueVisitors)
  VALUES (?, ?, 0, 0, 0, 0)
`)
insertDailyStat.run(randomUUID(), today)

console.log("✅ Daily stats initialized")

// ===========================================
// CLOSE DATABASE
// ===========================================

db.close()

console.log("")
console.log("🎉 Database setup completed successfully!")
console.log(`📍 Database location: ${DB_PATH}`)
console.log("")
console.log("Next steps:")
console.log("1. Run: npx prisma generate")
console.log("2. Start your app: npm run dev")
