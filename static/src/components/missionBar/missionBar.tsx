import React from "react"

import MIcon from "@/components/mIcon/mIcon"

import "./missionBar.css"

export default function MissionBar() {
  return (
    <div className="missionBar">
      <div className="menuBtn">
        <MIcon iconName="iconwindows" className="menuIcon"></MIcon>
      </div>
    </div>
  )
}