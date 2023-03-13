import React, { useEffect, useState } from "react"

import "./numberBlock.less"

import Lines from "./line"

interface IProps {
  // 显示的数字
  value: string
  // rotateX
  rotateX: number
  // rotateY
  rotateY: number
}

export default function NumberBlock(props: IProps) {
  const { value, rotateX, rotateY } = props
  const isColon = value === ":"

  const renderColon = () => {
    const styleess = {transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`}
    return (
      <div className="colon" style={styleess}>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    )
  }

  return isColon ? renderColon() : (
    <div className="number-block">
      <Lines value={value} rotateX={rotateX} rotateY={rotateY} />
    </div>
  )
}

// {/* 底部 */}
// <div className="line bottom horizontal ">
// <div className="inner-shadow"></div>
// <div className="inner"></div>
// </div>

// {/* 右1 */}
// <div className="line right1 vertical">
// <div className="inner-shadow"></div>
// <div className="inner"></div>
// </div>

// {/* 右2 */}
// <div className="line right2 vertical ">
// <div className="inner-shadow"></div>
// <div className="inner"></div>
// </div>

// {/* 左2 */}
// <div className="line left2 vertical unfocus">
// <div className="inner-shadow"></div>
// <div className="inner"></div>
// </div>

// {/* 中间 */}
// <div className="line mid horizontal">
// <div className="inner-shadow"></div>
// <div className="inner"></div>
// </div>

// {/* 左1 */}
// <div className="line left1 vertical">
// <div className="inner-shadow"></div>
// <div className="inner"></div>
// </div>

// {/* 上 */}
// <div className="line top horizontal">
// <div className="inner-shadow"></div>
// <div className="inner"></div>
// </div>