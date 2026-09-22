"use client"

import { useState } from "react"
import { FileDropzone } from "@/components/file-dropzone"
import { ProgressBar } from "@/components/progress-bar"
import { ResultList, type FileResult } from "@/components/result-list"
import { Button } from "@/components/ui/button"
import { bytesToBlob, errorText, outputName, readFileBytes } from "@/lib/format"
import { repackPdfBytes } from "@/lib/pdf"

export function CompressPdfTool() {
  const [files, setFiles] = useState<File[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<FileResult[]>([])

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    const file = files[0]
    if (!file) return
    setBusy(true)
    setError(null)
    setResults([])
    try {
      const bytes = await readFileBytes(file)
      const packed = await repackPdfBytes(bytes)
      setResults([
        {
          filename: outputName(file.name, "pdf"),
          blob: bytesToBlob(packed, "application/pdf"),
          beforeBytes: file.size,
        },
      ])
    } catch (caught) {
      setError(errorText(caught, "This PDF couldn't be repacked."))
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      <FileDropzone
        accept="application/pdf,.pdf"
        files={files}
        disabled={busy}
        title="Drop a PDF here"
        description="Best-effort repack. Text stays selectable. Image-heavy files may barely change size."
        onFilesChange={(next) => {
          setFiles(next)
          setResults([])
          setError(null)
        }}
        onReject={setError}
      />
      {busy ? <ProgressBar indeterminate label="Repacking PDF" /> : null}
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <Button type="submit" className="h-12 w-full" disabled={busy || files.length === 0}>
        {busy ? "Working\u2026" : "Compress PDF"}
      </Button>
      <ResultList items={results} />
    </form>
  )
}
