import { CompressImageTool } from "@/components/tools/compress-image"
import { ToolLayout } from "@/components/tool-layout"
import { getTool } from "@/lib/tools"
import { toolMetadata } from "@/lib/tool-metadata"

const tool = getTool("image", "compress")
export const metadata = toolMetadata("image", "compress")

export default function Page() {
  return (
    <ToolLayout tool={tool}>
      <CompressImageTool />
    </ToolLayout>
  )
}
