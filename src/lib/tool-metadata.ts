import type { Metadata } from "next"
import { getTool, type ToolCategory } from "@/lib/tools"

export function toolMetadata(category: ToolCategory, slug: string): Metadata {
  const tool = getTool(category, slug)
  return {
    title: tool.name,
    description: tool.seo,
    openGraph: {
      title: `${tool.name} · OneKit`,
      description: tool.seo,
    },
    alternates: { canonical: tool.href },
  }
}
