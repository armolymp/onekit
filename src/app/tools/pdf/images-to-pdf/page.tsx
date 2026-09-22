import { ImagesToPdfTool } from "@/components/tools/images-to-pdf"
import { ToolLayout } from "@/components/tool-layout"
import { getTool } from "@/lib/tools"
import { toolMetadata } from "@/lib/tool-metadata"

const tool = getTool("pdf", "images-to-pdf")
export const metadata = toolMetadata("pdf", "images-to-pdf")

export default function Page() {
  return (
    <ToolLayout tool={tool}>
      <ImagesToPdfTool />
    </ToolLayout>
  )
}
