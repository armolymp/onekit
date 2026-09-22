import { SplitPdfTool } from "@/components/tools/split-pdf"
import { ToolLayout } from "@/components/tool-layout"
import { getTool } from "@/lib/tools"
import { toolMetadata } from "@/lib/tool-metadata"

const tool = getTool("pdf", "split")
export const metadata = toolMetadata("pdf", "split")

export default function Page() {
  return (
    <ToolLayout tool={tool}>
      <SplitPdfTool />
    </ToolLayout>
  )
}
