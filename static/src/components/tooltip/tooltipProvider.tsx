import React, { createContext, useState, PropsWithChildren } from "react"

import TooltipContainer from "./tooltipContainer"
import { ITooltipType, PlacementType, ARROW_SIZE } from "./tooltipInstance"

import { generateId } from "@/util/common"

export interface ITooltipHelper {
  showToolTip: (options: ITooltipType, target: HTMLElement) => string,
  hideToolTip: (id: string) => void
}

export const TooltipContext = createContext<ITooltipHelper | null>(null)

function getPosByPlacement(placement: PlacementType, tooltipElement: HTMLDivElement, triggerTarget?: HTMLElement, ) {
  const pos = { left: 0, top: 0 }
  if(!triggerTarget) return pos;
  const triggerInfo = triggerTarget.getBoundingClientRect()
  const tooltipInfo = tooltipElement.getBoundingClientRect()
  console.log("triggerInfo", triggerInfo)
  switch(placement) {
    case "top":
      pos.top = triggerInfo.top - triggerInfo.height
      pos.left = triggerInfo.left + ( triggerInfo.width / 2 ) - ( tooltipInfo.width / 2 )
      break;
    case "right":
      pos.top = triggerInfo.top + ( triggerInfo.height / 2 ) - ( tooltipInfo.height / 2 )
      pos.left = triggerInfo.left + triggerInfo.width + ARROW_SIZE
      break;
    case "bottom":
      pos.top = triggerInfo.top + triggerInfo.height + ARROW_SIZE
      pos.left = triggerInfo.left + ( triggerInfo.width / 2 ) - ( tooltipInfo.width / 2 )
      break;
    case "left":
      pos.top = triggerInfo.top + ( triggerInfo.height / 2 ) - ( tooltipInfo.height / 2 )
      pos.left = triggerInfo.left - tooltipInfo.width - ARROW_SIZE
      break;
    default: 
      break;
  }
  return pos
}


export default function TooltipProvider(props: PropsWithChildren<{}>) {

  const [ tooltips, setTooltips ] = useState<ITooltipType[]>([])

  //等 tooltipInstance 生成后获取宽高 修正left top
  const updateTooltipPosition = (instance: HTMLDivElement, id: string) => {
    setTooltips(pre => {
      return pre.map(t => {
        if(t.id === id) {
          const { left, top } = getPosByPlacement(t.placement, instance, t.triggerTarget)
          t.left = left
          t.top = top
          t.visible = true
        }
        return t
      })
    })
  }

  const show = (options: ITooltipType, triggerTarget: HTMLElement) => {
    const { id } = options
    if(id === "") {
      const nid =  generateId()
      // 如果是第一次触发 则不直接显示 等待 left、top 计算结束再显示
      setTooltips(pre => [...pre, { ...options, id: nid, triggerTarget, visible: false }])
      return nid
    } else {
      setTooltips(pre => {
        return pre.map(t => {
          if(t.id === id) t.visible = true;
          return t
        })
      })
      return id
    }
  }

  const hide = (id: string) => {
    setTooltips(pre => {
      return pre.map(t => {
        if(t.id === id) t.visible = false;
        return t
      })
    })
  }


  const contextValue: ITooltipHelper = {
    showToolTip: show,
    hideToolTip: hide,
  }

  return <TooltipContext.Provider value={contextValue}>
    {props.children}
    <TooltipContainer tooltips={tooltips} updateTooltipPosition={updateTooltipPosition}></TooltipContainer>
  </TooltipContext.Provider>
}