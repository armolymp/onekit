import type { Metadata, Viewport } from "next"
import { Fraunces, Outfit } from "next/font/google"
import Script from "next/script"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import "./globals.css"

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
})

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
})

const description =
  "Merge and split PDFs, compress and convert images, and turn uploaded video or audio into common formats. Free, in your browser, with no account."

export const metadata: Metadata = {
  title: {
    default: "OneKit — Every digital file tool you need, free",
    template: "%s · OneKit",
  },
  description,
  applicationName: "OneKit",
  keywords: [
    "free pdf merge",
    "split pdf",
    "compress image",
    "convert image",
    "images to pdf",
    "video to mp4",
    "audio converter",
  ],
  openGraph: {
    title: "OneKit — Every digital file tool you need, free",
    description,
    siteName: "OneKit",
    type: "website",
  },
}

export const viewport: Viewport = {
  themeColor: "#f4f0e6",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT

  return (
    <html lang="en" className={`${outfit.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        {adsenseClient ? (
          <Script
            id="adsense-script"
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        ) : null}
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-card focus:px-3 focus:py-2"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="content" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  )
}
