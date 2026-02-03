import { PrismaClient } from "@prisma/client"
import * as crypto from "crypto"

const prisma = new PrismaClient()

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex")
}

async function main() {
  console.log("🚀 Starting database seeding...")

  // 1. Setup Admin
  console.log("👤 Syncing admin user...")
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

  // 2. Setup Kategori (SESUAIKAN DENGAN KIOSK-DATA.TS)
  // Slug di sini HARUS sama persis dengan categorySlug di lib/kiosk-data.ts
  console.log("📁 Syncing categories...")
  const categories = [
    // --- Layanan Perizinan ---
    { name: "Standar Pelayanan", slug: "standar-pelayanan", icon: "FileText", description: "Dokumen SP Perizinan" },
    { name: "SOP Perizinan", slug: "sop", icon: "FileCheck", description: "Dokumen SOP" },
    
    // --- Penanaman Modal ---
    { name: "IPRO (Investasi)", slug: "ipro", icon: "Award", description: "Investment Project Ready to Offer" },
    { name: "LKPM", slug: "lkpm", icon: "FileSpreadsheet", description: "Laporan Kegiatan Penanaman Modal" },
    
    // --- Perizinan (Menu Lain) ---
    { name: "SP dan SOP", slug: "sp-sop", icon: "Shield", description: "Gabungan SP & SOP" },
    
    // --- Informasi Publik ---
    { name: "Struktur Organisasi", slug: "struktur", icon: "Users", description: "Bagan Struktur Organisasi" },
    { name: "Regulasi / Perda", slug: "regulasi", icon: "Scale", description: "Produk Hukum Daerah" },
    
    // --- Tata Ruang ---
    { name: "Pedoman KRK", slug: "pedoman", icon: "BookOpen", description: "Panduan KRK" },
    { name: "Dokumen RDTR", slug: "rdtr-dokumen", icon: "FileText", description: "Rencana Detail Tata Ruang" },
    
    // --- MPP ---
    { name: "Formulir MPP", slug: "formulir", icon: "FileInput", description: "Formulir Layanan" },
    { name: "Regulasi MPP", slug: "regulasi-mpp", icon: "Scale", description: "Regulasi Mal Pelayanan Publik" },
    { name: "Persyaratan Umum", slug: "persyaratan-umum", icon: "ScrollText", description: "Persyaratan Dasar" },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, icon: cat.icon, description: cat.description }, // Update jika nama berubah
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon,
        order: 0,
        isActive: true,
      },
    })
  }
  console.log("✅ Categories synced successfully")

  // 3. Settings Default
  const settings = [
    { key: "kiosk_name", value: "SIPINTER Kab. Lombok Barat", type: "string" },
    { key: "running_text", value: "Selamat Datang di Mal Pelayanan Publik Kabupaten Lombok Barat", type: "string" },
  ]

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    })
  }

  console.log("\n🎉 Database seeding completed! Ready to use.")
}

main()
  .catch((e) => {
    console.error("❌ Error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })