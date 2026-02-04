import { PrismaClient } from "@prisma/client"
import * as crypto from "crypto"

const prisma = new PrismaClient()

// Fungsi Hash Password (Langsung disini biar gak error import)
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex")
}

async function main() {
  console.log("🚀 Memulai restore database...")

  // 1. RESET PASSWORD ADMIN (lobar123)
  console.log("👤 Membuat akun admin...")
  const passwordAdmin = hashPassword("lobar123")
  
  await prisma.adminUser.upsert({
    where: { username: "admin" },
    update: { passwordHash: passwordAdmin }, // Paksa update password
    create: {
      username: "admin",
      passwordHash: passwordAdmin,
      email: "admin@dpmptsp-lobar.go.id",
      isActive: true,
    },
  })

  // 2. BUAT KATEGORI (Sesuai Menu Kiosk)
  console.log("📁 Membuat kategori...")
  
  const categories = [
    // --- LAYANAN PERIZINAN ---
    { name: "Standar Pelayanan", slug: "standar-pelayanan", icon: "FileText", order: 1 },
    { name: "SOP Perizinan", slug: "sop", icon: "FileCheck", order: 2 },
    { name: "SP dan SOP (Gabungan)", slug: "sp-sop", icon: "Shield", order: 3 }, 

    // --- PENANAMAN MODAL ---
    { name: "IPRO (Investasi)", slug: "ipro", icon: "Award", order: 4 },
    { name: "LKPM", slug: "lkpm", icon: "FileSpreadsheet", order: 5 },

    // --- TATA RUANG ---
    { name: "Dokumen RDTR", slug: "rdtr-dokumen", icon: "FileText", order: 6 },
    { name: "Pedoman KRK", slug: "pedoman", icon: "BookOpen", order: 7 },

    // --- MPP & INFORMASI PUBLIK ---
    { name: "Regulasi MPP", slug: "regulasi-mpp", icon: "Scale", order: 8 },
    { name: "Persyaratan Umum", slug: "persyaratan-umum", icon: "ScrollText", order: 9 },
    { name: "Struktur Organisasi", slug: "struktur", icon: "Users", order: 10 },
    { name: "Regulasi / Perda", slug: "regulasi", icon: "Scale", order: 11 },
    { name: "Formulir", slug: "formulir", icon: "FileInput", order: 12 },
    
    // --- LAINNYA ---
    { name: "Surat Edaran", slug: "surat-edaran", icon: "Mail", order: 13 },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, icon: cat.icon }, 
      create: {
        name: cat.name,
        slug: cat.slug,
        description: `Kategori dokumen untuk ${cat.name}`,
        icon: cat.icon,
        order: cat.order,
        isActive: true,
      },
    })
  }
  
  console.log("✅ Database berhasil dipulihkan!")
}

main()
  .catch((e) => {
    console.error("❌ Error seeding:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })