import React from "react"

import "./wallpaper.css"
interface IProps {
  isBlur: boolean
}

export default function Wallpaper(props: IProps) {
  const { isBlur } = props

  // background-image: url("@/assets/background.jpg");
  // background-image: url("@/assets/background.png"); 
  // const backgroundImage = new Image()
  // backgroundImage.src = "@/assets/background.png"
  // backgroundImage.onload = () => {
  //   console.log("images loaded")
  // }

  const background = require("@/assets/background.jpg")
  console.log("background", background)
  const styles = {
    backgroundImage: `url(${background.default})`
  }
  return (<div className={`background ${isBlur ? 'blur': ''}`} style={styles}></div>)
}


