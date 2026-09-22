import { ResizeImageTool } from "@/components/tools/resize-image"
import { ToolLayout } from "@/components/tool-layout"
import { getTool } from "@/lib/tools"
import { toolMetadata } from "@/lib/tool-metadata"

const tool = getTool("image", "resize")
export const metadata = toolMetadata("image", "resize")

export default function Page() {
  return (
    <ToolLayout tool={tool}>
      <ResizeImageTool />
    </ToolLayout>
  )
}
