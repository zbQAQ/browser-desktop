import React, { useState } from "react";
import { ITooltipType } from "./tooltipInstance"
import useTooltip from "@/hooks/useTooltip"

type ITooltipOption = ITooltipType

const defaultOption: ITooltipOption = {
  content: "default",
  placement: "top",
  color: "rgba(0, 0, 0, 0.75)"
}

export default function Tooltip(props: ITooltipOption & { children: any }) {
  const [ id, setId ] = useState("")
  const options = Object.assign({}, defaultOption, props)
  const { children, content, placement, color } = options
  const { showToolTip, hideToolTip } = useTooltip()

  const newMouseEnter = (e: MouseEvent) => {
    const { target } = e
    const nid = showToolTip({ content, placement, id, color }, target as HTMLElement)
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
