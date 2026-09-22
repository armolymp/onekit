"use client"

import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

export function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = filename
  anchor.rel = "noopener"
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 2000)
}

export function DownloadButton({
  blob,
  filename,
  label = "Download",
}: {
  blob: Blob
  filename: string
  label?: string
}) {
  return (
    <Button
      type="button"
      className="h-11 w-full sm:w-auto"
      onClick={() => triggerDownload(blob, filename)}
    >
      <Download />
      {label}
    </Button>
  )
}
