import React, { useContext } from "react"
import { AppInfoContext, APP_ACTION_TYPE } from "@/context/appInfoProvider"
import { desktopApp } from "@/config/appContentMap"

// import DraggableItem from "@/components/draggable/draggable"
import TransitionGroup from "@/components/transitionGroup"
import MIcon from "@/components/mIcon/mIcon"

import "./applications.less"

interface IProps {
  visible: boolean
}

export default function Applications(props: IProps) {
  const data = desktopApp
  const { visible } = props
  let { dispatch } = useContext(AppInfoContext)
  
  const renderIcon = (iconType: string, iconName: string, hasStroke: boolean) => {
    return <MIcon iconName={iconName} iconType={iconType} hasStroke={hasStroke}></MIcon>
  }

  const setAppKey = (appKey: IAppKey) => {
    dispatch({ type: APP_ACTION_TYPE.UPDATE_APP, appKey })
  }

  return (
    <TransitionGroup 
      className={'applications-transition'}
      enterAnimation="fadeInLeft"
      leaveAnimation="fadeOut"
      visible={visible}
      delay={200}
      leaveDeleteDom={true}
    >
      <div className="applications">
        {data.map((item: IDesktopAppType) => (
          // <DraggableItem key={item.id} onDragEnd={console.log}>
            // <div className="aitem textCenter pointer" onDoubleClick={()=>setAppKey(item.key)}>
            <div className="aitem textCenter pointer" key={item.id} onClick={()=>setAppKey(item.key)}>
              <div className="icon">
                {renderIcon(item.iconType, item.iconName, !!item.iconStroke)}
              </div>
              <div className="name">{item.name}</div>
            </div>
          //</DraggableItem>
        ))}
      </div>
    </TransitionGroup>
  )
}