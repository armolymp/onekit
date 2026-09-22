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
import { compressImageFile, extensionForMime } from "@/lib/image"

type OutputFormat = "keep" | "image/jpeg" | "image/webp" | "image/png"

export function CompressImageTool() {
  const [files, setFiles] = useState<File[]>([])
  const [maxSize, setMaxSize] = useState(0.8)
  const [maxEdge, setMaxEdge] = useState(1920)
  const [format, setFormat] = useState<OutputFormat>("keep")
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState(0)
  const [label, setLabel] = useState("Compressing")
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
        setLabel(`Compressing ${index + 1} of ${files.length}`)
        const blob = await compressImageFile(
          file,
          {
            maxSizeMB: maxSize,
            maxEdge,
            type: format === "keep" ? undefined : format,
          },
          (value) => setProgress(Math.round((index * 100 + value) / files.length)),
        )
        const type = blob.type || (format === "keep" ? file.type : format) || "image/jpeg"
        next.push({
          filename: outputName(file.name, extensionForMime(type)),
          blob,
          beforeBytes: file.size,
        })
      }
      setResults(next)
      setProgress(100)
    } catch (caught) {
      setError(errorText(caught, "Those images couldn't be compressed."))
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
        description="PNG, JPG, or WebP. Each file is compressed on this device."
        onFilesChange={(next) => {
          setFiles(next)
          setResults([])
          setError(null)
        }}
        onReject={setError}
      />
      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="max-size">Target size</Label>
          <span className="text-sm tabular-nums text-muted-foreground">{maxSize.toFixed(1)} MB</span>
        </div>
        <Slider
          id="max-size"
          className="py-3"
          min={0.2}
          max={3}
          step={0.1}
          value={[maxSize]}
          disabled={busy}
          onValueChange={(value) => setMaxSize(value[0] ?? 0.8)}
        />
      </div>
      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="max-edge">Longest side</Label>
          <span className="text-sm tabular-nums text-muted-foreground">{maxEdge}px</span>
        </div>
        <Slider
          id="max-edge"
          className="py-3"
          min={640}
          max={3200}
          step={64}
          value={[maxEdge]}
          disabled={busy}
          onValueChange={(value) => setMaxEdge(value[0] ?? 1920)}
        />
      </div>
      <ChoiceGroup
        label="Format"
        value={format}
        onChange={setFormat}
        options={[
          { value: "keep", label: "Keep", hint: "Same type when possible" },
          { value: "image/jpeg", label: "JPEG", hint: "Usually smaller" },
          { value: "image/webp", label: "WebP", hint: "Small, modern" },
          { value: "image/png", label: "PNG", hint: "Lossless-looking" },
        ]}
      />
      {busy ? <ProgressBar value={progress} label={label} /> : null}
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <Button type="submit" className="h-12 w-full" disabled={busy || files.length === 0}>
        {busy ? "Compressing…" : "Compress images"}
      </Button>
      <ResultList items={results} />
    </form>
  )
}
