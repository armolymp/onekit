import { ConvertAudioTool } from "@/components/tools/convert-audio"
import { ToolLayout } from "@/components/tool-layout"
import { getTool } from "@/lib/tools"
import { toolMetadata } from "@/lib/tool-metadata"

const tool = getTool("audio", "convert")
export const metadata = toolMetadata("audio", "convert")

export default function Page() {
  return (
    <ToolLayout tool={tool}>
      <ConvertAudioTool />
    </ToolLayout>
  )
}
