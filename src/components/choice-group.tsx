"use client"

import { cn } from "@/lib/utils"

export function ChoiceGroup<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: T
  onChange: (value: T) => void
  options: { value: T; label: string; hint?: string }[]
}) {
  return (
    <fieldset className="grid gap-2">
      <legend className="text-sm font-medium">{label}</legend>
      <div
        className={cn(
          "grid grid-cols-1 gap-2",
          options.length === 2 ? "sm:grid-cols-2" : options.length > 3 ? "sm:grid-cols-2" : "sm:grid-cols-3",
        )}
      >
        {options.map((option) => {
          const selected = option.value === value
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(option.value)}
              className={cn(
                "min-h-11 rounded-xl border px-3 py-2 text-left",
                selected ? "border-primary bg-primary/10" : "border-border bg-background",
              )}
            >
              <span className="block text-sm font-medium">{option.label}</span>
              {option.hint ? (
                <span className="mt-0.5 block text-xs text-muted-foreground">{option.hint}</span>
              ) : null}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
