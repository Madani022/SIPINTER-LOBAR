"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// --- 1. GET DOCUMENTS ---
export async function getDocuments(filters: { 
  categoryId?: string, 
  categorySlug?: string, 
  isActive?: boolean,
  limit?: number
} = {}) {
  try {
    const whereClause: any = {}

    // Filter by ID Kategori
    if (filters.categoryId) whereClause.categoryId = filters.categoryId
    
    // Filter by Slug Kategori (Ini Slug FOLDER yang kamu maksud)
    if (filters.categorySlug) {
      whereClause.category = { slug: filters.categorySlug }
    }

    if (filters.isActive !== undefined) whereClause.isActive = filters.isActive

    const docs = await prisma.document.findMany({
      where: whereClause,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
      take: filters.limit
    })

    return { success: true, data: docs }
  } catch (error) {
    console.error("Error fetching documents:", error)
    return { success: false, error: "Gagal mengambil data dokumen" }
  }
}

// --- 2. CREATE DOCUMENT ---
export async function createDocument(data: { 
  title: string, 
  categoryId: string, 
  filePath: string, 
  fileSize: number,
  downloadUrl?: string 
}) {
  try {
    // ✅ SOLUSI DISINI:
    // Kita buat slug dokumen otomatis dari Judul.
    // Contoh Judul: "Surat Izin Usaha" -> Slug Dokumen: "surat-izin-usaha-123"
    // Ini HANYA untuk memenuhi syarat database, user tidak perlu tahu.
    
    const documentSlug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-') // Ganti spasi/simbol jadi strip
        .replace(/^-+|-+$/g, '')     // Hapus strip di awal/akhir
        + '-' + Date.now().toString().slice(-4); // Tambah angka acak biar unik

    const doc = await prisma.document.create({
      data: {
        title: data.title,
        slug: documentSlug, // <--- INI DIA YANG DITAGIH DATABASE TADI
        categoryId: data.categoryId, // Ini ID Kategori (Folder)
        filePath: data.filePath,
        fileSize: data.fileSize,
        downloadUrl: data.downloadUrl || "", 
        isActive: true,      
        isFeatured: false    
      }
    })
    
    revalidatePath("/admin") 
    revalidatePath("/kiosk")
    return { success: true, data: doc }
  } catch (error) {
    console.error("Create Error:", error)
    return { success: false, error: "Gagal membuat dokumen" }
  }
}

// --- 3. UPDATE DOCUMENT ---
export async function updateDocument(id: string, data: { 
  title?: string, 
  categoryId?: string,
  isActive?: boolean,
  downloadUrl?: string 
}) {
  try {
    const doc = await prisma.document.update({
      where: { id },
      data: { ...data }
    })
    
    revalidatePath("/admin")
    return { success: true, data: doc }
  } catch (error) {
    return { success: false, error: "Gagal update dokumen" }
  }
}

// --- 4. DELETE DOCUMENT ---
export async function deleteDocument(id: string) {
  try {
    await prisma.document.delete({ where: { id } })
    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    return { success: false, error: "Gagal hapus dokumen" }
  }
}

// --- 5. INCREMENT VIEW ---
export async function incrementViewCount(id: string) {
    try {
        await prisma.document.update({
            where: { id },
            data: { viewCount: { increment: 1 } }
        })
        return { success: true }
    } catch (e) {
        return { success: false }
    }
}