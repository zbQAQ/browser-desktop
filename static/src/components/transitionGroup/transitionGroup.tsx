import React, { useEffect, useRef, useState, useCallback } from "react"

import "./transitionGroup.css"
interface IProps {
  // 显示 / 隐藏
  visible: boolean;

  //进入动画 的名称
  //动画效果参考 https://digital-flowers.github.io/react-animated-css.html
  enterAnimation?: string;
  
  //离开动画 的名称
  levaeAnimation?: string;

  //动画执行周期 单位ms
  delay?: number;

  className?: string;

  children?: React.ReactNode
}

export default function TransitionGroup(props: IProps) {
  const { enterAnimation = "fadeIn", levaeAnimation = "fadeOut", visible, delay = 500, className = '' } = props
  // 需要用新的标识用在 动画结束后 隐藏元素
  const [ flag, setFlag ] = useState(visible)
  const transitionGroup = useRef<HTMLDivElement>(null);

  // const addEventListener = (el: HTMLDivElement, eventName: string, callBack: ()=>void) => {
  //   if(!el) return;
  //   el.addEventListener(eventName, callBack)
  // }
  // const removeEventListener = (el: HTMLDivElement | null, eventName: string, callBack: ()=>void) => {
  //   if(!el) return;
  //   el.removeEventListener(eventName, callBack)
  // }

  useEffect(() => {
    if(visible) {
      setFlag(visible)
    } else {
      setTimeout(() => setFlag(visible), delay)
    }
  }, [visible])

  const render = () => {
    const initStyle = {
      // 控制动画结束后 隐藏的时间 所以需要比动画执行的时间长
      // transition: `opacity ${delay + 50}ms`,
      animationDuration: `${delay}ms`,
      animationName: visible ? enterAnimation : levaeAnimation,
    }
    const classes = `transitionGroup ${className} ${flag ? "show" : "hide"} ${visible ? 'pointerEventsAll' : 'pointerEventsNone'}`

    return (<div className={classes} ref={transitionGroup} style={initStyle}>{props.children}</div>)
  }

  return render()
}