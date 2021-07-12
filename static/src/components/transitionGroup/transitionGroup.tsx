import React, { useEffect, useRef, useState } from "react"

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
  const { enterAnimation = "fadeIn", levaeAnimation = "fadeOut", visible, delay = 500, className } = props
  const transitionGroup = useRef(null);
  const [firstMount, setFirstMount] = useState(true)

  // const addEventListener = (el: any, eventName: string, callBack: Function) => {
  //   if(!el) return;
  //   el.addEventListener(eventName, callBack)
  // }

  useEffect(() => {
    if(visible) {
      setFirstMount(false)
    }
  }, [visible])

  const render = () => {
    // debugger; 
    const initStyle = {
      opacity: visible ? 1 : 0,
      //控制动画结束后 隐藏的时间 所以需要比动画执行的时间长
      transition: `opacity ${delay + 50}ms`,
      animationDuration: `${delay}ms`,
      animationName: visible ? enterAnimation : !firstMount ? levaeAnimation : '',
    }
    const classes = `transitionGroup ${className} ${visible ? 'pointerEventsAll' : 'pointerEventsNone'}`

    return (<div className={classes} ref={transitionGroup} style={initStyle}>{props.children}</div>)
  }

  // useEffect(() => {
  //   // debugger;
  //   addEventListener(transitionGroup.current, "animationstart", () => {
  //     console.log("动画开始", props.visible)
  //   })
  //   addEventListener(transitionGroup.current, "animationend", () => {
  //     console.log("动画结束", props.visible)
  //   })

  //   // // listen for animation iteration
  //   // .addEventListener("animationiteration",function(e){
  //   //   console.log("log at beginning of each subsequent iteration");
  //   // },false);

  //   // // listen for animation end
  //   // transitionGroup.current.addEventListener("animationend",function(e){
  //   //   console.log("log at end of monkey animation");
  //   // },false);
  // }, [])
  return render()
}