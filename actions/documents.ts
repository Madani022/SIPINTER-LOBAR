"use server"

import prisma from "@/lib/prisma"
import { isAuthenticated } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import type { CreateDocumentInput, UpdateDocumentInput, ApiResponse } from "@/lib/types"

// ===========================================
// DOCUMENT CRUD OPERATIONS
// ===========================================

/**
 * Get all documents with optional filtering (VERSI DEBUGGING)
 */
export async function getDocuments(options?: {
  categoryId?: string
  categorySlug?: string
  isActive?: boolean
  limit?: number
}) {
  try {
    // [CCTV 1] Cek Apa yang diminta Frontend
    console.log("\n🔴 [DEBUG START] getDocuments Dipanggil 🔴")
    console.log("👉 Parameter dari Frontend:", JSON.stringify(options, null, 2))

    const where: any = {}

    // 1. Filter Status Aktif
    if (options?.isActive !== undefined) {
      where.isActive = options.isActive
    } else {
      where.isActive = true 
    }

    // 2. Filter by Slug (Jembatan Menu -> DB)
    if (options?.categorySlug) {
      console.log(`🔎 Mencari Kategori dengan slug: "${options.categorySlug}"...`)
      
      const category = await prisma.category.findUnique({
        where: { slug: options.categorySlug }
      })
      
      if (category) {
        // [CCTV 2] Kategori Ketemu
        console.log(`✅ KATEGORI DITEMUKAN!`)
        console.log(`   - Nama: ${category.name}`)
        console.log(`   - ID  : ${category.id}`) // <-- COCOKKAN ID INI DENGAN TABEL DOCUMENT
        
        where.categoryId = category.id
      } else {
        // [CCTV 2] Kategori Gak Ketemu
        console.log(`❌ KATEGORI TIDAK DITEMUKAN di Database!`)
        console.log(`   Solusi: Buka Prisma Studio, pastikan ada kategori dengan slug "${options.categorySlug}"`)
        
        // Stop disini dan return kosong biar gak error
        console.log("🔴 [DEBUG END] Return Kosong 🔴\n")
        return { success: true, data: [] }
      }
    }

    // 3. Filter by ID (Fallback)
    if (options?.categoryId) {
      console.log(`🔎 Mencari by ID langsung: ${options.categoryId}`)
      where.categoryId = options.categoryId
    }

    // 4. Eksekusi Query Dokumen
    console.log("⏳ Sedang mengambil dokumen dari tabel Document...")
    
    const documents = await prisma.document.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: { createdAt: "desc" },
      take: options?.limit || 100,
    })

    // [CCTV 3] Hasil Akhir
    console.log(`📄 HASIL: Ditemukan ${documents.length} dokumen.`)
    
    if (documents.length === 0) {
        console.log("⚠️  PERINGATAN: Kategori ada, tapi dokumennya 0.")
        console.log("   Cek Tabel Document: Pastikan kolom 'categoryId' isinya sama dengan ID Kategori di atas.")
    } else {
        console.log("   (Contoh Dokumen 1):", documents[0].title)
    }
    
    console.log("🔴 [DEBUG END] Selesai 🔴\n")

    return { success: true, data: documents }
  } catch (error) {
    console.error("❌ Error fetching documents:", error)
    return { success: false, error: "Failed to fetch documents" }
  }
}

/**
 * Get a single document by ID or slug
 */
export async function getDocument(idOrSlug: string) {
  try {
    const document = await prisma.document.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        category: true,
      },
    })

    if (!document) {
      return { success: false, error: "Document not found" }
    }

    return { success: true, data: document }
  } catch (error) {
    console.error("Error fetching document:", error)
    return { success: false, error: "Failed to fetch document" }
  }
}

/**
 * Create a new document (requires auth)
 */
export async function createDocument(
  input: CreateDocumentInput
): Promise<ApiResponse> {
  try {
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return { success: false, error: "Unauthorized" }
    }

    // Generate slug if not provided
    const slug =
      input.slug ||
      input.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")

    // Check for duplicate slug
    const existing = await prisma.document.findUnique({ where: { slug } })
    if (existing) {
      return { success: false, error: "A document with this slug already exists" }
    }

    const document = await prisma.document.create({
      data: {
        ...input,
        slug,
      },
      include: {
        category: true,
      },
    })

    revalidatePath("/admin/documents")
    revalidatePath("/documents")

    return { success: true, data: document, message: "Document created successfully" }
  } catch (error) {
    console.error("Error creating document:", error)
    return { success: false, error: "Failed to create document" }
  }
}

