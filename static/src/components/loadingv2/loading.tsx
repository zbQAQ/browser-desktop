import React from "react"

import "./loading.less"

export const enum LOADING_TYPE {
  // 正方形
  CUBE = "cube",
  // 缩放 圆
  ZOOM_CIRCLE = "zoom-circle",
  // 矩阵
  MATRIX = "matrix",
  // 渐变边框 圆
  GRADIENT_CIRCLE = "gradient-circle",
  // 正方形缩放 格子
  SQUARE_LATTICE = "square-lattice",
  // 彩虹进度条
  RAINBOW_PROGRESS = "rainbow-progress",
}

interface IProps {
  // 显示隐藏
  visible: boolean

  // loading 类型
  type: LOADING_TYPE

  // className
  className?: string
}

export default function Loading(props: IProps) {
  const { type, className = "" } = props

  const renderByType = () => {
    switch (type) {
      case LOADING_TYPE.CUBE :
        return <div className={"loadingv2-container cube " + className}></div>
      case LOADING_TYPE.ZOOM_CIRCLE :
        return <div className={"loadingv2-container zoom-circle " + className}></div>
      case LOADING_TYPE.MATRIX :
        return (
          <div className={"loadingv2-container matrix " + className}>
            <div className="place"></div>
            <div className="place"></div>
            <div className="place"></div>
            <div className="place"></div>
            <div className="place"></div>
          </div>
        )
      case LOADING_TYPE.GRADIENT_CIRCLE :
        return <div className={"loadingv2-container gradient-circle " + className}></div>
      case LOADING_TYPE.SQUARE_LATTICE :
        return <div className={"loadingv2-container square-lattice " + className}>
          <div className="lat"></div>
          <div className="lat"></div>
          <div className="lat"></div>

          <div className="lat"></div>
          <div className="lat"></div>
          <div className="lat"></div>

          <div className="lat"></div>
          <div className="lat"></div>
          <div className="lat"></div>
        </div>
      case LOADING_TYPE.RAINBOW_PROGRESS :
        return <div className={"loadingv2-container rainbow-progress " + className}>
          <div className="progress"></div>
        </div>
      default:
        return <h1>default</h1>
    }
  }

  return renderByType()
}