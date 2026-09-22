"use client"

import { useState } from "react"
import { ChoiceGroup } from "@/components/choice-group"
import { FileDropzone } from "@/components/file-dropzone"
import { ProgressBar } from "@/components/progress-bar"
import { ResultList, type FileResult } from "@/components/result-list"
import { Button } from "@/components/ui/button"
import { errorText, outputName } from "@/lib/format"
import { convertAudio, type AudioFormat } from "@/lib/ffmpeg-client"

export function ConvertAudioTool() {
  const [files, setFiles] = useState<File[]>([])
  const [format, setFormat] = useState<AudioFormat>("mp3")
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
      const blob = await convertAudio(
        file,
        format,
        (message) => {
          setStatus(message)
          setIndeterminate(!message.startsWith("Converting"))
        },
        (value) => {
          setIndeterminate(false)
          setProgress(value)
          setStatus(`Converting to ${format.toUpperCase()}`)
        },
      )
      setResults([
        {
          filename: outputName(file.name, format),
          blob,
          beforeBytes: file.size,
        },
      ])
    } catch (caught) {
      setError(errorText(caught, "This audio couldn't be converted. Your file was not uploaded."))
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      <p className="text-sm text-muted-foreground">
        Upload audio from this device. OneKit does not download tracks from links or other sites.
      </p>
      <FileDropzone
        accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg,.flac,.webm"
        files={files}
        disabled={busy}
        title="Drop audio here"
        description="WAV, M4A, MP3, and other files already on your device."
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
        onChange={setFormat}
        options={[
          { value: "mp3", label: "MP3", hint: "Widely supported" },
          { value: "m4a", label: "M4A", hint: "AAC audio" },
          { value: "wav", label: "WAV", hint: "Uncompressed" },
        ]}
      />
      {busy ? <ProgressBar value={progress} indeterminate={indeterminate} label={status} /> : null}
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <Button type="submit" className="h-12 w-full" disabled={busy || files.length === 0}>
        {busy ? "Working…" : "Convert audio"}
      </Button>
      <ResultList items={results} />
    </form>
  )
}
