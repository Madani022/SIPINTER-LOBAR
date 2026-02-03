// Client-side upload utilities

export interface UploadResult {
  success: boolean
  data?: {
    filename: string
    originalName: string
    filePath: string
    fileSize: number
    mimeType: string
  }
  error?: string
}

export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

/**
 * Upload a file to the server
 */
export async function uploadFile(
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> {
  return new Promise((resolve) => {
    const formData = new FormData()
    formData.append("file", file)

    const xhr = new XMLHttpRequest()

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress({
          loaded: event.loaded,
          total: event.total,
          percentage: Math.round((event.loaded / event.total) * 100),
        })
      }
    })

    xhr.addEventListener("load", () => {
      try {
        const response = JSON.parse(xhr.responseText)
        resolve(response)
      } catch {
        resolve({ success: false, error: "Failed to parse response" })
      }
    })

    xhr.addEventListener("error", () => {
      resolve({ success: false, error: "Upload failed" })
    })

    xhr.open("POST", "/api/upload")
    xhr.send(formData)
  })
}

/**
 * Delete a file from the server
 */
export async function deleteFile(filePath: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`/api/upload?path=${encodeURIComponent(filePath)}`, {
      method: "DELETE",
    })

    return await response.json()
  } catch {
    return { success: false, error: "Failed to delete file" }
  }
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

/**
 * Validate file before upload
 */
export function validateFile(
  file: File,
  options: {
    maxSize?: number // in bytes
    allowedTypes?: string[]
  } = {}
): { valid: boolean; error?: string } {
  const { maxSize = 50 * 1024 * 1024, allowedTypes = ["application/pdf"] } = options

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${allowedTypes.join(", ")}`,
    }
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File too large. Maximum size: ${formatFileSize(maxSize)}`,
    }
  }

  return { valid: true }
}
