import React, { useCallback, useContext, useEffect, useRef, useState } from "react"

import TransitionGroup from "@/components/transitionGroup/transitionGroup"
import { AppInfoContext } from "@/context/appInfoProvider"

import "./wallpaper.less"
interface IProps {
  isBlur: boolean
}

function getPixelColor(context: any, x: number, y: number) {
  let imageData = context.getImageData(x, y, 1, 1)
  let pixel = imageData.data
  let r = pixel[0]
  let g = pixel[1]
  let b = pixel[2]
  let a = pixel[3] / 255
  a = Math.round(a * 100) / 100
  return {
    rgba: "rgba(" + r + "," + g + "," + b + "," + a + ")",
    r: r,
    g: g,
    b: b,
    a: a,
  }
}

export default function Wallpaper(props: IProps) {
  const { isBlur } = props
  const { wallpaper } = useContext(AppInfoContext)
  const [ loadStatus, setLoadStatus ] = useState(false)
  const canvasMain = useRef(null) as any

  const imageLoader = useCallback((url) => {
    return new Promise((resolve, reject) => {
      const imageDom = new Image()
      // TODO: 需要优化这里wallpaper会加载两次的问题
      imageDom.onload = () => {
        const canvasDom = canvasMain.current
        const context = canvasDom.getContext("2d")
        context.drawImage(imageDom, 0, 0);
        const { rgba } = getPixelColor(context, 1, 1)
        document.body.style.backgroundColor = rgba
        resolve(undefined)
      }
      imageDom.onerror = () => {
        reject();
      }
      imageDom.crossOrigin = 'anonymous';
      imageDom.src = url
    })
  }, [canvasMain])

  useEffect(() => {
    setLoadStatus(false)
    imageLoader(wallpaper).then(_ => {
      setLoadStatus(true)
    })
  }, [wallpaper])

  return (
    <div className={`background ${isBlur ? 'blur': ''}`}>
      {/* <TransitionGroup
        visible={loadStatus}
        enterAnimation="fadeIn"
        levaeAnimation="fadeOut" 
      >
        {loadStatus && <div className='wallpaper-image' style={{backgroundImage: `url(${wallpaper})`}}></div>}
      </TransitionGroup> */}
      <canvas ref={canvasMain} className="none" id="canvas"></canvas>
    </div>
  )
}


