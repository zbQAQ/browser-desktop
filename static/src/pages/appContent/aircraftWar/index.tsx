import React from "react";
import GameContainer from "./components/gameContainer/gameContainer"
import { AircraftWarProvider } from "@/context/aircraftWarProvider"

import "./index.less"

export default function AircraftWar() {
  return (
    <AircraftWarProvider>
      <GameContainer />
    </AircraftWarProvider>
  )
}