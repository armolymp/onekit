"use client"

import { DownloadButton, triggerDownload } from "@/components/download-button"
import { Button } from "@/components/ui/button"
import { formatBytes, savingsLabel } from "@/lib/format"

export type FileResult = {
  filename: string
  blob: Blob
  beforeBytes?: number
}

export function ResultList({ items }: { items: FileResult[] }) {
  if (items.length === 0) return null
  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-medium">Ready to download</h2>
        {items.length > 1 ? (
          <Button
            type="button"
            variant="outline"
            className="h-11"
            onClick={() => {
              items.forEach((item, index) => {
                window.setTimeout(() => triggerDownload(item.blob, item.filename), index * 300)
              })
            }}
          >
            Download all
          </Button>
        ) : null}
      </div>
      <ul className="grid gap-2">
        {items.map((item, index) => (
          <li
            key={`${item.filename}-${index}`}
            className="flex flex-col gap-3 rounded-xl bg-secondary/70 p-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{item.filename}</p>
              <p className="text-xs text-muted-foreground">
                {formatBytes(item.blob.size)}
                {item.beforeBytes != null
                  ? ` · ${savingsLabel(item.beforeBytes, item.blob.size)} · was ${formatBytes(item.beforeBytes)}`
                  : ""}
              </p>
            </div>
            <DownloadButton blob={item.blob} filename={item.filename} />
          </li>
        ))}
      </ul>
    </div>
  )
}
