"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatBytes } from "@/lib/format"
import { cn } from "@/lib/utils"

function fileMatchesAccept(file: File, accept: string): boolean {
  const tokens = accept
    .split(",")
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean)
  if (tokens.length === 0) return true
  const name = file.name.toLowerCase()
  const type = file.type.toLowerCase()
  return tokens.some((token) => {
    if (token.startsWith(".")) return name.endsWith(token)
    if (token.endsWith("/*")) return type.startsWith(token.slice(0, -1))
    return type === token
  })
}

export function FileDropzone({
  accept,
  multiple = false,
  files,
  onFilesChange,
  reorder = false,
  maxFiles = 20,
  title,
  description,
  disabled = false,
  onReject,
}: {
  accept: string
  multiple?: boolean
  files: File[]
  onFilesChange: (files: File[]) => void
  reorder?: boolean
  maxFiles?: number
  title: string
  description: string
  disabled?: boolean
  onReject?: (message: string) => void
}) {
  const [dragging, setDragging] = useState(false)

  function addFiles(list: FileList | File[]) {
    const incoming = Array.from(list)
    const accepted: File[] = []
    const rejected: string[] = []
    for (const file of incoming) {
      if (file.size === 0) {
        rejected.push(file.name || "empty file")
        continue
      }
      if (!fileMatchesAccept(file, accept)) {
        rejected.push(file.name)
        continue
      }
      accepted.push(file)
    }
    if (rejected.length > 0) {
      onReject?.(`Skipped ${rejected.join(", ")}. Use the file types listed above.`)
    }
    if (accepted.length === 0) return
    if (!multiple) {
      onFilesChange(accepted.slice(0, 1))
      return
    }
    const next = [...files, ...accepted]
    if (next.length > maxFiles) {
      onReject?.(`You can add up to ${maxFiles} files.`)
      onFilesChange(next.slice(0, maxFiles))
      return
    }
    onFilesChange(next)
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= files.length) return
    const next = files.slice()
    const [item] = next.splice(index, 1)
    next.splice(target, 0, item)
    onFilesChange(next)
  }

  return (
    <div className="grid gap-3">
      <div
        className={cn(
          "relative rounded-2xl border-2 border-dashed px-4 py-8 transition-colors sm:py-10",
          dragging ? "border-primary bg-primary/5" : "border-border bg-background",
          disabled && "pointer-events-none opacity-60",
        )}
        onDragEnter={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault()
          setDragging(false)
          if (event.dataTransfer.files.length > 0) addFiles(event.dataTransfer.files)
        }}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          aria-label={title}
          className="absolute inset-0 z-10 cursor-pointer opacity-0"
          onChange={(event) => {
            if (event.target.files) addFiles(event.target.files)
            event.target.value = ""
          }}
        />
        <div className="pointer-events-none mx-auto flex max-w-sm flex-col items-center text-center">
          <span className="mb-3 grid size-11 place-items-center rounded-full bg-secondary text-secondary-foreground">
            <Upload className="size-5" />
          </span>
          <p className="text-base font-medium">{title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {files.length > 0 ? (
        <ul className="grid gap-2">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
              className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
              </div>
              {reorder ? (
                <div className="flex shrink-0">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-11"
                    aria-label={`Move ${file.name} up`}
                    disabled={disabled || index === 0}
                    onClick={() => move(index, -1)}
                  >
                    <ChevronUp />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-11"
                    aria-label={`Move ${file.name} down`}
                    disabled={disabled || index === files.length - 1}
                    onClick={() => move(index, 1)}
                  >
                    <ChevronDown />
                  </Button>
                </div>
              ) : null}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-11 shrink-0"
                aria-label={`Remove ${file.name}`}
                disabled={disabled}
                onClick={() => onFilesChange(files.filter((_, itemIndex) => itemIndex !== index))}
              >
                <X />
              </Button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
