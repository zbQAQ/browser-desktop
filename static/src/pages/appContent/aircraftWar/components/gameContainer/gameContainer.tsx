import React, { useContext, useEffect, useRef } from "react";
import { AircraftWarContext, AIRCARFT_WAR_ACTION_TYPE, GAME_STATUS } from "@/context/aircraftWarProvider"
import Player from "../player/player"
import BulletContainer from "../bullet/bulletContainer";
import EnemyContainer from "../enemy/enemyContainer"
import GameStatusMask from "../gameStatusMask/gameStatusMask";

export default function gameContainer() {
  const spaceRef = useRef(null)
	const { dispatch, gameBoundary } = useContext(AircraftWarContext)

  useEffect(() => {
    // 初始化边界
    if(spaceRef.current) {
      const data = gameBoundary
      const { width, height } = (spaceRef.current as HTMLElement).getBoundingClientRect()
      dispatch({ type: AIRCARFT_WAR_ACTION_TYPE.UPDATE_BOUNDARY, data: { ...data, down: height, right: width } })
    }
  }, [spaceRef])

  return (
    <div className="war-space" ref={spaceRef} id="test" >
      <BulletContainer />
      <Player />
      <EnemyContainer />
      <GameStatusMask />
      <div style={{
        position: "absolute",
        top: "-30px",
      }}>
        <button onClick={() => {
          dispatch({ type: AIRCARFT_WAR_ACTION_TYPE.CHANGE_GAME_STATUS, status: GAME_STATUS.ONLINT })
        }}>start</button>
        <button onClick={() => {
          dispatch({ type: AIRCARFT_WAR_ACTION_TYPE.CHANGE_GAME_STATUS, status: GAME_STATUS.ABORT })
        }}>stop</button>
      </div>
    </div>
  )
}
