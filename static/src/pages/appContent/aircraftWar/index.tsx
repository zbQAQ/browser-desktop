import React, { useEffect } from "react";

import "./index.less"

// 37 38 39 40
// 左上右下

export default function AircraftWar() {

  useEffect(() => {
    window.addEventListener('keyup', (e) => {
      console.log(e.key)
    })

  }, [])
  

  return (
    <div className="aircraft-container">
      <div className="war-space">
        <div className="player"></div>
      </div>
    </div>
  )
}