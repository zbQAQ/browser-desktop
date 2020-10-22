import React, { useState, useEffect, useRef } from "react"
import { timeFormat, animation } from "@/util/common"

import "./searchBar.css"

// function getRealStyleValue(el: HTMLElement, key: string) {
//   let value = window.getComputedStyle(el, null).getPropertyValue(key)
//   value = value.includes('px') ? value.replace("px", "") : value
//   return Number(value)
// }

// function animation(el: HTMLElement | null, options: Record<string, string | number>, time: number) {
//   if(!el) return;
//   let curVal = 0
//   const setStyle = (key: string, target: string) => {
//     if()
//     el.style[key] += getRealStyleValue(el, key) + target
//   }
//   for(let k in options) {
//     debugger;
//     curVal = getRealStyleValue(el, k)
//     setStyle(k, (curVal - options[k]) / time + 'px')
//   }
// }
interface IProps {
  // 时钟功能的flag
  timerFlag?: Boolean
}

export default function SearchBar(props: IProps) {
  const [timeText, setTimeText] = useState(timeFormat(new Date(), "HH:mm:ss"));
  const testBox = useRef(null)
  const { timerFlag = true } = props
  //时钟功能
  if(timerFlag) {
    setInterval(() => {
      setTimeText(timeFormat(new Date(), "HH:mm:ss"))
    }, 1000)
  }

  useEffect(() => {
    console.log("useEffect")
  }, [])

  const move = () => {
    console.log("mooove", testBox)
    animation(testBox.current, {
      width: 200,
      height: 500,
      "font-size": 30
    }, 5)
  }

  return (
    <div className="searchBar">
      <p className="countTime">{timeText}</p>

      <div ref={testBox} className="testBox">testBox</div>

      <button onClick={move}>click me</button>
    </div>
  )
}