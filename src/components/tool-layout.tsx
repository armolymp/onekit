import Link from "next/link"
import { AdSlot } from "@/components/ad-slot"
import { categoryLabel, tools, type Tool } from "@/lib/tools"

export function ToolLayout({ tool, children }: { tool: Tool; children: React.ReactNode }) {
  const related = tools.filter((item) => item.category === tool.category && item.href !== tool.href)

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:py-10">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <li>
            <Link href="/" className="underline-offset-4 hover:text-foreground hover:underline">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href={`/#${tool.category}`}
              className="underline-offset-4 hover:text-foreground hover:underline"
            >
              {categoryLabel(tool.category)}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-foreground">{tool.name}</li>
        </ol>
      </nav>
      <header className="mb-5">
        <h1 className="font-heading text-3xl tracking-tight text-balance sm:text-4xl">{tool.name}</h1>
        <p className="mt-2 text-base text-muted-foreground sm:text-lg">{tool.description}</p>
      </header>
      <AdSlot className="mb-5" />
      <section className="rounded-2xl bg-card p-4 ring-1 ring-foreground/10 sm:p-6">{children}</section>
      <AdSlot className="mt-5" />
      <aside className="mt-6 rounded-2xl bg-secondary/80 px-4 py-4 text-sm sm:px-5">
        <p className="font-medium">Your file stays on this device</p>
        <p className="mt-1 text-muted-foreground">{tool.privacyNote}</p>
      </aside>
      {related.length > 0 ? (
        <div className="mt-6">
          <h2 className="text-sm font-medium">More {categoryLabel(tool.category).toLowerCase()} tools</h2>
          <ul className="mt-2 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            {related.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-11 items-center text-sm text-primary underline-offset-4 hover:underline"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
