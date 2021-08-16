import React, { useEffect, useRef } from "react";

import { CUBE_SIZE, SPACEING, KEY_MAPS, TRANSITION_TIME } from "./game2048"

import "./game2048.less"


export interface ICubeType {
  id: string;
  // 地图坐标 y 纵向
  mapY: number;
  // 地图坐标 x 横向
  mapX: number;
  // 显示值
  value: number;
  // 选择角度 需要根据移动距离计算，需要是 x%360为0
  rotateX: 0
  rotateY: 0
}

type IProps = ICubeType & { animation: boolean, action: KEY_MAPS | null }


export default function Cube(props: IProps) {
  const { id, mapY, mapX, value, rotateX, rotateY, animation, action } = props
  const ref = useRef(null)

  const newStyles = {
    top: (CUBE_SIZE * mapY) + (SPACEING * mapY),
    left: (CUBE_SIZE * mapX) + (SPACEING * mapX),
    transform: value === 0 ? "scale(0) rotateX(-8deg) rotateY(8deg)" : action === KEY_MAPS.UP || action === KEY_MAPS.DOWN ? `scale(1) rotateX(${rotateX - 8}deg) rotateY(${rotateY + 8}deg)` : `scale(1) rotateX(${rotateX - 8}deg) rotateY(${rotateY + 8}deg)`,
    // transform: value === 0 ? "scale(0) rotateX(-8deg) rotateY(8deg)" : "scale(1) rotateX(-8deg) rotateY(8deg)",
    transitionProperty: animation ?  "all" : "none",
  }


  return (
    <div id={id} ref={ref} className="cube" style={newStyles}>
      <div className="side">{value} <span style={{fontSize: "12px"}}>{id}</span></div>
      <div className="side">{value}</div>
      <div className="side">{value}</div>
      <div className="side">{value}</div>
      <div className="side">{value}</div>
      <div className="side">{value}</div>
    </div>
  )
}