import { createHash } from "crypto"

/**
 * Mengubah password teks biasa menjadi hash SHA-256
 * (Digunakan saat Register atau Seeding)
 */
export function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex")
}

/**
 * Memverifikasi apakah password input cocok dengan hash di database
 * (Digunakan saat Login)
 */
export function verifyPassword(plainPassword: string, savedHash: string): boolean {
  const hashedInput = hashPassword(plainPassword)
  return hashedInput === savedHash
}