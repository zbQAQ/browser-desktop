import React, { useContext, useEffect, useState } from "react";
import ReactDOM from "react-dom";

import TransitionGroup from "@/components/transitionGroup/transitionGroup"
import MIcon from "@/components/mIcon/mIcon"

import { AppInfoContext } from "../../home"

import "./appDialog.css"

interface IProps {
  visible: boolean;
}

export default function AppDialog(props: IProps) {
  const { visible } = props
  const { appKey, setAppKey } = useContext(AppInfoContext)
  const rootDom = document.getElementById("root")

  const renderConetent = () => {
    return (
      <TransitionGroup
        visible={visible}
        enterAnimation="fadeInUp"
        levaeAnimation="fadeOutDown" 
      >
        <div className="appDialog">
          <div className="closeBtn pointer" onClick={()=>{setAppKey('')}}>
            <MIcon iconName="iconclose" />
          </div>
          <h1>{appKey}</h1>
        </div>
      </TransitionGroup>
    )
  }
  return (
    !rootDom ? null : (
      ReactDOM.createPortal(renderConetent(), rootDom)
    )
  )
}