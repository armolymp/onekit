import { bytesToBlob } from "@/lib/format"

type FFmpegApi = {
  load: (config?: { coreURL?: string; wasmURL?: string }) => Promise<boolean>
  exec: (args: string[], timeout?: number) => Promise<number>
  writeFile: (path: string, data: Uint8Array) => Promise<unknown>
  readFile: (path: string) => Promise<Uint8Array | string>
  deleteFile: (path: string) => Promise<unknown>
  on: (
    event: "log" | "progress",
    callback: (payload: { message?: string; progress?: number }) => void,
  ) => void
  off: (
    event: "log" | "progress",
    callback: (payload: { message?: string; progress?: number }) => void,
  ) => void
}

const FFMPEG_URL = "https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.12.15/dist/esm/index.js"
const CORE_BASE = "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.9/dist/umd"

let ffmpegPromise: Promise<FFmpegApi> | null = null
let queue: Promise<unknown> = Promise.resolve()

function enqueue<T>(job: () => Promise<T>): Promise<T> {
  const run = queue.then(job, job)
  queue = run.then(
    () => undefined,
    () => undefined,
  )
  return run
}

async function importEsm(url: string): Promise<Record<string, unknown>> {
  const loader = new Function("url", "return import(url)") as (
    url: string,
  ) => Promise<Record<string, unknown>>
  return loader(url)
}

async function blobUrl(url: string, mime: string): Promise<string> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Couldn't download the converter (${response.status}).`)
  }
  const blob = await response.blob()
  return URL.createObjectURL(new Blob([blob], { type: mime }))
}

function converterError(): Error {
  return new Error(
    "The converter couldn't start in this browser. Try Chrome or Edge, check your connection, and use a smaller file. Nothing was uploaded.",
  )
}

