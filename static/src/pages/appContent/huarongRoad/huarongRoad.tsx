import React, { useEffect, useRef, useState } from "react"


import "./huarongRoad.css"

const capacity = { col: 8, row: 40 }

export default function HuarongRoad() {

  let gridMap = Array(capacity.row).fill(Array(capacity.col).fill(''))

  let goods: any = [
    {
      id: 1,
      backgroundColor: 'red',
      size: { col: 1, row: 1},
      coordinate: { x: 0, y: 0, angle: 0}
    }
  ]

  const renderGrid = () => {
    let html = []
    for(let i = 0; i < gridMap.length; i++) {
      const curRow = gridMap[i]
      for(let j = 0; j < curRow.length; j++) {
        html.push(<div className="singleGrid fontWhite textCenter">{i}, {j}</div>)
      }
    }
    return html
  }

  const renderGoods = () => {

  }
  
  const render = () => {
    return (
      <div className="huarongContainer">
        {renderGrid()}
      </div>
    )
  }

  return render()
}