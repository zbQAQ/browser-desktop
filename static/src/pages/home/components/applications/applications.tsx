import React, { useContext } from "react"
import { AppInfoContext } from "../../home"
import mockData, { IMockFace } from "@/config/mockData"

import MIcon from "@/components/mIcon/mIcon"

import "./applications.css"


export default function Applications() {
  const data = mockData
  //context引发的重复渲染 详见https://zhuanlan.zhihu.com/p/50336226
  let { setAppKey } = useContext(AppInfoContext)
  
  const renderIcon = (iconType: string, iconName: string) => {
    if(iconType === 'svg') {
      return <MIcon iconName={iconName}></MIcon>
    }
  }

  return (
    <div className="applications">
      {data.map((item: IMockFace) => (
        <div className="aitem textCenter pointer" key={item.id} onClick={()=>{setAppKey(item.key)}}>
          <div className="icon">
            {renderIcon(item.iconType, item.iconName)}
          </div>
          <div className="name">{item.name}</div>
        </div>
      ))}
    </div>
  )
}