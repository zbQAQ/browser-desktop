import React from "react"

import "./mSvg.css";

interface IProps {
  iconName: string;
  className?: string
}

export default function MSvg(props: IProps) {
  const { iconName, className = '' } = props
  return (
    <svg className={`iconfont ${className}`} aria-hidden="true">
      <use xlinkHref={`#${iconName}`}></use>
    </svg>
  )
} 