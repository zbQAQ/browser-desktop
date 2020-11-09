import React from "react"

interface IProps {
  iconName: string;
  className?: string
}

const iconfont = {
  width: '2em',
  height: '2em',
  verticalAlign: '-0.15em',
  fill: 'currentColor',
  overflow: 'hidden'
}

export default function MSvg(props: IProps) {
  const { iconName, className } = props
  return (
    <svg style={iconfont} className={className} aria-hidden="true">
      <use xlinkHref={`#${iconName}`}></use>
    </svg>
  )
} 