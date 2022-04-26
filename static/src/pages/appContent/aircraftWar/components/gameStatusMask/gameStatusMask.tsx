import React, { useContext } from "react";
import { AircraftWarContext, GAME_STATUS, GAME_LEVELS } from "@/context/aircraftWarProvider"

export default function GameStatusMask() {
	const { gameStatus } = useContext(AircraftWarContext)

  const renderOverMask = () => (
    <div className="game-status-container">
      <p className="mask-title">游戏结束</p>
    </div> 
  )

  const renderClearanceMask = () => (
    <div className="game-status-container">
      <p className="mask-title">恭喜你🎉</p>
      <button className="next-level">下一关</button>
    </div> 
  )

  const render = () => {
    switch(gameStatus) {
      case GAME_STATUS.OVER: 
        return renderOverMask()
      case GAME_STATUS.CLEARANCE:
        return renderClearanceMask()
      default: 
        return null
    }
  }

  return render()
}