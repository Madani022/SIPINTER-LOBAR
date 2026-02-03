"use server"

import prisma from "@/lib/prisma"
import { isAuthenticated } from "@/lib/auth"
import type { ApiResponse } from "@/lib/types"

// ===========================================
// SETTINGS CRUD OPERATIONS
// ===========================================

/**
 * Get all settings
 */
export async function getSettings() {
  try {
    const settings = await prisma.setting.findMany({
      orderBy: { key: "asc" },
    })

    // Convert to object for easier access
    const settingsObject = settings.reduce(
      (acc, setting) => {
        let value: unknown = setting.value
        
        // Parse value based on type
        switch (setting.type) {
          case "number":
            value = parseFloat(setting.value)
            break
          case "boolean":
            value = setting.value === "true"
            break
          case "json":
            try {
              value = JSON.parse(setting.value)
            } catch {
              value = setting.value
            }
            break
        }

        acc[setting.key] = value
        return acc
      },
      {} as Record<string, unknown>
    )

    return { success: true, data: settingsObject }
  } catch (error) {
    console.error("Error fetching settings:", error)
    return { success: false, error: "Failed to fetch settings" }
  }
}

/**
 * Get a single setting by key
 */
export async function getSetting(key: string) {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key },
    })

    if (!setting) {
      return { success: false, error: "Setting not found" }
    }

    let value: unknown = setting.value
    
    switch (setting.type) {
      case "number":
        value = parseFloat(setting.value)
        break
      case "boolean":
        value = setting.value === "true"
        break
      case "json":
        try {
          value = JSON.parse(setting.value)
        } catch {
          value = setting.value
        }
        break
    }

    return { success: true, data: value }
  } catch (error) {
    console.error("Error fetching setting:", error)
    return { success: false, error: "Failed to fetch setting" }
  }
}

/**
 * Update a setting (requires auth)
 */
export async function updateSetting(
  key: string,
  value: unknown,
  type?: "string" | "number" | "boolean" | "json"
): Promise<ApiResponse> {
  try {
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return { success: false, error: "Unauthorized" }
    }

    // Convert value to string for storage
    let stringValue: string
    let valueType = type

    if (typeof value === "boolean") {
      stringValue = value.toString()
      valueType = valueType || "boolean"
    } else if (typeof value === "number") {
      stringValue = value.toString()
      valueType = valueType || "number"
    } else if (typeof value === "object") {
      stringValue = JSON.stringify(value)
      valueType = valueType || "json"
    } else {
      stringValue = String(value)
      valueType = valueType || "string"
    }

    const setting = await prisma.setting.upsert({
      where: { key },
      update: { value: stringValue, type: valueType },
      create: { key, value: stringValue, type: valueType },
    })

    return { success: true, data: setting, message: "Setting updated successfully" }
  } catch (error) {
    console.error("Error updating setting:", error)
    return { success: false, error: "Failed to update setting" }
  }
}

/**
 * Update multiple settings at once (requires auth)
 */
export async function updateSettings(
  settings: Record<string, unknown>
): Promise<ApiResponse> {
  try {
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return { success: false, error: "Unauthorized" }
    }

    const updates = Object.entries(settings).map(([key, value]) => {
      let stringValue: string
      let valueType: "string" | "number" | "boolean" | "json" = "string"

      if (typeof value === "boolean") {
        stringValue = value.toString()
        valueType = "boolean"
      } else if (typeof value === "number") {
        stringValue = value.toString()
        valueType = "number"
      } else if (typeof value === "object") {
        stringValue = JSON.stringify(value)
        valueType = "json"
      } else {
        stringValue = String(value)
      }

      return prisma.setting.upsert({
        where: { key },
        update: { value: stringValue, type: valueType },
        create: { key, value: stringValue, type: valueType },
      })
    })

    await Promise.all(updates)

    return { success: true, message: "Settings updated successfully" }
  } catch (error) {
    console.error("Error updating settings:", error)
    return { success: false, error: "Failed to update settings" }
  }
}

/**
 * Delete a setting (requires auth)
 */
export async function deleteSetting(key: string): Promise<ApiResponse> {
  try {
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return { success: false, error: "Unauthorized" }
    }

    await prisma.setting.delete({ where: { key } })

    return { success: true, message: "Setting deleted successfully" }
  } catch (error) {
    console.error("Error deleting setting:", error)
    return { success: false, error: "Failed to delete setting" }
  }
}

// ===========================================
// PREDEFINED SETTINGS HELPERS
// ===========================================

/**
 * Get kiosk configuration
 */
export async function getKioskConfig() {
  try {
    const settings = await getSettings()
    
    if (!settings.success) {
      return settings
    }

    const data = settings.data as Record<string, unknown>

    return {
      success: true,
      data: {
        kioskName: data.kiosk_name as string || "DPMPTSP Kiosk",
        kioskLocation: data.kiosk_location as string || "Lobby",
        idleTimeout: data.idle_timeout as number || 180,
        syncInterval: data.sync_interval as number || 3600,
        autoSyncEnabled: data.auto_sync_enabled as boolean || false,
        maintenanceMode: data.maintenance_mode as boolean || false,
      },
    }
  } catch (error) {
    console.error("Error fetching kiosk config:", error)
    return { success: false, error: "Failed to fetch kiosk config" }
  }
}

/**
 * Check if maintenance mode is enabled
 */
export async function isMaintenanceMode(): Promise<boolean> {
  try {
    const result = await getSetting("maintenance_mode")
    return result.success && result.data === true
  } catch {
    return false
  }
}
