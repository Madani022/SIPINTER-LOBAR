"use server"

import prisma from "@/lib/prisma"
import { isAuthenticated } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import type { CreateCategoryInput, UpdateCategoryInput, ApiResponse } from "@/lib/types"

// ===========================================
// CATEGORY CRUD OPERATIONS
// ===========================================

/**
 * Get all categories with document counts
 */
export async function getCategories(includeInactive = false) {
  try {
    const where = includeInactive ? {} : { isActive: true }

    const categories = await prisma.category.findMany({
      where,
      include: {
        _count: {
          select: { documents: true },
        },
      },
      orderBy: { order: "asc" },
    })

    return { success: true, data: categories }
  } catch (error) {
    console.error("Error fetching categories:", error)
    return { success: false, error: "Failed to fetch categories" }
  }
}

/**
 * Get a single category by ID or slug
 */
export async function getCategory(idOrSlug: string) {
  try {
    const category = await prisma.category.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        documents: {
          where: { isActive: true },
          orderBy: { title: "asc" },
        },
        _count: {
          select: { documents: true },
        },
      },
    })

    if (!category) {
      return { success: false, error: "Category not found" }
    }

    return { success: true, data: category }
  } catch (error) {
    console.error("Error fetching category:", error)
    return { success: false, error: "Failed to fetch category" }
  }
}

/**
 * Create a new category (requires auth)
 */
export async function createCategory(
  input: CreateCategoryInput
): Promise<ApiResponse> {
  try {
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return { success: false, error: "Unauthorized" }
    }

    // Generate slug if not provided
    const slug =
      input.slug ||
      input.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")

    // Check for duplicate slug
    const existing = await prisma.category.findUnique({ where: { slug } })
    if (existing) {
      return { success: false, error: "A category with this slug already exists" }
    }

    // Get max order
    const maxOrder = await prisma.category.aggregate({
      _max: { order: true },
    })
    const order = input.order ?? (maxOrder._max.order || 0) + 1

    const category = await prisma.category.create({
      data: {
        ...input,
        slug,
        order,
      },
    })

    revalidatePath("/admin/documents")
    revalidatePath("/documents")

    return { success: true, data: category, message: "Category created successfully" }
  } catch (error) {
    console.error("Error creating category:", error)
    return { success: false, error: "Failed to create category" }
  }
}

/**
 * Update an existing category (requires auth)
 */
export async function updateCategory(
  id: string,
  input: UpdateCategoryInput
): Promise<ApiResponse> {
  try {
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return { success: false, error: "Unauthorized" }
    }

    const category = await prisma.category.update({
      where: { id },
      data: input,
    })

    revalidatePath("/admin/documents")
    revalidatePath("/documents")

    return { success: true, data: category, message: "Category updated successfully" }
  } catch (error) {
    console.error("Error updating category:", error)
    return { success: false, error: "Failed to update category" }
  }
}

/**
 * Delete a category (requires auth)
 */
export async function deleteCategory(id: string): Promise<ApiResponse> {
  try {
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return { success: false, error: "Unauthorized" }
    }

    // Check if category has documents
    const category = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { documents: true } } },
    })

    if (!category) {
      return { success: false, error: "Category not found" }
    }

    if (category._count.documents > 0) {
      return {
        success: false,
        error: `Cannot delete category with ${category._count.documents} documents. Move or delete documents first.`,
      }
    }

    await prisma.category.delete({ where: { id } })

    revalidatePath("/admin/documents")
    revalidatePath("/documents")

    return { success: true, message: "Category deleted successfully" }
  } catch (error) {
    console.error("Error deleting category:", error)
    return { success: false, error: "Failed to delete category" }
  }
}

/**
 * Reorder categories (requires auth)
 */
export async function reorderCategories(
  orderedIds: string[]
): Promise<ApiResponse> {
  try {
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return { success: false, error: "Unauthorized" }
    }

    // Update order for each category
    await Promise.all(
      orderedIds.map((id, index) =>
        prisma.category.update({
          where: { id },
          data: { order: index + 1 },
        })
      )
    )

    revalidatePath("/admin/documents")
    revalidatePath("/documents")

    return { success: true, message: "Categories reordered successfully" }
  } catch (error) {
    console.error("Error reordering categories:", error)
    return { success: false, error: "Failed to reorder categories" }
  }
}

/**
 * Toggle category active status (requires auth)
 */
export async function toggleCategoryStatus(id: string): Promise<ApiResponse> {
  try {
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return { success: false, error: "Unauthorized" }
    }

    const category = await prisma.category.findUnique({ where: { id } })
    if (!category) {
      return { success: false, error: "Category not found" }
    }

    const updated = await prisma.category.update({
      where: { id },
      data: { isActive: !category.isActive },
    })

    revalidatePath("/admin/documents")
    revalidatePath("/documents")

    return {
      success: true,
      data: updated,
      message: `Category ${updated.isActive ? "activated" : "deactivated"} successfully`,
    }
  } catch (error) {
    console.error("Error toggling category status:", error)
    return { success: false, error: "Failed to update category status" }
  }
}
