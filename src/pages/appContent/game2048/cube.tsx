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

const COLOR_MAP = {
  2: '239, 226, 217',
  4: '238, 224, 198',
  8: '238, 177, 122',
  16: '235, 141, 80',
  32: '247, 123, 97',
  64: '235, 91, 64',
  128: '247, 214, 98',
  256: '240, 207, 20',
  512: '234, 195, 2',
  1024: '221, 190, 47',
  2048: '222, 177, 16',
  4096: '34, 240, 141',
  8192: '37, 185, 99',
  16384: '37, 185, 99',
  32768: '37, 185, 99',
  65536: '37, 185, 99',
  131072: '37, 185, 99',
}


export default function Cube(props: IProps) {
  const { id, mapY, mapX, value, rotateX, rotateY, animation, action } = props
  const ref = useRef(null)

  const newStyles = {
    top: (CUBE_SIZE * mapY) + (SPACEING * mapY),
    left: (CUBE_SIZE * mapX) + (SPACEING * mapX),
    transform: value === 0 ? "scale(0) rotateX(-8deg) rotateY(8deg)" : action === KEY_MAPS.UP || action === KEY_MAPS.DOWN ? `scale(1) rotateX(${rotateX - 8}deg) rotateY(${rotateY + 8}deg)` : `scale(1) rotateX(${rotateX - 8}deg) rotateY(${rotateY + 8}deg)`,
    // transform: value === 0 ? "scale(0) rotateX(-8deg) rotateY(8deg)" : "scale(1) rotateX(-8deg) rotateY(8deg)",
    transitionProperty: animation ?  "transform, top, left" : "none",
    background: `rgb(${COLOR_MAP[value]})`
  }

  return (
    <div id={id} ref={ref} className="cube" style={newStyles}>
      <div className="side">{value}</div>
      <div className="side">{value}</div>
      <div className="side">{value}</div>
      <div className="side">{value}</div>
      <div className="side">{value}</div>
      <div className="side">{value}</div>
    </div>
  )
}