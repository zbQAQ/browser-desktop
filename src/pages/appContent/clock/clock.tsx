import React, { useState } from "react"
import useSetInterval from "@/hooks/useSetInterval"
import { timeFormat } from "@/util/common"
import { MAX_ROTATEX, MAX_ROTATEY } from "./line"
import NumberBlock from "./numberBlock"

import "./clock.less"

const initTimeData = ["0", "0", ":", "0", "0", ":", "0", "0"]

export default function Clock() {
  const [ rotate, setRotate ] = useState({ x: -8, y: 8 })
  const [ timeData, setTimeData ] = useState(initTimeData)
  useSetInterval(() => {
    setTimeData(timeFormat(new Date(), "HH:mm:ss").split(""))
  }, 1000)

  const onMouseMove = (e: React.MouseEvent) => {
    const { clientY, clientX } = e
    // 负数不好计算rang 计算过程先 + 15 , 最后再 - 15
    const maxRotateX = MAX_ROTATEX + 15
    // 负数不好计算rang 计算过程先 + 15,  最后再 - 15
    const maxRotateY = MAX_ROTATEY + 15

    const maxClientY = document.body.clientHeight
    const maxClientX = document.body.clientWidth
   
    const rotateXRatio = maxClientY / maxRotateX;
    const rotateYRatio = maxClientX / maxRotateY;
   
    let rotateX = ( clientY / rotateXRatio ) - 15
    let rotateY = ( clientX / rotateYRatio ) - 15

    setRotate({ x: rotateX, y: rotateY })
  }

  return (
    <div className="clock-container" onMouseMove={onMouseMove}>
      <div className="clock-content">
        {
          timeData.map((v, index) => <NumberBlock key={index} value={v} rotateX={rotate.x} rotateY={rotate.y}/>)
        }
      </div>
    </div>
  )
}