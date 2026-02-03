-- ===========================================
-- DPMPTSP Kiosk System - Database Schema
-- SQLite Database Initialization
-- ===========================================

-- Drop tables if exist (for clean reset)
DROP TABLE IF EXISTS DocumentStat;
DROP TABLE IF EXISTS Document;
DROP TABLE IF EXISTS Category;
DROP TABLE IF EXISTS DailyStat;
DROP TABLE IF EXISTS KioskSession;
DROP TABLE IF EXISTS SyncLog;
DROP TABLE IF EXISTS Setting;

-- ===========================================
-- DOCUMENT MANAGEMENT
-- ===========================================

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

-- ===========================================
-- ANALYTICS & STATISTICS
-- ===========================================

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

-- ===========================================
-- SYNC MANAGEMENT
-- ===========================================

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

-- ===========================================
-- SYSTEM SETTINGS
-- ===========================================

CREATE TABLE Setting (
    id TEXT PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    type TEXT DEFAULT 'string',
    createdAt TEXT DEFAULT (datetime('now')),
    updatedAt TEXT DEFAULT (datetime('now'))
);

-- ===========================================
-- SEED DATA: Categories
-- ===========================================

INSERT INTO Category (id, name, slug, description, icon, "order", isActive) VALUES
('cat_sp', 'Standar Pelayanan', 'standar-pelayanan', 'Standar pelayanan publik DPMPTSP', 'FileCheck', 1, 1),
('cat_sop', 'SOP', 'sop', 'Standar Operasional Prosedur', 'ClipboardList', 2, 1),
('cat_formulir', 'Formulir', 'formulir', 'Formulir dan blanko perizinan', 'FileText', 3, 1),
('cat_pedoman', 'Pedoman', 'pedoman', 'Pedoman dan panduan layanan', 'BookOpen', 4, 1),
('cat_surat_edaran', 'Surat Edaran', 'surat-edaran', 'Surat edaran dan pengumuman', 'Mail', 5, 1),
('cat_lainnya', 'Lainnya', 'lainnya', 'Dokumen lainnya', 'Folder', 6, 1);

-- ===========================================
-- SEED DATA: Default Settings
-- ===========================================

INSERT INTO Setting (id, key, value, type) VALUES
('set_1', 'kiosk_name', 'DPMPTSP Kiosk', 'string'),
('set_2', 'kiosk_location', 'Lobby Utama', 'string'),
('set_3', 'idle_timeout', '180', 'number'),
('set_4', 'sync_interval', '3600', 'number'),
('set_5', 'auto_sync_enabled', 'false', 'boolean'),
('set_6', 'maintenance_mode', 'false', 'boolean'),
('set_7', 'organization_name', 'DPMPTSP', 'string'),
('set_8', 'organization_logo', '/images/logo-dpmptsp.png', 'string');

-- ===========================================
-- SEED DATA: Sample Documents
-- ===========================================

INSERT INTO Document (id, title, slug, description, categoryId, filePath, fileSize, version, isFeatured, isActive) VALUES
('doc_1', 'Standar Pelayanan Izin Usaha Mikro Kecil (IUMK)', 'sp-iumk', 'Standar pelayanan untuk penerbitan Izin Usaha Mikro Kecil', 'cat_sp', '/uploads/documents/sp-iumk.pdf', 524288, '1.0', 1, 1),
('doc_2', 'Standar Pelayanan Izin Lokasi', 'sp-izin-lokasi', 'Standar pelayanan untuk penerbitan izin lokasi', 'cat_sp', '/uploads/documents/sp-izin-lokasi.pdf', 614400, '1.0', 1, 1),
('doc_3', 'SOP Pendaftaran NIB', 'sop-nib', 'Prosedur operasional standar pendaftaran Nomor Induk Berusaha', 'cat_sop', '/uploads/documents/sop-nib.pdf', 409600, '2.0', 0, 1),
('doc_4', 'Formulir Permohonan Izin Lokasi', 'form-izin-lokasi', 'Formulir permohonan izin lokasi untuk kegiatan usaha', 'cat_formulir', '/uploads/documents/form-izin-lokasi.pdf', 204800, '1.0', 0, 1),
('doc_5', 'Panduan Penggunaan OSS', 'panduan-oss', 'Panduan lengkap penggunaan sistem Online Single Submission', 'cat_pedoman', '/uploads/documents/panduan-oss.pdf', 1048576, '3.0', 1, 1);

-- ===========================================
-- SEED DATA: Initial Daily Stats
-- ===========================================

INSERT INTO DailyStat (id, date, totalViews, totalDownloads, totalQrScans, uniqueVisitors) VALUES
('stat_today', date('now'), 0, 0, 0, 0);

-- ===========================================
-- Database initialization complete!
-- ===========================================
