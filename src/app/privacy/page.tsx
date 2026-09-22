import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "OneKit processes files in your browser. Learn what stays on your device, when a converter is downloaded, and how ads work.",
  openGraph: {
    title: "Privacy · OneKit",
    description: "OneKit processes files in your browser. Your documents are not uploaded to a OneKit server.",
  },
}

export default function PrivacyPage() {
  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-12">
      <p className="text-sm text-muted-foreground">
        <Link href="/" className="underline-offset-4 hover:underline">
          Home
        </Link>
      </p>
      <h1 className="mt-3 font-heading text-4xl tracking-tight">Privacy</h1>
      <p className="mt-3 text-lg text-muted-foreground">
        OneKit is a free file toolkit. The work happens in your browser.
      </p>

      <div className="mt-8 grid gap-6 text-sm leading-6 sm:text-base sm:leading-7">
        <section>
          <h2 className="font-heading text-2xl tracking-tight">Your files</h2>
          <p className="mt-2 text-muted-foreground">
            PDFs and images are read with libraries that run on this page, including pdf-lib and the
            browser canvas. They are not sent to a OneKit server. When you close the tab, the files
            in memory go with it. OneKit has no account, so there is no file library to store them.
          </p>
        </section>
        <section>
          <h2 className="font-heading text-2xl tracking-tight">Video and audio</h2>
          <p className="mt-2 text-muted-foreground">
            Those tools only accept a file you pick from your device. OneKit does not download media
            from YouTube, TikTok, Instagram, or any other link. The first time you convert video or
            audio, the page downloads the ffmpeg.wasm converter (about 30 MB) from a public CDN into
            your browser. After that, the conversion runs locally. If the converter cannot start, the
            page says so and leaves your file untouched.
          </p>
        </section>
        <section>
          <h2 className="font-heading text-2xl tracking-tight">Ads</h2>
          <p className="mt-2 text-muted-foreground">
            Ad spaces are reserved for Google AdSense. Until{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-[0.9em]">NEXT_PUBLIC_ADSENSE_CLIENT</code>{" "}
            and{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-[0.9em]">NEXT_PUBLIC_ADSENSE_SLOT</code>{" "}
            are set, you see a labeled placeholder. When they are set, Google may use cookies to
            measure and personalize ads under its own policy.
          </p>
        </section>
        <section>
          <h2 className="font-heading text-2xl tracking-tight">What this site is not</h2>
          <p className="mt-2 text-muted-foreground">
            There is no paywall and no uploader that takes your file to unlock a download. Background
            removal is not included. Password-protected PDFs cannot be unlocked here.
          </p>
        </section>
      </div>
    </article>
  )
}
