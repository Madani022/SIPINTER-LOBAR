import { PrismaClient } from "@prisma/client"
import * as crypto from "crypto"

const prisma = new PrismaClient()

// Hash password menggunakan SHA-256
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex")
}

async function main() {
  console.log("🚀 Starting database setup...")

  // 1. Create Admin User
  console.log("👤 Creating admin user...")
  await prisma.adminUser.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      passwordHash: hashPassword("lobar123"),
      email: "admin@dpmptsp-lobar.go.id",
      isActive: true,
    },
  })
  console.log("✅ Admin user created (username: admin, password: lobar123)")

  // 2. Create Categories
  console.log("📁 Creating categories...")
  const categories = [
    {
      name: "Standar Pelayanan",
      slug: "standar-pelayanan",
      description: "Standar Pelayanan (SP) untuk berbagai jenis perizinan",
      icon: "FileText",
      order: 1,
    },
    {
      name: "SOP",
      slug: "sop",
      description: "Standard Operating Procedure untuk pelayanan",
      icon: "FileCheck",
      order: 2,
    },
    {
      name: "Formulir",
      slug: "formulir",
      description: "Formulir pendaftaran dan perizinan",
      icon: "FileInput",
      order: 3,
    },
    {
      name: "Pedoman",
      slug: "pedoman",
      description: "Pedoman dan panduan tata ruang",
      icon: "Book",
      order: 4,
    },
    {
      name: "Regulasi",
      slug: "regulasi",
      description: "Peraturan daerah dan regulasi terkait",
      icon: "Scale",
      order: 5,
    },
    {
      name: "Surat Edaran",
      slug: "surat-edaran",
      description: "Surat edaran dan pengumuman resmi",
      icon: "Mail",
      order: 6,
    },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }
  console.log("✅ Categories created")

  // 3. Create Sample Documents (opsional - untuk testing)
  console.log("📄 Creating sample documents...")
  const spCategory = await prisma.category.findUnique({
    where: { slug: "standar-pelayanan" },
  })

  if (spCategory) {
    await prisma.document.upsert({
      where: { slug: "sp-izin-usaha-sample" },
      update: {},
      create: {
        title: "Standar Pelayanan Izin Usaha (Sample)",
        slug: "sp-izin-usaha-sample",
        description:
          "Standar pelayanan untuk pengurusan izin usaha di Kabupaten Lombok Barat",
        categoryId: spCategory.id,
        filePath: "/uploads/documents/sample.pdf",
        fileSize: 1024000,
        version: "1.0",
        isActive: true,
        isFeatured: true,
      },
    })
  }
  console.log("✅ Sample documents created")

  // 4. Initialize Settings
  console.log("⚙️ Creating settings...")
  const settings = [
    { key: "kiosk_name", value: "SIPINTER Kab. Lombok Barat", type: "string" },
    { key: "idle_timeout", value: "90", type: "number" },
    { key: "document_idle_timeout", value: "180", type: "number" },
    { key: "auto_sync_enabled", value: "false", type: "boolean" },
    { key: "sync_interval", value: "3600", type: "number" },
  ]

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    })
  }
  console.log("✅ Settings created")

  // 5. Initialize Daily Stats
  console.log("📊 Initializing stats...")
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  await prisma.dailyStat.upsert({
    where: { date: today },
    update: {},
    create: {
      date: today,
      totalViews: 0,
      totalDownloads: 0,
      totalQrScans: 0,
      uniqueVisitors: 0,
    },
  })
  console.log("✅ Stats initialized")

  console.log("")
  console.log("🎉 Database setup completed!")
  console.log("")
  console.log("📋 Summary:")
  console.log("   - Admin user: admin / lobar123")
  console.log("   - Categories: 6 created")
  console.log("   - Sample documents: 1 created")
  console.log("   - Settings: initialized")
  console.log("")
}

main()
  .catch((e) => {
    console.error("❌ Error during setup:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })