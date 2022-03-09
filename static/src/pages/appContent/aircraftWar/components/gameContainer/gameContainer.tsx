import React, { useContext, useEffect, useRef } from "react";
import { AircraftWarContext, AIRCARFT_WAR_ACTION_TYPE } from "@/context/aircraftWarProvider"
import useSetInterval from "@/hooks/useSetInterval"
import Player from "../player/player"
import BulletContainer from "../bullet/bulletContainer";

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

  // 游戏场景里 全局计时器 用于定时任务
  useSetInterval(() => {
    // 定时清洁 bulletQueue
    if(bulletQueue.length > 0) {
      dispatch({ type: AIRCARFT_WAR_ACTION_TYPE.BULLET_CLEAN })
    }
  }, 1000)

  console.log('bulletQueue', bulletQueue)

  return (
    <div className="aircraft-container">
      <div className="war-space" ref={spaceRef} id="test" >
        <BulletContainer />
        <Player />
      </div>
    </div>
  )
}
