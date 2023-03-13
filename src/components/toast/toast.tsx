import React, { useCallback, useEffect, useMemo, useState } from "react"

import MIcon from "@/components/mIcon/mIcon"
import TransitionGroup from "@/components/transitionGroup"

import useToast from "@/hooks/useToast"

import "./toast.less"

export type ToastPosition = 'left' | 'center' | 'right'

type ToastType = 'null' | 'warning' | 'info' | 'success' | 'error'

export interface ToastInstance {
  // toast 实例id 不需要传入自动生成
  id?: string,
  // visible 控制是否显示
  visible?: boolean
  // toast内容
  content: string
  // 'left' | 'center' | 'right' toast定位左 中 右
  position?: ToastPosition
  // 距离屏幕顶部 Y 值
  top?: number
  // 自动关闭开关 默认true
  autoClose?: boolean
  // 自动关闭延时, autoClose 为 true 时有效
  autoCloseDelay?: number
  // 是否显示 closeBtn
  showCloseBtn?: boolean
  // toast type
  type?: ToastType
}

type IProps = ToastInstance & { resetTopCallback: () => any }

const enterAnimationMap = {
  left: "fadeInLeft",
  center: "fadeInDown",
  right: "fadeInRight",
}

const leaveAnimationMap = {
  left: "fadeOutLeft",
  center: "fadeOutUp",
  right: "fadeOutRight",
}

const toastTypeMap = {
  null: null,
  info: <MIcon iconName="iconicon-test1" />,
  success: <MIcon iconName="iconchenggong" />,
  warning: <MIcon iconName="iconicon-test" />,
  error: <MIcon iconName="iconshibai" />,
}

export default function Toast(props: IProps) {
  const { 
    id, 
    top = 0, 
    type = "null",
    content, 
    visible = false, 
    autoClose = true, 
    autoCloseDelay = 3000, 
    position = "center", 
    showCloseBtn = false,
    resetTopCallback
  } = props
  const { hideToast } = useToast()
  const [ timer, setTimer ] = useState<number | null>(null)
  
  useEffect(() => {
    if(!timer && autoClose) {
      const timer = window.setTimeout(() => {
        hideToast(id)
      }, autoCloseDelay);
      setTimer(timer)
    }
  }, [id, timer, autoClose, autoCloseDelay, hideToast])

  const styleee = useMemo(() => {
    const initStyle = {
      top: top + "px",
    }

    if(position === 'left') {
      initStyle["left"] = "1rem"
    }

    if(position === 'right') {
      initStyle["right"] = "1rem"
    }

    if(position === 'center') {
      initStyle["left"] = "50%"
      initStyle["transform"] = "translateX(-50%)"
    }

    return initStyle
  }, [position, top])

  const leaveTrigger = useCallback(() => {
    timer && window.clearInterval(timer)
    resetTopCallback && resetTopCallback()
  }, [resetTopCallback])

  return (
    <div className={`toast ${showCloseBtn ? 'has-closebtn' : ''}`}  id={"toast-" + id} style={styleee}>
      <TransitionGroup
        delay={200}
        visible={visible}
        leaveAnimationTrigger={leaveTrigger}
        enterAnimation={enterAnimationMap[position]}
        leaveAnimation={leaveAnimationMap[position]}
      >
        <div className="toast-inner">
          {type !== "null" && <span className="pre-icon">{toastTypeMap[type]}</span>}
          <span>{content}</span>
        </div>
        {showCloseBtn && (
          <div className="close-btn pointer" onClick={() => hideToast(id)}>
            <MIcon iconName="iconclose" />
          </div>
        ) }
      </TransitionGroup>
    </div>
  )
  
}