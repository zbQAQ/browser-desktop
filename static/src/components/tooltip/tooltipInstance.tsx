import React, { useEffect, useRef } from "react"

import TransitionGroup from "@/components/transitionGroup"

import "./tooltipInstance.less"

export type PlacementType = "top" | "right" | "bottom" | "left"

export interface ITooltipType {
  /** id 自动生成不需要手动传入 */ 
  id: string
  /** 控制显示隐藏 不需要手动传入 */
  visible?: boolean
  /** tooltip 显示的文本内容 */
  content: string
  /** tooltip 显示的位置 */
  placement: PlacementType
  /** position top */
  top?: number;
  /** position left */
  left?: number
  /** 触发的节点 */
  triggerTarget?: HTMLElement
}

type IProps = ITooltipType & {
  updateTooltipPosition: (instance: HTMLDivElement, id: string) => void
}

export const ARROW_SIZE = 12

export default function TooltipInstance(props: IProps) {
  const instance = useRef<HTMLDivElement>(null)
  const {id, visible, content, placement, top, left, updateTooltipPosition} = props

  const classs = `tooltip-instance` 

  const styless = {
    left: visible ? left : 0,
    top: visible ? top : 0,
    visibility: visible ? "visible" : "hidden"
  } as React.CSSProperties;

  useEffect(() => {
    if(instance && instance.current) {
      updateTooltipPosition(instance.current, id)
    }
  }, [instance])

  return (
    <TransitionGroup
      visible={!!visible}
      leaveAnimation="fadeOut"
      enterAnimation="fadeIn"
    >
      <div id={id} ref={instance} className={classs} style={styless}>
        <div className={"tooltip-arrow " + placement}>
          <span className="arrow-content"></span>
        </div>
        <div className="tooltip-inner">{content}</div>
      </div>
    </TransitionGroup>
  )
}