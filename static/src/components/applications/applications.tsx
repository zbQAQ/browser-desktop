import React, { useContext } from "react"
import { AppInfoContext, APP_ACTION_TYPE } from "@/context/appInfoProvider"
import { desktopApp } from "@/config/appContentMap"

import MIcon from "@/components/mIcon/mIcon"

import "./applications.less"

export default function Applications() {
  const data = desktopApp
  let { dispatch } = useContext(AppInfoContext)
  
  const renderIcon = (iconType: string, iconName: string) => {
    return <MIcon iconName={iconName} iconType={iconType}></MIcon>
  }

  const setAppKey = (appKey: IAppKey) => {
    const payload = { appKey }
    dispatch({ type: APP_ACTION_TYPE.UPDATE_APP, payload })
  }

  return (
    <div className="applications">
      {data.map((item: IDesktopAppType) => (
        <div className="aitem textCenter pointer" key={item.id} onClick={()=>setAppKey(item.key)}>
          <div className="icon">
            {renderIcon(item.iconType, item.iconName)}
          </div>
          <div className="name">{item.name}</div>
        </div>
      ))}
    </div>
  )
}