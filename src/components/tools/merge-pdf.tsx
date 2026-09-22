"use client"

import { useState } from "react"
import { FileDropzone } from "@/components/file-dropzone"
import { ProgressBar } from "@/components/progress-bar"
import { ResultList, type FileResult } from "@/components/result-list"
import { Button } from "@/components/ui/button"
import { bytesToBlob, errorText, outputName, readFileBytes } from "@/lib/format"
import { mergePdfBytes } from "@/lib/pdf"

export function MergePdfTool() {
  const [files, setFiles] = useState<File[]>([])
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<FileResult[]>([])

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (files.length < 2) {
      setError("Add at least two PDFs.")
      return
    }
    setBusy(true)
    setError(null)
    setResults([])
    setProgress(8)
    try {
      const buffers = []
      for (let index = 0; index < files.length; index += 1) {
        buffers.push(await readFileBytes(files[index]))
        setProgress(Math.round(((index + 1) / files.length) * 80))
      }
      const merged = await mergePdfBytes(buffers)
      const before = files.reduce((sum, file) => sum + file.size, 0)
      setResults([
        {
          filename: outputName("merged.pdf", "pdf"),
          blob: bytesToBlob(merged, "application/pdf"),
          beforeBytes: before,
        },
      ])
      setProgress(100)
    } catch (caught) {
      setError(errorText(caught, "Those PDFs couldn't be merged."))
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      <FileDropzone
        accept="application/pdf,.pdf"
        multiple
        reorder
        maxFiles={20}
        files={files}
        disabled={busy}
        title="Drop PDFs here"
        description="Add two or more. Order is top to bottom \u2014 use the arrows to rearrange."
        onFilesChange={(next) => {
          setFiles(next)
          setResults([])
          setError(null)
        }}
        onReject={setError}
      />
      {busy ? <ProgressBar value={progress} label="Merging PDFs" /> : null}
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <Button type="submit" className="h-12 w-full" disabled={busy || files.length < 2}>
        {busy ? "Merging\u2026" : "Merge PDFs"}
      </Button>
      <ResultList items={results} />
    </form>
  )
}
