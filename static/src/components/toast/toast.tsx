import React, { useCallback, useEffect, useState } from "react"
import TransitionGroup from "@/components/transitionGroup/transitionGroup"
import TransitionGroupV2 from "@/components/transitionGroup/transitionGroup2"

import useToast from "@/hooks/useToast"

import "./toast.less"

type ToastPosition = 'left' | 'center' | 'right'
export interface ToastInstance {
  // toast 实例id 不需要传入自动生成
  id?: number,
  // visible 控制是否显示
  visible?: boolean
  // toast内容
  content: string
  // 'left' | 'center' | 'right' toast定位左 中 右
  position?: ToastPosition
  // 宽度
  width?: number
}


export default function Toast(props: ToastInstance) {
  const { content, id, visible = false, width } = props
  const { hideToast } = useToast()
  const style = {
    width: width
  }
  
  return (
    <TransitionGroupV2
      visible={visible}
      className="relative"
      enterAnimation="lightSpeedIn"
      levaeAnimation="zoomOutDown"
      levaeDeleteDom={true}
    >
      <div className="toast" id={id + ""} style={style}>
        <h1>{id}</h1>
        <p>{content}</p>
        <div onClick={() => hideToast(id)}>关闭123</div>
      </div>
    </TransitionGroupV2>
  )
  
}