import React, { useEffect, useState } from "react";
import GameContainer from "./components/gameContainer/gameContainer"
import { AircraftWarProvider } from "@/context/aircraftWarProvider"

import "./index.less"

export default function AircraftWar() {
  const [loading, setLoading] = useState(true)
  const imagesResource = [
    require("./images/life.png"),
    require("./images/bullet.png"),
    require("./images/enemy0.png"),
    require("./images/enemy1.png"),
    require("./images/enemy2.png"),
  ]

  useEffect(() => {
    // 提前加载图片资源
    let successNum = 0;
    for(let i = 0; i < imagesResource.length; i++) {
      const img = new Image();
      img.src = imagesResource[i].default;
      img.onload = () => {
        successNum++
        if(successNum === imagesResource.length - 1) {
          setTimeout(() => {
            setLoading(false)
          }, 1200)
        }
      }
    }
  }, [])

  return (
    <AircraftWarProvider>
      <div className="aircraft-container">
        <GameContainer loading={loading}/>
      </div>
    </AircraftWarProvider>
  )
}