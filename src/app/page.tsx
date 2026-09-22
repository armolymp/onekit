import Link from "next/link"
import {
  AudioLines,
  Clapperboard,
  Combine,
  FileImage,
  FileText,
  Minimize2,
  Scaling,
  Scissors,
} from "lucide-react"
import { AdSlot } from "@/components/ad-slot"
import { Badge } from "@/components/ui/badge"
import { categories, tools, type ToolCategory } from "@/lib/tools"

const icons = {
  "pdf/merge": Combine,
  "pdf/split": Scissors,
  "pdf/compress": Minimize2,
  "pdf/images-to-pdf": FileImage,
  "image/compress": Minimize2,
  "image/convert": FileImage,
  "image/resize": Scaling,
  "video/compress": Clapperboard,
  "audio/convert": AudioLines,
} as const

const tones: Record<ToolCategory, string> = {
  pdf: "bg-[oklch(0.93_0.03_165)] text-[oklch(0.32_0.06_165)]",
  image: "bg-[oklch(0.94_0.04_75)] text-[oklch(0.4_0.08_55)]",
  video: "bg-[oklch(0.93_0.03_240)] text-[oklch(0.35_0.06_250)]",
  audio: "bg-[oklch(0.94_0.03_330)] text-[oklch(0.38_0.07_340)]",
}

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-14">
      <section className="grid items-end gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div>
          <Badge variant="secondary" className="h-7 px-3">
            Free · no account
          </Badge>
          <h1 className="mt-4 max-w-xl font-heading text-4xl leading-[1.05] tracking-tight text-balance sm:text-6xl">
            Every digital file tool you need — free.
          </h1>
          <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
            Merge a PDF, shrink a photo, or turn a recording into MP3. It runs in your browser.
            No upload, no paywall, no sign-up.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="#tools"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground"
            >
              Browse tools
            </Link>
            <Link
              href="/privacy"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-border bg-card px-5 text-sm font-medium"
            >
              How privacy works
            </Link>
          </div>
        </div>
        <ul className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          {[
            ["On your device", "PDFs and images are handled in the tab you already have open."],
            ["Upload only", "Video and audio start from a file you choose. No link grabbers."],
            ["Always free", "Every tool on this page is available without a plan."],
          ].map(([title, copy]) => (
            <li key={title} className="rounded-2xl bg-card px-4 py-4 ring-1 ring-foreground/10">
              <p className="font-medium">{title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{copy}</p>
            </li>
          ))}
        </ul>
      </section>

      <AdSlot className="mt-8" />

      <div id="tools" className="mt-10 scroll-mt-20 space-y-10">
        {categories.map((category) => (
          <section key={category.id} id={category.id} className="scroll-mt-20">
            <div className="mb-4">
              <h2 className="font-heading text-2xl tracking-tight sm:text-3xl">{category.label}</h2>
              <p className="mt-1 text-sm text-muted-foreground sm:text-base">{category.description}</p>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {tools
                .filter((tool) => tool.category === category.id)
                .map((tool) => {
                  const iconKey = `${tool.category}/${tool.slug}` as keyof typeof icons
                  const Icon = icons[iconKey] ?? FileText
                  return (
                    <li key={tool.href}>
                      <Link
                        href={tool.href}
                        className="flex h-full gap-3 rounded-2xl bg-card p-4 ring-1 ring-foreground/10 transition-colors hover:ring-primary/40"
                      >
                        <span
                          className={`grid size-11 shrink-0 place-items-center rounded-xl ${tones[tool.category]}`}
                        >
                          <Icon className="size-5" />
                        </span>
                        <span className="min-w-0">
                          <span className="flex items-center gap-2">
                            <span className="font-medium">{tool.name}</span>
                            <Badge variant="outline">Free</Badge>
                          </span>
                          <span className="mt-1 block text-sm text-muted-foreground">{tool.description}</span>
                        </span>
                      </Link>
                    </li>
                  )
                })}
            </ul>
          </section>
        ))}
      </div>

      <AdSlot className="mt-10" />
    </div>
  )
}