async function getFfmpeg(onStatus: (message: string) => void): Promise<FFmpegApi> {
  if (!ffmpegPromise) {
    ffmpegPromise = (async () => {
      onStatus("Loading the converter…")
      const mod = await importEsm(FFMPEG_URL)
      const FFmpeg = mod.FFmpeg as new () => FFmpegApi
      if (!FFmpeg) throw converterError()
      const ffmpeg = new FFmpeg()
      onStatus("Downloading the converter (about 30 MB, once per visit)…")
      await ffmpeg.load({
        coreURL: await blobUrl(`${CORE_BASE}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await blobUrl(`${CORE_BASE}/ffmpeg-core.wasm`, "application/wasm"),
      })
      return ffmpeg
    })().catch((error: unknown) => {
      ffmpegPromise = null
      if (error instanceof Error && error.message) throw error
      throw converterError()
    })
  }
  return ffmpegPromise
}

function extensionOf(file: File, fallback: string): string {
  const match = /\.([a-z0-9]+)$/i.exec(file.name)
  if (match) return `.${match[1].toLowerCase()}`
  if (file.type === "video/webm" || file.type === "audio/webm") return ".webm"
  if (file.type === "video/quicktime") return ".mov"
  if (file.type === "audio/mpeg") return ".mp3"
  if (file.type === "audio/mp4" || file.type === "audio/x-m4a") return ".m4a"
  if (file.type === "audio/wav" || file.type === "audio/wave") return ".wav"
  return fallback
}

async function runFfmpeg(
  file: File,
  outputName: string,
  argsFor: (inputName: string) => string[][],
  mime: string,
  fallbackExt: string,
  onStatus: (message: string) => void,
  onProgress: (value: number) => void,
): Promise<Blob> {
  return enqueue(async () => {
    const ffmpeg = await getFfmpeg(onStatus)
    const inputName = `input${extensionOf(file, fallbackExt)}`
    const bytes = new Uint8Array(await file.arrayBuffer())
    const logs: string[] = []
    const onLog = ({ message }: { message?: string }) => {
      if (message) logs.push(message)
    }
    const onFfmpegProgress = ({ progress }: { progress?: number }) => {
      if (typeof progress === "number" && Number.isFinite(progress)) {
        onProgress(Math.max(0, Math.min(100, Math.round(progress * 100))))
      }
    }
    ffmpeg.on("log", onLog)
    ffmpeg.on("progress", onFfmpegProgress)
    try {
      await ffmpeg.writeFile(inputName, bytes)
      onStatus("Converting…")
      let code = 1
      const attempts = argsFor(inputName)
      for (const args of attempts) {
        code = await ffmpeg.exec([...args, outputName], 15 * 60 * 1000)
        if (code === 0) break
        await ffmpeg.deleteFile(outputName).catch(() => undefined)
      }
      if (code !== 0) {
        const detail = logs.slice(-6).join(" ").trim()
        throw new Error(
          detail
            ? `Conversion failed. ${detail}`
            : "Conversion failed in this browser. Try a different file or a smaller one.",
        )
      }
      const data = await ffmpeg.readFile(outputName)
      if (typeof data === "string" || data.byteLength === 0) {
        throw new Error("The converter finished without a file. Try a different format.")
      }
      onProgress(100)
      return bytesToBlob(data, mime)
    } finally {
      ffmpeg.off("log", onLog)
      ffmpeg.off("progress", onFfmpegProgress)
      await ffmpeg.deleteFile(inputName).catch(() => undefined)
      await ffmpeg.deleteFile(outputName).catch(() => undefined)
    }
  })
}

export type VideoPreset = "smaller" | "balanced" | "higher"

const videoPresets: Record<VideoPreset, { crf: string; width: string; audio: string }> = {
  smaller: { crf: "32", width: "854", audio: "96k" },
  balanced: { crf: "26", width: "1280", audio: "128k" },
  higher: { crf: "20", width: "1920", audio: "160k" },
}

export function compressVideo(
  file: File,
  preset: VideoPreset,
  onStatus: (message: string) => void,
  onProgress: (value: number) => void,
): Promise<Blob> {
  const settings = videoPresets[preset]
  const scale = `scale='min(${settings.width},iw)':-2`
  return runFfmpeg(
    file,
    "output.mp4",
    (inputName) => [
      [
        "-i",
        inputName,
        "-vf",
        scale,
        "-c:v",
        "libx264",
        "-preset",
        "veryfast",
        "-crf",
        settings.crf,
        "-c:a",
        "aac",
        "-b:a",
        settings.audio,
        "-pix_fmt",
        "yuv420p",
        "-movflags",
        "+faststart",
      ],
      [
        "-i",
        inputName,
        "-vf",
        scale,
        "-c:v",
        "mpeg4",
        "-q:v",
        "6",
        "-c:a",
        "aac",
        "-b:a",
        settings.audio,
      ],
    ],
    "video/mp4",
    ".mp4",
    onStatus,
    onProgress,
  )
}

export type AudioFormat = "mp3" | "m4a" | "wav"

export function convertAudio(
  file: File,
  format: AudioFormat,
  onStatus: (message: string) => void,
  onProgress: (value: number) => void,
): Promise<Blob> {
  const plans: Record<AudioFormat, { mime: string; attempts: string[][] }> = {
    mp3: {
      mime: "audio/mpeg",
      attempts: [
        ["-c:a", "libmp3lame", "-b:a", "160k"],
        ["-c:a", "mp3", "-b:a", "160k"],
      ],
    },
    m4a: {
      mime: "audio/mp4",
      attempts: [["-c:a", "aac", "-b:a", "160k"]],
    },
    wav: {
      mime: "audio/wav",
      attempts: [["-c:a", "pcm_s16le"]],
    },
  }
  const plan = plans[format]
  return runFfmpeg(
    file,
    `output.${format}`,
    (inputName) => plan.attempts.map((codec) => ["-i", inputName, ...codec]),
    plan.mime,
    ".wav",
    onStatus,
    onProgress,
  )
}
