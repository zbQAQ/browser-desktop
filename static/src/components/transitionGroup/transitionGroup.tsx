import React, { useEffect, useRef } from "react"

import { animation } from "@/util/common"

import "./transitionGroup.css"

interface IProps {
  enterAnimation: string;
  levaeAnimation: string;
  rate: number; //速率 越大越慢越小越快
  children?: React.ReactNode
}

export default function TransitionGroup(props: IProps) {
  const { enterAnimation = "fadeIn", levaeAnimation = "fadeOut", rate = 10 } = props
  const transitionGroup = useRef(null);

  const render = () => {
    let initialClassName = ""
    switch(enterAnimation) {
      case "fadeIn":
        initialClassName = "fade"
        break;
    }

    return (<div ref={transitionGroup} className={initialClassName}>{props.children}</div>)
  }

  useEffect(()=> {
    console.log("mount")
    animation(transitionGroup.current, {opacity: 100}, rate)

    return () => {
      console.log("unmount")
      animation(transitionGroup.current, {opacity: 0}, rate)
    }
  }, [])
  
  return render()
}