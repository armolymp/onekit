export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "0 B"
  if (bytes < 1024) return `${Math.round(bytes)} B`
  const units = ["KB", "MB", "GB"]
  let value = bytes / 1024
  let unit = 0
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024
    unit += 1
  }
  return `${value >= 10 ? value.toFixed(0) : value.toFixed(1)} ${units[unit]}`
}

export function outputName(original: string, ext: string): string {
  const base = original.replace(/\.[^/.]+$/, "") || "onekit"
  const clean = base.replace(/[^\w.-]+/g, "-").replace(/-+/g, "-")
  return `${clean}-onekit.${ext.replace(/^\./, "")}`
}

export function savingsLabel(before: number, after: number): string {
  if (before <= 0) return ""
  const pct = Math.round((1 - after / before) * 100)
  if (pct > 0) return `${pct}% smaller`
  if (pct < 0) return `${Math.abs(pct)}% larger`
  return "Same size"
}

export function bytesToBlob(bytes: Uint8Array, type: string): Blob {
  const buffer = bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  ) as ArrayBuffer
  return new Blob([buffer], { type })
}

export function errorText(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message.trim()) return error.message
  return fallback
}

export async function readFileBytes(file: File): Promise<Uint8Array> {
  return new Uint8Array(await file.arrayBuffer())
}
