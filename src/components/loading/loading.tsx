import React from "react"

import "./loading.less"

interface IProps {
  // 显示隐藏
  visible: boolean

  className?: string
}

export default function Loading(props: IProps) {
  const { visible, className = '' } = props
  const classs = `loading-container ${className}`

  return visible ? (
    <div className={classs}>
      <div className="text">
        Loading
      </div>
    </div>
  ) : null
}