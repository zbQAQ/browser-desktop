import React, { PropsWithChildren, useRef, useCallback } from "react"

import "./transitionGroup.css"
interface IProps {
  // 显示 / 隐藏
  visible: boolean;

  //进入动画 的名称
  //动画效果参考 https://digital-flowers.github.io/react-animated-css.html
  enterAnimation?: string;
  
  //离开动画 的名称
  leaveAnimation?: string;

  //动画执行周期 单位ms
  delay?: number;

  className?: string;

}

export default function TransitionGroup(props: PropsWithChildren<IProps>) {
  const { enterAnimation = "fadeIn", leaveAnimation = "fadeOut", visible, delay = 500, className = '' } = props
  const transitionGroup = useRef<HTMLDivElement>(null);

  // const addEventListener = (el: HTMLDivElement, eventName: string, callBack: ()=>void) => {
  //   if(!el) return;
  //   el.addEventListener(eventName, callBack)
  // }
  // const removeEventListener = (el: HTMLDivElement | null, eventName: string, callBack: ()=>void) => {
  //   if(!el) return;
  //   el.removeEventListener(eventName, callBack)
  // }

  const render = useCallback(() => {
    const initStyle = {
      // 控制动画结束后 隐藏的时间 所以需要比动画执行的时间长
      // transition: `opacity ${delay + 50}ms`,
      animationDuration: `${delay}ms`,
      animationName: visible ? enterAnimation : leaveAnimation,
    }

    const classs = `transitionGroup ${className} ${visible ? 'pointerEventsAll' : 'pointerEventsNone'}`

    return (<div className={classs} ref={transitionGroup} style={initStyle}>{props.children}</div>)
  }, [visible, delay])

  return render()
}