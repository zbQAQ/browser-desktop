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
  // point 跳动
  POINT_BOUNCE = "point-bounce",
  // 移动方块
  BLOCK_MOVE = "block-move",
  // 黏糊糊的点
  GOOEY_POINT = "gooey-point",
  // 会走的方块
  BLOCK_WALK = "block-walk",
  // 模糊的字体
  BLUR_FONT = "blur-font",
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

  const rendererContainer = (ele: React.ReactNode) => {
    return <div className={"loadingv2-container " + className}>{ele}</div>
  }

  const renderByType = () => {
    switch (type) {
      case LOADING_TYPE.CUBE :
        return rendererContainer(<div className="entity cube"></div>)
      case LOADING_TYPE.ZOOM_CIRCLE :
        return rendererContainer(<div className="entity zoom-circle"></div>)
      case LOADING_TYPE.MATRIX :
        return rendererContainer(
          <div className="entity matrix">
            <div className="place"></div>
            <div className="place"></div>
            <div className="place"></div>
            <div className="place"></div>
            <div className="place"></div>
          </div>
        )
      case LOADING_TYPE.GRADIENT_CIRCLE :
        return rendererContainer(<div className="entity gradient-circle"></div>)
      case LOADING_TYPE.SQUARE_LATTICE :
        return rendererContainer(
          <div className="entity square-lattice">
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
        )
      case LOADING_TYPE.RAINBOW_PROGRESS :
        return rendererContainer(
          <div className="entity rainbow-progress">
            <div className="progress"></div>
          </div>
        )
      case LOADING_TYPE.POINT_BOUNCE :
        return rendererContainer(
          <div className="entity point-bounce">
            <div className="point"></div>
            <div className="point"></div>
            <div className="point"></div>
            <div className="shadow"></div>
            <div className="shadow"></div>
            <div className="shadow"></div>
          </div>
        )
      case LOADING_TYPE.BLOCK_MOVE :
        return rendererContainer(
          <div className="entity block-move">
            <div className="block"></div>
            <div className="block"></div>
            <div className="block"></div>
          </div>
        )
      case LOADING_TYPE.GOOEY_POINT :
        return rendererContainer(
          <div className="entity gooey-point">
            <span className="dot"></span>
            <div className="dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )
      case LOADING_TYPE.BLOCK_WALK :
        return rendererContainer(
          <div className="entity block-walk">
            <div className="block b1"></div>
            <div className="block b2"></div>
          </div>
        )
      case LOADING_TYPE.BLUR_FONT :
        return rendererContainer(
          <div className="entity blur-font">
            <div className="font">L</div>
            <div className="font">o</div>
            <div className="font">a</div>
            <div className="font">d</div>
            <div className="font">i</div>
            <div className="font">n</div>
            <div className="font">g</div>
          </div>
        )
      default:
        return <h1>Loading...</h1>
    }
  }

  return renderByType()
}