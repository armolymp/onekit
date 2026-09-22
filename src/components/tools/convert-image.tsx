"use client"

import { useState } from "react"
import { ChoiceGroup } from "@/components/choice-group"
import { FileDropzone } from "@/components/file-dropzone"
import { ProgressBar } from "@/components/progress-bar"
import { ResultList, type FileResult } from "@/components/result-list"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { errorText, outputName } from "@/lib/format"
import { extensionForMime, renderImageFile, type RasterFormat } from "@/lib/image"

export function ConvertImageTool() {
  const [files, setFiles] = useState<File[]>([])
  const [format, setFormat] = useState<RasterFormat>("image/webp")
  const [quality, setQuality] = useState(0.9)
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<FileResult[]>([])

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (files.length === 0) return
    setBusy(true)
    setError(null)
    setResults([])
    try {
      const next: FileResult[] = []
      for (let index = 0; index < files.length; index += 1) {
        const file = files[index]
        const blob = await renderImageFile(file, { type: format, quality })
        next.push({
          filename: outputName(file.name, extensionForMime(blob.type || format)),
          blob,
          beforeBytes: file.size,
        })
        setProgress(Math.round(((index + 1) / files.length) * 100))
      }
      setResults(next)
    } catch (caught) {
      setError(errorText(caught, "Those images couldn't be converted."))
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
        description="PNG, JPG, or WebP. JPEG output uses a white background."
        onFilesChange={(next) => {
          setFiles(next)
          setResults([])
          setError(null)
        }}
        onReject={setError}
      />
      <ChoiceGroup
        label="Convert to"
        value={format}
        onChange={(value) => {
          setFormat(value)
          setResults([])
        }}
        options={[
          { value: "image/jpeg", label: "JPEG" },
          { value: "image/png", label: "PNG" },
          { value: "image/webp", label: "WebP" },
        ]}
      />
      {format === "image/png" ? null : (
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="convert-quality">Quality</Label>
            <span className="text-sm tabular-nums text-muted-foreground">{Math.round(quality * 100)}%</span>
          </div>
          <Slider
            id="convert-quality"
            className="py-3"
            min={0.5}
            max={1}
            step={0.01}
            value={[quality]}
            disabled={busy}
            onValueChange={(value) => setQuality(value[0] ?? 0.9)}
          />
        </div>
      )}
      {busy ? <ProgressBar value={progress} label="Converting" /> : null}
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <Button type="submit" className="h-12 w-full" disabled={busy || files.length === 0}>
        {busy ? "Converting…" : "Convert images"}
      </Button>
      <ResultList items={results} />
    </form>
  )
}
