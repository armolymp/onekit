"use client"

import { useState } from "react"
import { ChoiceGroup } from "@/components/choice-group"
import { FileDropzone } from "@/components/file-dropzone"
import { ProgressBar } from "@/components/progress-bar"
import { ResultList, type FileResult } from "@/components/result-list"
import { Button } from "@/components/ui/button"
import { errorText, outputName } from "@/lib/format"
import { compressVideo, type VideoPreset } from "@/lib/ffmpeg-client"

export function CompressVideoTool() {
  const [files, setFiles] = useState<File[]>([])
  const [preset, setPreset] = useState<VideoPreset>("balanced")
  const [busy, setBusy] = useState(false)
  const [indeterminate, setIndeterminate] = useState(true)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("Preparing")
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<FileResult[]>([])

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    const file = files[0]
    if (!file) return
    setBusy(true)
    setError(null)
    setResults([])
    setProgress(0)
    setIndeterminate(true)
    try {
      const blob = await compressVideo(
        file,
        preset,
        (message) => {
          setStatus(message)
          setIndeterminate(!message.startsWith("Converting"))
        },
        (value) => {
          setIndeterminate(false)
          setProgress(value)
          setStatus("Converting to MP4")
        },
      )
      setResults([
        {
          filename: outputName(file.name, "mp4"),
          blob,
          beforeBytes: file.size,
        },
      ])
    } catch (caught) {
      setError(errorText(caught, "This video couldn't be converted. Your file was not uploaded."))
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      <p className="text-sm text-muted-foreground">
        Upload a video from this device. OneKit does not fetch videos from links. Large files need a
        lot of memory — phones do better under about 100 MB.
      </p>
      <FileDropzone
        accept="video/*,.mp4,.mov,.webm,.mkv,.avi,.m4v"
        files={files}
        disabled={busy}
        title="Drop a video here"
        description="MP4, MOV, WebM, and similar files from your device."
        onFilesChange={(next) => {
          setFiles(next)
          setResults([])
          setError(null)
        }}
        onReject={setError}
      />
      <ChoiceGroup
        label="Output"
        value={preset}
        onChange={setPreset}
        options={[
          { value: "smaller", label: "Smaller", hint: "854px, lower quality" },
          { value: "balanced", label: "Balanced", hint: "1280px MP4" },
          { value: "higher", label: "Higher", hint: "Up to 1920px" },
        ]}
      />
      {busy ? <ProgressBar value={progress} indeterminate={indeterminate} label={status} /> : null}
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <Button type="submit" className="h-12 w-full" disabled={busy || files.length === 0}>
        {busy ? "Working…" : "Convert to MP4"}
      </Button>
      <ResultList items={results} />
    </form>
  )
}
