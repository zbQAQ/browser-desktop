import React, { useState } from "react";
import { PlacementType } from "./tooltipInstance"
import useTooltip from "@/hooks/useTooltip"

interface ITooltipProps {
  content: string
  placement?: PlacementType
}

export default function Tooltip(props: ITooltipProps & { children: any }) {
  const [ id, setId ] = useState("")
  const { children, content, placement = "top" } = props
  const { showToolTip, hideToolTip } = useTooltip()

  const newMouseEnter = (e: MouseEvent) => {
    const { target } = e
    const nid = showToolTip({ content, placement, id }, target as HTMLElement)
    setId(nid)
    if(children) {
      const { props } = children
      props && props.onMouseEnter && props.onMouseEnter(e)
    }
  }

  const newMouseLeave = (e: MouseEvent) => {
    hideToolTip(id) 
    if(children) {
      const { props } = children
      props && props.onMouseLeave && props.onMouseLeave(e)
    }
  }

  return React.cloneElement(children, { onMouseEnter: newMouseEnter, onMouseLeave: newMouseLeave })
} 
