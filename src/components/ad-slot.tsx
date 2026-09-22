"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

declare global {
  interface Window {
    adsbygoogle?: unknown[]
  }
}

export function AdSlot({ slot, className }: { slot?: string; className?: string }) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT
  const slotId = slot || process.env.NEXT_PUBLIC_ADSENSE_SLOT
  const pushed = useRef(false)

  useEffect(() => {
    if (!client || !slotId || pushed.current) return
    pushed.current = true
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      pushed.current = false
    }
  }, [client, slotId])

  if (!client || !slotId) {
    return (
      <div
        className={cn(
          "flex min-h-16 items-center justify-center rounded-xl border border-dashed border-border bg-muted/50 px-3 py-4 sm:min-h-24",
          className,
        )}
        role="complementary"
        aria-label="Advertisement placeholder"
      >
        <span className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
          Advertisement
        </span>
      </div>
    )
  }

  return (
    <div className={cn("min-h-16 overflow-hidden", className)} role="complementary" aria-label="Advertisement">
      <ins
        className="adsbygoogle"
        style={{ display: "block", minHeight: 90 }}
        data-ad-client={client}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
