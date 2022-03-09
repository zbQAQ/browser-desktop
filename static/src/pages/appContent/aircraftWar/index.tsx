import React, { useContext } from "react";
import Player from "./components/player/player"
import GameContainer from "./components/gameContainer/gameContainer"
import { AircraftWarProvider, AircraftWarContext, AIRCARFT_WAR_ACTION_TYPE } from "@/context/aircraftWarProvider"

import "./index.less"

// 37 38 39 40
// 左上右下

export default function AircraftWar() {
  return (
    <AircraftWarProvider>
      <GameContainer />
    </AircraftWarProvider>
  )
}