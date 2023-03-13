import React, { useContext } from "react";
import { AircraftWarContext, AIRCARFT_WAR_ACTION_TYPE, GAME_LEVELS, GAME_STATUS } from "@/context/aircraftWarProvider"

export default function GameSetting() {
	const { dispatch, gameLevels, gameStatus } = useContext(AircraftWarContext)

  const handleDifficultyChange = (val: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({ type: AIRCARFT_WAR_ACTION_TYPE.CHANGE_GAME_LEVELS, levels: val.target.value })
  }

  const handleStartClick = () => {
    dispatch({ type: AIRCARFT_WAR_ACTION_TYPE.CHANGE_GAME_STATUS, status: GAME_STATUS.ONLINT })
  }
  return (
    <div className="game-setting-container">
      <div className="difficulty-setting">
        <label>难度：</label>
        <select value={gameLevels} disabled={gameStatus === GAME_STATUS.ONLINT} onChange={handleDifficultyChange}>
          <option value={GAME_LEVELS.SIMPLE}>简单</option>
          <option value={GAME_LEVELS.MEDIUM}>中等</option>
          <option value={GAME_LEVELS.DIFFICULEY}>困难</option>
        </select>
      </div>
      <div className="start-btn">
        <button onClick={handleStartClick} disabled={gameStatus === GAME_STATUS.ONLINT || gameStatus === GAME_STATUS.OVER}>开始游戏</button>
      </div>
    </div>
  )
}