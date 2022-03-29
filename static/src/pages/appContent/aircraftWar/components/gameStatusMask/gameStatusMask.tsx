import React, { useContext } from "react";
import { AircraftWarContext, GAME_STATUS } from "@/context/aircraftWarProvider"


export default function GameStatusMask() {
	const { gameStatus } = useContext(AircraftWarContext)

  const renderOverMask = () => (
    <div className="game-over-mask">
      <p>游戏结束</p>
    </div> 
  )

  return gameStatus === GAME_STATUS.OVER ? renderOverMask() : null
}