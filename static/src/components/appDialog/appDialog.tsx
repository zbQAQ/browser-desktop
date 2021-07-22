import React, { useContext, useEffect, useState } from "react";

import TransitionGroupV2 from "@/components/transitionGroup/transitionGroup2"
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
      <TransitionGroupV2
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
      </TransitionGroupV2>
    )
  }
  
  return renderConetent()
}