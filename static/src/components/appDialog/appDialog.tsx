import React, { useContext, useEffect, useState } from "react";
import ReactDOM from "react-dom";

import TransitionGroup from "@/components/transitionGroup/transitionGroup"
import MIcon from "@/components/mIcon/mIcon"

import { AppInfoContext, APP_ACTION_TYPE } from "@/context/appInfoProvider"
import { findAppContentByKey } from "@/util/appContent"

import "./appDialog.less"
import "./appContentStyle.less"

interface IProps {
  visible: boolean;
}

export default function AppDialog(props: IProps) {
  const { visible } = props
  const [curAppCnt, setCurAppCnt] = useState<IAppContentMap | null>()
  const { appKey, dispatch } = useContext(AppInfoContext)
  useEffect(() => {
    const result = findAppContentByKey(appKey)
    if(result) {
      setCurAppCnt(result)
    } else {
      setCurAppCnt(null)
    }
  }, [appKey])

  const renderConetent = () => {
    const Comp = curAppCnt && curAppCnt.renderComponents
    return (
      <TransitionGroup
        visible={visible}
        enterAnimation="fadeIn"
        levaeAnimation="" 
      >
        <div className={`appDialog ${curAppCnt?.dialogStyle.join(' ') || ''}`}>
          <div className="closeBtn pointer" onClick={()=> dispatch({ type: APP_ACTION_TYPE.CLEAR_APP }) }>
            <MIcon iconName="iconclose" />
          </div>
          {Comp && visible ? <Comp/> : <></>}
        </div>
      </TransitionGroup>
    )
  }
  
  return renderConetent()
}