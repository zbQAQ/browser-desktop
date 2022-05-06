import React, { useContext, useEffect, useRef } from "react";
import { AircraftWarContext, AIRCARFT_WAR_ACTION_TYPE } from "@/context/aircraftWarProvider"
import Player from "../player/player"
import BulletContainer from "../bullet/bulletContainer";
import EnemyContainer from "../enemy/enemyContainer"
import GameStatusMask from "../gameStatusMask/gameStatusMask";
import GameSetting from "../gameSetting/gameSetting";
import Loading, { LOADING_TYPE } from "@/components/loadingv2/loading"


interface IProps {
  loading: boolean
}

export default function gameContainer(props: IProps) {
  const { loading } = props
  const spaceRef = useRef(null)
	const { dispatch, gameBoundary, score } = useContext(AircraftWarContext)

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
      {
        loading ? (
          <div className="loading-mask">
            <Loading className="game-loading" visible={loading} type={LOADING_TYPE.ZOOM_CIRCLE}/>
          </div>
        ) : (
          <>
            <div className="stage-center">
              <BulletContainer />
              <Player />
              <EnemyContainer />
              <GameStatusMask />
            </div>
            <div className="player-score">
              当前得分: {score}
            </div>
            <GameSetting />
          </>
        )
      }
    </div>
  )
}
