import { ConvertImageTool } from "@/components/tools/convert-image"
import { ToolLayout } from "@/components/tool-layout"
import { getTool } from "@/lib/tools"
import { toolMetadata } from "@/lib/tool-metadata"

const tool = getTool("image", "convert")
export const metadata = toolMetadata("image", "convert")

export default function Page() {
  return (
    <ToolLayout tool={tool}>
      <ConvertImageTool />
    </ToolLayout>
  )
}
