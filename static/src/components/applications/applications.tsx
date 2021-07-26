import React, { useContext } from "react"
import { AppInfoContext, APP_ACTION_TYPE } from "@/context/appInfoProvider"
import { desktopApp } from "@/config/appContentMap"

import TransitionGroupV2 from "@/components/transitionGroup/transitionGroup2"
import MIcon from "@/components/mIcon/mIcon"

import "./applications.less"

interface IProps {
  visible: boolean
}

export default function Applications(props: IProps) {
  const data = desktopApp
  const { visible } = props
  let { dispatch } = useContext(AppInfoContext)
  
  const renderIcon = (iconType: string, iconName: string) => {
    return <MIcon iconName={iconName} iconType={iconType}></MIcon>
  }

  const setAppKey = (appKey: IAppKey) => {
    const payload = { appKey }
    dispatch({ type: APP_ACTION_TYPE.UPDATE_APP, payload })
  }

  return (
    <TransitionGroupV2 
      className={'applications-transition'}
      enterAnimation="fadeInLeft"
      leaveAnimation="fadeOut"
      visible={visible}
      delay={200}
      leaveDeleteDom={true}
    >
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
    </TransitionGroupV2>
  )
}