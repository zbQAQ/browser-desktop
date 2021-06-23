import React from "react"

import "./mIcon.css";

interface IProps {
  iconName: string
  iconType?: string
  className?: string
  onClick?: Function
}
//支持多色图标 
export default function mIcon(props: IProps) {
  const { iconName, iconType = "svg", className = '', onClick } = props
  const render = () => {
    if(iconType === "svg") {
      return (
        <svg className={`msvg ${className}`} aria-hidden="true" onClick={()=>{onClick && onClick()}}>
          <use xlinkHref={`#${iconName}`}></use>
        </svg>
      )
    }

    if(iconType === "iconfont") {
      return(
        <i className={`iconfont ${iconName} ${className}`} onClick={() => {onClick && onClick()}}></i>
      )
    }

    return(<span>icon error</span>)
  }

  return render()
} 