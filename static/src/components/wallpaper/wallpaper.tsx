import React, { useEffect, useRef, useState } from "react"

import "./wallpaper.css"
interface IProps {
  isBlur: boolean
}

function setBodyBackground(canvasDom: any, imageUrl: string) {
  // 为解决 filter: blur 过渡的过程中泛出body背景色的问题
  // 在这里获取图片资源 1,1 坐标像素的颜色 给body设置背景色
  const context = canvasDom.getContext("2d")
  const imageDom = new Image()
  imageDom.src = imageUrl
  console.log("imageurl", imageUrl)
  imageDom.onload = () => {
    console.log("imageDom onload")
    context.drawImage(imageDom, 0, 0);
    const { rgba } = getPixelColor(context, 1, 1)
    document.body.style.backgroundColor = rgba
  }
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
  const [image, setImage] = useState({}) as any
  const canvasMain = useRef(null) as any

  useEffect(() => {
    setImage(require("@/assets/background.jpg"))  //default background images
  }, [])

  useEffect(() => {
    setBodyBackground(canvasMain.current, image.default)
  }, [image])

  const style = {
    backgroundImage: `url(${image.default})`
  }
  return (
    <div className={`background ${isBlur ? 'blur': ''}`} style={style}>
      <canvas ref={canvasMain} className="none" id="canvas"></canvas>
    </div>
  )
}


