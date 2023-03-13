import React, { useEffect } from "react";
import TooltipInstance, { ITooltipType } from "./tooltipInstance"

import "./tooltipContainer.less"

interface IProps {
  tooltips: ITooltipType[],
  updateTooltipPosition: (instance: HTMLDivElement, id: string) => void
}

export default function TooltipContainer(props: IProps) {
  const { tooltips, updateTooltipPosition } = props

  return <div className="tooltipContainer">
    {tooltips.map(t => <TooltipInstance key={t.id} {...t} updateTooltipPosition={updateTooltipPosition} />)}
  </div>

}