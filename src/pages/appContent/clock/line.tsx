import React, { useEffect, useState } from "react"

import "./line.less"

// rotateX 对应 clientY 最大15deg 最小-15deg
export const MAX_ROTATEX = 15
export const MIN_ROTATEX = -15

// rotateY 对应 cliientX 最大45deg 最小-45deg
export const MAX_ROTATEY = 15
export const MIN_ROTATEY = -15

export enum LineType {
  left1 = "left1",
  left2 = "left2",
  right1 = "right1",
  right2 = "right2",
  top = "top",
  mid = "mid",
  bottom = "bottom"
}

enum layoutWay {
  left1 = "vertical",
  left2 = "vertical",
  right1 = "vertical",
  right2 = "vertical",
  top = "horizontal",
  mid = "horizontal",
  bottom = "horizontal",
}

export const layoutUnFocusInfo = {
  "0": [LineType.mid],
  "1": [LineType.left1, LineType.left2, LineType.top, LineType.mid, LineType.bottom],
  "2": [LineType.left1, LineType.right2],
  "3": [LineType.left2, LineType.left1],
  "4": [LineType.top, LineType.left2, LineType.bottom],
  "5": [LineType.right1, LineType.left2],
  "6": [LineType.right1],
  "7": [LineType.left2, LineType.left1, LineType.mid, LineType.bottom],
  "8": [],
  "9": [LineType.left2],
}

interface IProps {
  /** 数值 */
  value: string
  // rotateX
  rotateX: number
  // rotateY
  rotateY: number
}

export default function NumberLine(props: IProps) {
  const initLineData = [
    {
      type: LineType.bottom,
      unfocus: true
    },
    {
      type: LineType.right1,
      unfocus: true
    },
    {
      type: LineType.right2,
      unfocus: true
    },
    {
      type: LineType.left2,
      unfocus: true
    },
    {
      type: LineType.left1,
      unfocus: true
    },
    {
      type: LineType.mid,
      unfocus: false
    },
    {
      type: LineType.top,
      unfocus: true
    },
  ]
  const { value, rotateX, rotateY } = props
  const [ lineData, setLineData ] = useState(initLineData)

  useEffect(() => {
    const unFocusArr = layoutUnFocusInfo[value]
    setLineData(pre => {
      return pre.map(v => {
        v.unfocus = unFocusArr.includes(v.type)
        return v
      })
    })

  }, [value])

  return (
    <>
      {lineData.map(l => (
        <div className={`line ${l.type} ${layoutWay[l.type]} ${l.unfocus ? "unfocus" : ""}`} style={{transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`}}>
          <div className="inner-shadow"></div>
          <div className="inner"></div>
        </div>
      ))}
    </>
  )
} 