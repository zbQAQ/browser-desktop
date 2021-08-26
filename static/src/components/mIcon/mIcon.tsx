import React from "react"

import "./mIcon.css";

interface IProps {
  iconName: string
  iconType?: string
  className?: string
  onClick?: Function
  hasStroke?: boolean
}
//支持多色图标 
export default function mIcon(props: IProps) {
  const { iconName, iconType = "svg", className = '', hasStroke = false, onClick } = props
  const render = () => {
    if(iconType === "svg") {
      return (
        <svg className={`msvg ${className} ${hasStroke ? "stroke" : ""}`} aria-hidden="true" onClick={(e)=>{onClick && onClick(e)}}>
          <use xlinkHref={`#${iconName}`}></use>
        </svg>
      )
    }

    if(iconType === "iconfont") {
      return(
        <i className={`iconfont ${iconName} ${className} ${hasStroke ? "stroke" : ""}`} onClick={(e) => {onClick && onClick(e)}}></i>
      )
    }

    return(<span>icon error</span>)
  }

  return render()
} 