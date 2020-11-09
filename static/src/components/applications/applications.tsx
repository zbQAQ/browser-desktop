import React from "react"
import MSvg from "@/components/mSvg/mSvg"

import mockData from "./mockData"

import "./applications.css"


export default function Applications() {
  const data = mockData

  const renderIcon = (iconType: string, iconName: string) => {
    if(iconType === 'svg') {
      return <MSvg iconName={iconName}></MSvg>
    }
  }

  return (
    <div className="applications">
      {data.map(item => (
        <div className="aitem textCenter pointer" key={item.id}>
          <div className="icon">
            {renderIcon(item.iconType, item.iconName)}
          </div>
          <div className="name">{item.name}</div>
        </div>
      ))}
    </div>
  )
}