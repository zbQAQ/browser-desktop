import { useContext } from "react"
import { TooltipContext, ITooltipHelper } from "@/components/tooltip/tooltipProvider"

export default function useTooltip() {
  const toastHelprer = useContext(TooltipContext)
  return toastHelprer as ITooltipHelper
}