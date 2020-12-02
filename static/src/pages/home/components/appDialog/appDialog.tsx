import React, { useContext, useEffect, useState } from "react";
import ReactDOM from "react-dom";

import TransitionGroup from "@/components/transitionGroup/transitionGroup"
import MSvg from "@/components/mSvg/mSvg"

import { AppInfoContext } from "../../home"

import "./appDialog.css"

export default function AppDialog() {

  const { appKey, setAppKey } = useContext(AppInfoContext)
  const [dialogIsShow, setDialogIsShow] = useState(false)
  const rootDom = document.getElementById("root")

  useEffect(() => {
    if(appKey) {
      setDialogIsShow(true)
    }else {
      setDialogIsShow(false)
    }
  }, [appKey])

  const renderConetent = () => {
    return (
      <TransitionGroup 
        enterAnimation="fadeIn"
        levaeAnimation="fadeOut" 
        rate={10}
      >
        <div className="appDialog">
          <div className="closeBtn pointer" onClick={()=>{setAppKey('')}}>
            <MSvg iconName="iconclose" />
          </div>
          <h1>{appKey}</h1>
        </div>
      </TransitionGroup>
    )
  }
  return (
    !dialogIsShow || !rootDom ? null : (
      ReactDOM.createPortal(renderConetent(), rootDom)
    )
  )
}