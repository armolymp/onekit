import Link from "next/link"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4">
        <Link href="/" className="flex min-w-0 items-center gap-2">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary font-heading text-lg leading-none text-primary-foreground">
            1
          </span>
          <span className="truncate font-heading text-xl tracking-tight">OneKit</span>
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-1 text-sm">
          <Link
            href="/#tools"
            className="inline-flex h-11 items-center rounded-lg px-3 text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            Tools
          </Link>
          <Link
            href="/privacy"
            className="inline-flex h-11 items-center rounded-lg px-3 text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            Privacy
          </Link>
        </nav>
      </div>
    </header>
  )
}
