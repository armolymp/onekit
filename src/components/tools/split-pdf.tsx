"use client"

import { useRef, useState } from "react"
import { FileDropzone } from "@/components/file-dropzone"
import { ProgressBar } from "@/components/progress-bar"
import { ResultList, type FileResult } from "@/components/result-list"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { bytesToBlob, errorText, outputName, readFileBytes } from "@/lib/format"
import { parsePageRange } from "@/lib/page-range"
import { countPdfPages, splitPdfBytes } from "@/lib/pdf"

export function SplitPdfTool() {
  const [files, setFiles] = useState<File[]>([])
  const [range, setRange] = useState("1-3")
  const [pageCount, setPageCount] = useState<number | null>(null)
  const [reading, setReading] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<FileResult[]>([])
  const request = useRef(0)
  const file = files[0] ?? null

  function onFilesChange(next: File[]) {
    setFiles(next)
    setResults([])
    setError(null)
    setPageCount(null)
    const nextFile = next[0]
    const id = request.current + 1
    request.current = id
    if (!nextFile) {
      setReading(false)
      return
    }
    setReading(true)
    readFileBytes(nextFile)
      .then((bytes) => countPdfPages(bytes))
      .then((count) => {
        if (request.current === id) setPageCount(count)
      })
      .catch((caught: unknown) => {
        if (request.current === id) setError(errorText(caught, "This PDF couldn't be read."))
      })
      .finally(() => {
        if (request.current === id) setReading(false)
      })
  }

  const parsed = pageCount != null ? parsePageRange(range, pageCount) : null

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!file || pageCount == null) return
    const selection = parsePageRange(range, pageCount)
    if ("error" in selection) {
      setError(selection.error)
      return
    }
    setBusy(true)
    setError(null)
    setResults([])
    try {
      const bytes = await readFileBytes(file)
      const split = await splitPdfBytes(bytes, selection.pages)
      setResults([
        {
          filename: outputName(file.name, "pdf"),
          blob: bytesToBlob(split, "application/pdf"),
          beforeBytes: file.size,
        },
      ])
    } catch (caught) {
      setError(errorText(caught, "This PDF couldn't be split."))
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
        description="One PDF. You'll choose which pages to keep."
        onFilesChange={onFilesChange}
        onReject={setError}
      />
      <div className="grid gap-2">
        <Label htmlFor="page-range">Pages to keep</Label>
        <Input
          id="page-range"
          value={range}
          disabled={busy}
          className="h-11"
          inputMode="text"
          placeholder="1-3, 5"
          onChange={(event) => {
            setRange(event.target.value)
            setResults([])
            setError(null)
          }}
        />
        <p className="text-xs text-muted-foreground">
          {reading
            ? "Reading the PDF\u2026"
            : pageCount != null
              ? `${pageCount} page${pageCount === 1 ? "" : "s"}. Use commas and ranges, like 1-3, 5.`
              : "Add a PDF to see how many pages it has."}
          {parsed && "pages" in parsed ? ` ${parsed.pages.length} selected.` : ""}
        </p>
      </div>
      {busy ? <ProgressBar indeterminate label="Splitting PDF" /> : null}
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <Button type="submit" className="h-12 w-full" disabled={busy || !file || pageCount == null}>
        {busy ? "Splitting\u2026" : "Split PDF"}
      </Button>
      <ResultList items={results} />
    </form>
  )
}
