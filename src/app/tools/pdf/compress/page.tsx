import { CompressPdfTool } from "@/components/tools/compress-pdf"
import { ToolLayout } from "@/components/tool-layout"
import { getTool } from "@/lib/tools"
import { toolMetadata } from "@/lib/tool-metadata"

const tool = getTool("pdf", "compress")
export const metadata = toolMetadata("pdf", "compress")

export default function Page() {
  return (
    <ToolLayout tool={tool}>
      <CompressPdfTool />
    </ToolLayout>
  )
}
