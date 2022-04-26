import React, { useCallback, useContext, useEffect } from "react";
import Enemys from "./enemy"
import { AircraftWarContext, AIRCARFT_WAR_ACTION_TYPE } from "@/context/aircraftWarProvider"


export default function BulletContainer() {
  const { enemyQueue, dispatch, gameLevels } = useContext(AircraftWarContext)
  
  const renderEnemy = useCallback(() => {
    const enemys = []
    for(let i = 0; i < enemyQueue.length; i++) {
      !(enemyQueue[i].isDestory) && enemys.push(<Enemys key={enemyQueue[i].id} {...enemyQueue[i]}/>)
    }
    return enemys
  }, [enemyQueue])

  useEffect(() => {
    dispatch({ type: AIRCARFT_WAR_ACTION_TYPE.SPAWN_ENEMY })
  }, [])


  return (
    <div>
      {enemyQueue.length > 0 ? renderEnemy() : null}
    </div>
  )
}