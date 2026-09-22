import Link from "next/link"

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[50vh] w-full max-w-lg flex-col justify-center px-4 py-16">
      <h1 className="font-heading text-4xl tracking-tight">That page isn&apos;t here</h1>
      <p className="mt-3 text-muted-foreground">The tool you asked for isn&apos;t part of OneKit.</p>
      <Link
        href="/"
        className="mt-6 inline-flex h-12 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground"
      >
        Back to tools
      </Link>
    </div>
  )
}
