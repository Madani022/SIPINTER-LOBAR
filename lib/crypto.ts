// FILE: lib/crypto.ts
import * as crypto from "crypto"

export function hashPassword(password: string): string {
  // Ini fungsi untuk menyamakan password login dengan password di database
  return crypto.createHash("sha256").update(password).digest("hex")
}