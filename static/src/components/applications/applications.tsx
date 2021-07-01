import React, { useContext } from "react"
import { AppInfoContext } from "@/pages/home/home"
import { desktopApp } from "@/config/appContentMap"

import MIcon from "@/components/mIcon/mIcon"

import "./applications.less"

export default function Applications() {
  const data = desktopApp
  //context引发的重复渲染 详见https://zhuanlan.zhihu.com/p/50336226
  let { setAppKey } = useContext(AppInfoContext)
  
  const renderIcon = (iconType: string, iconName: string) => {
    return <MIcon iconName={iconName} iconType={iconType}></MIcon>
  }

  return (
    <div className="applications">
      {data.map((item: IDesktopAppType) => (
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