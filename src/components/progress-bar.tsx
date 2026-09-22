"use client"

import { Progress } from "@/components/ui/progress"

export function ProgressBar({
  value = 0,
  label,
  indeterminate = false,
}: {
  value?: number
  label: string
  indeterminate?: boolean
}) {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div className="grid gap-2" role="status" aria-live="polite">
      <div className="flex items-center justify-between gap-3 text-sm">
        <p>{label}</p>
        {indeterminate ? null : (
          <p className="tabular-nums text-muted-foreground">{Math.round(clamped)}%</p>
        )}
      </div>
      {indeterminate ? (
        <div className="h-2 overflow-hidden rounded-full bg-muted" aria-hidden="true">
          <div className="h-full w-1/3 animate-[onekit-slide_1.1s_ease-in-out_infinite] rounded-full bg-primary" />
        </div>
      ) : (
        <Progress value={clamped} className="h-2" aria-label={label} />
      )}
    </div>
  )
}
