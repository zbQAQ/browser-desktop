import React from "react"

import MSvg from "@/components/mSvg/mSvg"

import "./missionBar.css"

export default function MissionBar() {
  return (
    <div className="missionBar">
      <div className="menuBtn">
        <MSvg iconName="iconwindows" className="menuIcon"></MSvg>
      </div>
    </div>
  )
}