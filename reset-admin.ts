import { PrismaClient } from "@prisma/client"
import { createHash } from "crypto"

const prisma = new PrismaClient()

async function main() {
  console.log("🔄 Sedang membuat user admin...")

  // 1. Hapus User Lama (Kalau ada, biar gak duplikat)
  try {
    await prisma.adminUser.delete({ where: { username: "admin" } })
    console.log("🗑️  User lama dihapus.")
  } catch (e) {
    // User belum ada, lanjut aja
  }

  // 2. Buat Password Hash (SHA-256)
  // Password-nya: "lobar123"
  const passwordHash = createHash("sha256").update("lobar123").digest("hex")

  // 3. Masukkan ke Database
  await prisma.adminUser.create({
    data: {
      username: "admin",
      passwordHash: passwordHash,
      email: "admin@dpmptsp-lobar.go.id",
      isActive: true,
    },
  })

  console.log("\n✅ SUKSES! User Admin berhasil dibuat.")
  console.log("👤 Username: admin")
  console.log("🔑 Password: lobar123")
  console.log("🔒 Hash di DB: " + passwordHash)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })