import { MergePdfTool } from "@/components/tools/merge-pdf"
import { ToolLayout } from "@/components/tool-layout"
import { getTool } from "@/lib/tools"
import { toolMetadata } from "@/lib/tool-metadata"

const tool = getTool("pdf", "merge")
export const metadata = toolMetadata("pdf", "merge")

export default function Page() {
  return (
    <ToolLayout tool={tool}>
      <MergePdfTool />
    </ToolLayout>
  )
}
