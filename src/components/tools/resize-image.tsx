"use client"

import { useState } from "react"
import { ChoiceGroup } from "@/components/choice-group"
import { FileDropzone } from "@/components/file-dropzone"
import { ProgressBar } from "@/components/progress-bar"
import { ResultList, type FileResult } from "@/components/result-list"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { errorText, outputName } from "@/lib/format"
import { extensionForMime, renderImageFile, type RasterFormat } from "@/lib/image"

type Mode = "width" | "height" | "exact"
type Output = "keep" | RasterFormat

export function ResizeImageTool() {
  const [files, setFiles] = useState<File[]>([])
  const [mode, setMode] = useState<Mode>("width")
  const [width, setWidth] = useState("1200")
  const [height, setHeight] = useState("1200")
  const [format, setFormat] = useState<Output>("keep")
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<FileResult[]>([])

  function readDimension(value: string): number | null {
    const number = Number(value)
    if (!Number.isFinite(number) || number < 1 || number > 8000) return null
    return Math.round(number)
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (files.length === 0) return
    const targetWidth = readDimension(width)
    const targetHeight = readDimension(height)
    if ((mode === "width" || mode === "exact") && targetWidth == null) {
      setError("Enter a width between 1 and 8000 pixels.")
      return
    }
    if ((mode === "height" || mode === "exact") && targetHeight == null) {
      setError("Enter a height between 1 and 8000 pixels.")
      return
    }
    setBusy(true)
    setError(null)
    setResults([])
    try {
      const next: FileResult[] = []
      for (let index = 0; index < files.length; index += 1) {
        const file = files[index]
        const bitmap = await createImageBitmap(file)
        const aspect = bitmap.width / bitmap.height
        bitmap.close()
        let outWidth = targetWidth ?? bitmap.width
        let outHeight = targetHeight ?? bitmap.height
        if (mode === "width" && targetWidth) {
          outWidth = targetWidth
          outHeight = Math.max(1, Math.round(targetWidth / aspect))
        }
        if (mode === "height" && targetHeight) {
          outHeight = targetHeight
          outWidth = Math.max(1, Math.round(targetHeight * aspect))
        }
        const type = format === "keep" ? file.type || "image/png" : format
        const blob = await renderImageFile(file, {
          width: outWidth,
          height: outHeight,
          type,
          quality: 0.92,
        })
        next.push({
          filename: outputName(file.name, extensionForMime(blob.type || type)),
          blob,
          beforeBytes: file.size,
        })
        setProgress(Math.round(((index + 1) / files.length) * 100))
      }
      setResults(next)
    } catch (caught) {
      setError(errorText(caught, "Those images couldn't be resized."))
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      <FileDropzone
        accept="image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp"
        multiple
        maxFiles={20}
        files={files}
        disabled={busy}
        title="Drop images here"
        description="Set one side and proportions stay intact, or set both to stretch."
        onFilesChange={(next) => {
          setFiles(next)
          setResults([])
          setError(null)
        }}
        onReject={setError}
      />
      <ChoiceGroup
        label="Resize by"
        value={mode}
        onChange={setMode}
        options={[
          { value: "width", label: "Width", hint: "Height follows" },
          { value: "height", label: "Height", hint: "Width follows" },
          { value: "exact", label: "Exact", hint: "May stretch" },
        ]}
      />
      <div className="grid grid-cols-2 gap-3">
        {mode !== "height" ? (
          <div className="grid gap-2">
            <Label htmlFor="resize-width">Width (px)</Label>
            <Input
              id="resize-width"
              className="h-11"
              inputMode="numeric"
              value={width}
              disabled={busy}
              onChange={(event) => setWidth(event.target.value)}
            />
          </div>
        ) : null}
        {mode !== "width" ? (
          <div className="grid gap-2">
            <Label htmlFor="resize-height">Height (px)</Label>
            <Input
              id="resize-height"
              className="h-11"
              inputMode="numeric"
              value={height}
              disabled={busy}
              onChange={(event) => setHeight(event.target.value)}
            />
          </div>
        ) : null}
      </div>
      <ChoiceGroup
        label="Format"
        value={format}
        onChange={setFormat}
        options={[
          { value: "keep", label: "Keep" },
          { value: "image/jpeg", label: "JPEG" },
          { value: "image/png", label: "PNG" },
          { value: "image/webp", label: "WebP" },
        ]}
      />
      {busy ? <ProgressBar value={progress} label="Resizing" /> : null}
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <Button type="submit" className="h-12 w-full" disabled={busy || files.length === 0}>
        {busy ? "Resizing…" : "Resize images"}
      </Button>
      <ResultList items={results} />
    </form>
  )
}
