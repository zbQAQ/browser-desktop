import React, { useContext, useEffect, useRef } from "react";
import { AircraftWarContext, AIRCARFT_WAR_ACTION_TYPE } from "@/context/aircraftWarProvider"
import Player from "../player/player"
import BulletContainer from "../bullet/bulletContainer";
import EnemyContainer from "../enemy/enemyContainer"
import useSetInterval from "@/hooks/useSetInterval";

export default function gameContainer() {
  const spaceRef = useRef(null)
	const { dispatch, gameBoundary, bulletQueue } = useContext(AircraftWarContext)

  useEffect(() => {
    // 初始化边界
    if(spaceRef.current) {
      const data = gameBoundary
      const { width, height } = (spaceRef.current as HTMLElement).getBoundingClientRect()
      dispatch({ type: AIRCARFT_WAR_ACTION_TYPE.UPDATE_BOUNDARY, data: { ...data, down: height, right: width } })
    }
  }, [spaceRef])

  // 棋盘计时器
  // useSetInterval(() => {
  
  // }, 1000)

  return (
    <div className="aircraft-container">
      <div className="war-space" ref={spaceRef} id="test" >
        <BulletContainer />
        <Player />
        <EnemyContainer />
      </div>
    </div>
  )
}
