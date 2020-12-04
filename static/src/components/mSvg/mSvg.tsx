import React from "react"

import "./mSvg.css";

interface IProps {
  iconName: string;
  className?: string
}
//支持多色图标 
export default function MSvg(props: IProps) {
  const { iconName, className = '' } = props
  return (
    <svg className={`iconfont ${className}`} aria-hidden="true">
      <use xlinkHref={`#${iconName}`}></use>
    </svg>
  )
} 