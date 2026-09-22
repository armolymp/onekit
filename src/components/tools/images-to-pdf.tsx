"use client"

import { useState } from "react"
import { PDFDocument } from "pdf-lib"
import { ChoiceGroup } from "@/components/choice-group"
import { FileDropzone } from "@/components/file-dropzone"
import { ProgressBar } from "@/components/progress-bar"
import { ResultList, type FileResult } from "@/components/result-list"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { bytesToBlob, errorText, outputName } from "@/lib/format"
import { fileToJpegBytes } from "@/lib/image"

const A4 = { width: 595.28, height: 841.89 }

export function ImagesToPdfTool() {
  const [files, setFiles] = useState<File[]>([])
  const [page, setPage] = useState<"fit" | "a4">("fit")
  const [quality, setQuality] = useState(0.85)
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
    setProgress(0)
    try {
      const pdf = await PDFDocument.create()
      for (let index = 0; index < files.length; index += 1) {
        const jpeg = await fileToJpegBytes(files[index], quality)
        const image = await pdf.embedJpg(jpeg)
        if (page === "fit") {
          const pdfPage = pdf.addPage([image.width, image.height])
          pdfPage.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height })
        } else {
          const pdfPage = pdf.addPage([A4.width, A4.height])
          const scale = Math.min(A4.width / image.width, A4.height / image.height)
          const width = image.width * scale
          const height = image.height * scale
          pdfPage.drawImage(image, {
            x: (A4.width - width) / 2,
            y: (A4.height - height) / 2,
            width,
            height,
          })
        }
        setProgress(Math.round(((index + 1) / files.length) * 100))
      }
      pdf.setCreator("OneKit")
      pdf.setProducer("OneKit")
      const saved = await pdf.save({ useObjectStreams: true })
      const before = files.reduce((sum, file) => sum + file.size, 0)
      setResults([
        {
          filename: outputName("images.pdf", "pdf"),
          blob: bytesToBlob(saved, "application/pdf"),
          beforeBytes: before,
        },
      ])
    } catch (caught) {
      setError(errorText(caught, "Those images couldn't be turned into a PDF."))
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      <FileDropzone
        accept="image/png,image/jpeg,image/webp,image/gif,.png,.jpg,.jpeg,.webp,.gif"
        multiple
        reorder
        maxFiles={30}
        files={files}
        disabled={busy}
        title="Drop images here"
        description="PNG, JPG, or WebP. Transparent areas become white. Very large photos are scaled down."
        onFilesChange={(next) => {
          setFiles(next)
          setResults([])
          setError(null)
        }}
        onReject={setError}
      />
      <ChoiceGroup
        label="Page size"
        value={page}
        onChange={(value) => {
          setPage(value)
          setResults([])
        }}
        options={[
          { value: "fit", label: "Fit image", hint: "One page per picture" },
          { value: "a4", label: "A4", hint: "Centered on the page" },
        ]}
      />
      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="jpeg-quality">JPEG quality</Label>
          <span className="text-sm tabular-nums text-muted-foreground">{Math.round(quality * 100)}%</span>
        </div>
        <Slider
          id="jpeg-quality"
          className="py-3"
          min={0.5}
          max={0.95}
          step={0.01}
          value={[quality]}
          disabled={busy}
          onValueChange={(value) => {
            setQuality(value[0] ?? 0.85)
            setResults([])
          }}
        />
      </div>
      {busy ? <ProgressBar value={progress} label="Building PDF" /> : null}
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <Button type="submit" className="h-12 w-full" disabled={busy || files.length === 0}>
        {busy ? "Building…" : "Create PDF"}
      </Button>
      <ResultList items={results} />
    </form>
  )
}
