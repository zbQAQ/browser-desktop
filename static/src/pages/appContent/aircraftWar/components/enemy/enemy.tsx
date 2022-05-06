import React, { useContext, useEffect, useMemo } from "react";
import { 
  AircraftWarContext, 
  AIRCARFT_WAR_ACTION_TYPE, 
  IEnemy, 
  ENEMY_CHNAGE_FREQUENCY, 
  GAME_STATUS, 
  ENEMY_SHOT_RATE,
  ENEMY_DIFFICULTY,
} from "@/context/aircraftWarProvider"
import useSetInterval from "@/hooks/useSetInterval";

interface IProps extends IEnemy {}

export default function Enemys(props: IProps) {
  const { dispatch, gameStatus, gameBoundary } = useContext(AircraftWarContext)
  const { x, y, id, w, h, isDestory, difficulty } = props

  useEffect(() => {
    // 障碍物到边界底部 需要自动销毁
    if(difficulty === ENEMY_DIFFICULTY.OBSTACLE && y === gameBoundary.down) {
      dispatch({ type: AIRCARFT_WAR_ACTION_TYPE.DESTORY_ENEMY, id })
    }
  }, [y, difficulty, id, gameBoundary.down])

  useSetInterval(() => {
    if(gameStatus !== GAME_STATUS.ONLINT || isDestory) return;
    dispatch({ type: AIRCARFT_WAR_ACTION_TYPE.ENEMY_RANDOM_MOVE, id })
    dispatch({ type: AIRCARFT_WAR_ACTION_TYPE.JUDGE_BULLET_OVERLAP_ENEMY, id })
  }, 1000 / 60)

  useSetInterval(() => {
    if(gameStatus !== GAME_STATUS.ONLINT || isDestory) return;
    dispatch({ type: AIRCARFT_WAR_ACTION_TYPE.ENEMY_SHOT, id })
  }, ENEMY_SHOT_RATE[difficulty])

  useSetInterval(() => {
    if(gameStatus !== GAME_STATUS.ONLINT || isDestory) return;
    dispatch({ type: AIRCARFT_WAR_ACTION_TYPE.ENEMY_CHANGE_DIRECTION, id })
  }, ENEMY_CHNAGE_FREQUENCY[difficulty])

  const style: React.CSSProperties = useMemo(() => ({
    left: x,
    top: y,
    width: w,
    height: h,
  }), [y, x, w, h])

  return isDestory ? null : <div style={style} id={id} className="ememy" ></div>

}
