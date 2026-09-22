export type RasterFormat = "image/jpeg" | "image/png" | "image/webp"

type Source = {
  width: number
  height: number
  draw: (ctx: CanvasRenderingContext2D, width: number, height: number) => void
  close: () => void
}

async function loadSource(file: File): Promise<Source> {
  try {
    const bitmap = await createImageBitmap(file)
    return {
      width: bitmap.width,
      height: bitmap.height,
      draw: (ctx, width, height) => ctx.drawImage(bitmap, 0, 0, width, height),
      close: () => bitmap.close(),
    }
  } catch {
    const url = URL.createObjectURL(file)
    try {
      const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const element = new Image()
        element.onload = () => resolve(element)
        element.onerror = () => reject(new Error("This image couldn't be opened."))
        element.src = url
      })
      return {
        width: image.naturalWidth,
        height: image.naturalHeight,
        draw: (ctx, width, height) => ctx.drawImage(image, 0, 0, width, height),
        close: () => URL.revokeObjectURL(url),
      }
    } catch (error) {
      URL.revokeObjectURL(url)
      throw error instanceof Error ? error : new Error("This image couldn't be opened.")
    }
  }
}

function canvasBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("This browser couldn't encode that image."))
          return
        }
        resolve(blob)
      },
      type,
      quality,
    )
  })
}

export async function renderImageFile(
  file: File,
  options: {
    width?: number
    height?: number
    maxEdge?: number
    type: string
    quality: number
  },
): Promise<Blob> {
  const source = await loadSource(file)
  try {
    if (source.width < 1 || source.height < 1) {
      throw new Error("This image has no visible pixels.")
    }

    let width = options.width ?? source.width
    let height = options.height ?? source.height

    if (options.maxEdge && options.maxEdge > 0) {
      const longest = Math.max(width, height)
      if (longest > options.maxEdge) {
        const scale = options.maxEdge / longest
        width *= scale
        height *= scale
      }
    }

    width = Math.max(1, Math.round(width))
    height = Math.max(1, Math.round(height))
    const limit = 4096
    if (width > limit || height > limit) {
      const scale = limit / Math.max(width, height)
      width = Math.max(1, Math.round(width * scale))
      height = Math.max(1, Math.round(height * scale))
    }

    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext("2d")
    if (!ctx) throw new Error("This browser can't draw images.")

    const type = options.type || "image/jpeg"
    if (type === "image/jpeg") {
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, width, height)
    }
    source.draw(ctx, width, height)
    return canvasBlob(canvas, type, options.quality)
  } finally {
    source.close()
  }
}

export async function compressImageFile(
  file: File,
  options: { maxSizeMB: number; maxEdge: number; type?: string },
  onProgress?: (value: number) => void,
): Promise<Blob> {
  try {
    const imageCompression = (await import("browser-image-compression")).default
    return await imageCompression(file, {
      maxSizeMB: options.maxSizeMB,
      maxWidthOrHeight: options.maxEdge,
      useWebWorker: true,
      initialQuality: 0.82,
      fileType: options.type,
      onProgress,
    })
  } catch {
    onProgress?.(40)
    const blob = await renderImageFile(file, {
      maxEdge: options.maxEdge,
      type: options.type || file.type || "image/jpeg",
      quality: 0.72,
    })
    onProgress?.(100)
    return blob
  }
}

export async function fileToJpegBytes(file: File, quality: number, maxEdge = 2400): Promise<Uint8Array> {
  const blob = await renderImageFile(file, { maxEdge, type: "image/jpeg", quality })
  return new Uint8Array(await blob.arrayBuffer())
}

export function extensionForMime(type: string): string {
  if (type === "image/png") return "png"
  if (type === "image/webp") return "webp"
  return "jpg"
}
