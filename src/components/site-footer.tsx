import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/80">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          <span className="font-medium text-foreground">OneKit</span> — files are processed in your browser.
        </p>
        <Link href="/privacy" className="underline-offset-4 hover:text-foreground hover:underline">
          Privacy
        </Link>
      </div>
    </footer>
  )
}
