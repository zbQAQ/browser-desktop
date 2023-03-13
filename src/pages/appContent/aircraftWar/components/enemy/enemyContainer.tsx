import React, { useCallback, useContext, useEffect, useMemo } from "react";
import Enemys from "./enemy"
import { 
  AircraftWarContext, 
  AIRCARFT_WAR_ACTION_TYPE, 
  ENEMY_DIFFICULTY, 
  GAME_LEVELS, 
  GAME_LEVELS_INFO_MAP,
  GAME_STATUS 
} from "@/context/aircraftWarProvider"
import { randomNum } from "@/util/common"
import useSetInterval from "@/hooks/useSetInterval";


export default function BulletContainer() {
  const { enemyQueue, dispatch, gameLevels, gameStatus } = useContext(AircraftWarContext)
  
  const renderEnemy = useCallback(() => {
    const enemys = []
    for(let i = 0; i < enemyQueue.length; i++) {
      !(enemyQueue[i].isDestory) && enemys.push(<Enemys key={enemyQueue[i].id} {...enemyQueue[i]}/>)
    }
    return enemys
  }, [enemyQueue])

  const gameInfo = useMemo(() => {
    return GAME_LEVELS_INFO_MAP[gameLevels]
  }, [gameLevels, GAME_LEVELS])

  useSetInterval(() => {
    if(gameStatus !== GAME_STATUS.ONLINT) return;
    const diffs = Object.values(ENEMY_DIFFICULTY)
    dispatch({ type: AIRCARFT_WAR_ACTION_TYPE.SPAWN_ENEMY, difficulty: diffs[randomNum(0, diffs.length - 1)] })
  }, gameInfo.spawnRate)

  return (
    <div>
      {enemyQueue.length > 0 ? renderEnemy() : null}
    </div>
  )
}