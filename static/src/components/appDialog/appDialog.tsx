import React, { useContext, useEffect, useState } from "react";
import ReactDOM from "react-dom";

import TransitionGroup from "@/components/transitionGroup/transitionGroup"
import MIcon from "@/components/mIcon/mIcon"

import { AppInfoContext, APP_ACTION_TYPE } from "@/context/appInfoProvider"
import { findAppContentByKey } from "@/util/appContent"

import "./appDialog.less"

interface IProps {
  visible: boolean;
}

export default function AppDialog(props: IProps) {
  const { visible } = props
  const [curAppCnt, setCurAppCnt] = useState<IAppContentMap>()
  const { appKey, dispatch } = useContext(AppInfoContext)
  const rootDom = document.getElementById("root")
  useEffect(() => {
    const result = findAppContentByKey(appKey)
    if(result) {
      setCurAppCnt(result)
    }
  }, [appKey])
  
  const renderConetent = () => {
    const Comp = curAppCnt && curAppCnt.renderComponents
    return (
      <TransitionGroup
        visible={visible}
        enterAnimation="fadeIn"
        levaeAnimation="fadeOut" 
      >
        <div className={`appDialog ${curAppCnt?.dialogStyle.join(' ')}`}>
          <div className="closeBtn pointer" onClick={()=> dispatch({ type: APP_ACTION_TYPE.CLEAR_APP }) }>
            <MIcon iconName="iconclose" />
          </div>
          {Comp && visible ? <Comp/> : <></>}
        </div>
      </TransitionGroup>
    )
  }
  
  return (
    !rootDom ? <></> : (
      ReactDOM.createPortal(renderConetent(), rootDom)
    )
  )
}