import React, { useContext } from "react";
import { AircraftWarContext, GAME_STATUS, AIRCARFT_WAR_ACTION_TYPE } from "@/context/aircraftWarProvider"

export default function GameStatusMask() {
	const { gameStatus, dispatch, score } = useContext(AircraftWarContext)

  const handleRestartClick = () => {
    dispatch({ type: AIRCARFT_WAR_ACTION_TYPE.GAME_RESTART })
    setTimeout(() => {
      dispatch({ type: AIRCARFT_WAR_ACTION_TYPE.CHANGE_GAME_STATUS, status: GAME_STATUS.ONLINT })
    }, 0);
  }

  const renderOverMask = () => (
    <div className="game-status-container">
      <p className="mask-title">游戏结束🥺，你的得分是{score}</p>
      <button onClick={handleRestartClick}>重新开始</button>
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