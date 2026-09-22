export type ToolCategory = "pdf" | "image" | "video" | "audio"

export type Tool = {
  slug: string
  category: ToolCategory
  href: string
  name: string
  description: string
  seo: string
  privacyNote: string
}

export const categories: { id: ToolCategory; label: string; description: string }[] = [
  {
    id: "pdf",
    label: "PDF",
    description: "Merge, split, repack, and build a PDF from pictures.",
  },
  {
    id: "image",
    label: "Images",
    description: "Shrink, convert, and resize PNG, JPG, and WebP.",
  },
  {
    id: "video",
    label: "Video",
    description: "Turn an uploaded video into a smaller MP4.",
  },
  {
    id: "audio",
    label: "Audio",
    description: "Convert an uploaded recording to MP3, M4A, or WAV.",
  },
]

const onDevice = "Processed in your browser. OneKit does not upload the file."

export const tools: Tool[] = [
  {
    slug: "merge",
    category: "pdf",
    href: "/tools/pdf/merge",
    name: "Merge PDF",
    description: "Combine PDFs in the order you choose.",
    seo: "Merge PDF files for free in your browser. Reorder pages, combine documents, and download one PDF. Files stay on your device.",
    privacyNote: onDevice,
  },
  {
    slug: "split",
    category: "pdf",
    href: "/tools/pdf/split",
    name: "Split PDF",
    description: "Pull out a page range, like 1-3 or 5.",
    seo: "Split a PDF by page range for free. Extract pages 1-3, 5, or any mix and download a new PDF without uploading it.",
    privacyNote: onDevice,
  },
  {
    slug: "compress",
    category: "pdf",
    href: "/tools/pdf/compress",
    name: "Compress PDF",
    description: "Best-effort repack that keeps text selectable.",
    seo: "Compress a PDF for free in your browser. OneKit repacks the file on your device and shows the size before you download.",
    privacyNote: onDevice,
  },
  {
    slug: "images-to-pdf",
    category: "pdf",
    href: "/tools/pdf/images-to-pdf",
    name: "Images to PDF",
    description: "Turn PNG, JPG, or WebP pictures into one PDF.",
    seo: "Convert images to a PDF for free. Add PNG, JPG, or WebP files, order them, and download a PDF made in your browser.",
    privacyNote: onDevice,
  },
  {
    slug: "compress",
    category: "image",
    href: "/tools/image/compress",
    name: "Compress image",
    description: "Shrink PNG, JPG, or WebP toward a target size.",
    seo: "Compress images for free in your browser. Reduce PNG, JPG, and WebP file size without uploading the photo.",
    privacyNote: onDevice,
  },
  {
    slug: "convert",
    category: "image",
    href: "/tools/image/convert",
    name: "Convert image",
    description: "Convert between PNG, JPG, and WebP.",
    seo: "Convert PNG, JPG, and WebP images for free. The conversion runs in your browser and the original never leaves your device.",
    privacyNote: onDevice,
  },
  {
    slug: "resize",
    category: "image",
    href: "/tools/image/resize",
    name: "Resize image",
    description: "Change width and height, with proportions locked if you want.",
    seo: "Resize images for free in your browser. Set a width or height for PNG, JPG, and WebP and download the result.",
    privacyNote: onDevice,
  },
  {
    slug: "compress",
    category: "video",
    href: "/tools/video/compress",
    name: "Video to MP4",
    description: "Compress or convert an uploaded video to MP4.",
    seo: "Convert an uploaded video to MP4 for free. OneKit does not fetch videos from links. Processing runs in your browser.",
    privacyNote:
      "Your video is not uploaded to OneKit. The first run downloads the ffmpeg converter into this browser, then the file is processed locally.",
  },
  {
    slug: "convert",
    category: "audio",
    href: "/tools/audio/convert",
    name: "Convert audio",
    description: "Convert an uploaded WAV, M4A, or MP3.",
    seo: "Convert uploaded WAV, M4A, and MP3 audio for free in your browser. OneKit does not download audio from links.",
    privacyNote:
      "Your audio is not uploaded to OneKit. The first run downloads the ffmpeg converter into this browser, then the file is processed locally.",
  },
]

export function getTool(category: ToolCategory, slug: string): Tool {
  const tool = tools.find((item) => item.category === category && item.slug === slug)
  if (!tool) throw new Error(`Unknown tool: ${category}/${slug}`)
  return tool
}

export function categoryLabel(category: ToolCategory): string {
  return categories.find((item) => item.id === category)?.label ?? category
}
