import { CompressVideoTool } from "@/components/tools/compress-video"
import { ToolLayout } from "@/components/tool-layout"
import { getTool } from "@/lib/tools"
import { toolMetadata } from "@/lib/tool-metadata"

const tool = getTool("video", "compress")
export const metadata = toolMetadata("video", "compress")

export default function Page() {
  return (
    <ToolLayout tool={tool}>
      <CompressVideoTool />
    </ToolLayout>
  )
}