/**
 * Update an existing document (requires auth)
 */
export async function updateDocument(
  id: string,
  input: UpdateDocumentInput
): Promise<ApiResponse> {
  try {
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return { success: false, error: "Unauthorized" }
    }

    const document = await prisma.document.update({
      where: { id },
      data: input,
      include: {
        category: true,
      },
    })

    revalidatePath("/admin/documents")
    revalidatePath("/documents")
    revalidatePath(`/documents/${document.slug}`)

    return { success: true, data: document, message: "Document updated successfully" }
  } catch (error) {
    console.error("Error updating document:", error)
    return { success: false, error: "Failed to update document" }
  }
}

/**
 * Delete a document (requires auth)
 */
export async function deleteDocument(id: string): Promise<ApiResponse> {
  try {
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return { success: false, error: "Unauthorized" }
    }

    await prisma.document.delete({ where: { id } })

    revalidatePath("/admin/documents")
    revalidatePath("/documents")

    return { success: true, message: "Document deleted successfully" }
  } catch (error) {
    console.error("Error deleting document:", error)
    return { success: false, error: "Failed to delete document" }
  }
}

/**
 * Toggle document active status (requires auth)
 */
export async function toggleDocumentStatus(id: string): Promise<ApiResponse> {
  try {
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return { success: false, error: "Unauthorized" }
    }

    const document = await prisma.document.findUnique({ where: { id } })
    if (!document) {
      return { success: false, error: "Document not found" }
    }

    const updated = await prisma.document.update({
      where: { id },
      data: { isActive: !document.isActive },
    })

    revalidatePath("/admin/documents")
    revalidatePath("/documents")

    return {
      success: true,
      data: updated,
      message: `Document ${updated.isActive ? "activated" : "deactivated"} successfully`,
    }
  } catch (error) {
    console.error("Error toggling document status:", error)
    return { success: false, error: "Failed to update document status" }
  }
}

/**
 * Toggle document featured status (requires auth)
 */
export async function toggleDocumentFeatured(id: string): Promise<ApiResponse> {
  try {
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return { success: false, error: "Unauthorized" }
    }

    const document = await prisma.document.findUnique({ where: { id } })
    if (!document) {
      return { success: false, error: "Document not found" }
    }

    const updated = await prisma.document.update({
      where: { id },
      data: { isFeatured: !document.isFeatured },
    })

    revalidatePath("/admin/documents")
    revalidatePath("/documents")

    return {
      success: true,
      data: updated,
      message: `Document ${updated.isFeatured ? "featured" : "unfeatured"} successfully`,
    }
  } catch (error) {
    console.error("Error toggling featured status:", error)
    return { success: false, error: "Failed to update featured status" }
  }
}

// ===========================================
// PUBLIC DOCUMENT ACCESS
// ===========================================

/**
 * Get featured documents (public)
 */
export async function getFeaturedDocuments(limit = 6) {
  try {
    const documents = await prisma.document.findMany({
      where: {
        isActive: true,
        isFeatured: true,
      },
      include: {
        category: true,
      },
      orderBy: { viewCount: "desc" },
      take: limit,
    })

    return { success: true, data: documents }
  } catch (error) {
    console.error("Error fetching featured documents:", error)
    return { success: false, error: "Failed to fetch featured documents" }
  }
}

/**
 * Get documents by category (public)
 */
export async function getDocumentsByCategory(categorySlug: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
      include: {
        documents: {
          where: { isActive: true },
          orderBy: { title: "asc" },
        },
      },
    })

    if (!category) {
      return { success: false, error: "Category not found" }
    }

    return { success: true, data: category }
  } catch (error) {
    console.error("Error fetching documents by category:", error)
    return { success: false, error: "Failed to fetch documents" }
  }
}

/**
 * Search documents (public)
 */
export async function searchDocuments(query: string, limit = 10) {
  try {
    if (!query || query.length < 2) {
      return { success: true, data: [] }
    }

    const documents = await prisma.document.findMany({
      where: {
        isActive: true,
        OR: [
          { title: { contains: query } },
          { description: { contains: query } },
        ],
      },
      include: {
        category: true,
      },
      orderBy: { viewCount: "desc" },
      take: limit,
    })

    return { success: true, data: documents }
  } catch (error) {
    console.error("Error searching documents:", error)
    return { success: false, error: "Failed to search documents" }
  }
}