import React, { useContext, useMemo } from "react";
import { AircraftWarContext, AIRCARFT_WAR_ACTION_TYPE, IEnemy, CHNAGE_FREQUENCY, GAME_STATUS } from "@/context/aircraftWarProvider"
import useSetInterval from "@/hooks/useSetInterval";

interface IProps extends IEnemy {}

export default function Enemys(props: IProps) {
  const { dispatch, gameStatus } = useContext(AircraftWarContext)
  const { x, y, id, w, h, isDestory, difficulty } = props

  useSetInterval(() => {
    gameStatus === GAME_STATUS.ONLINT && dispatch({ type: AIRCARFT_WAR_ACTION_TYPE.ENEMY_RANDOM_MOVE, id })
  }, 1000 / 60)

  useSetInterval(() => {
    gameStatus === GAME_STATUS.ONLINT && dispatch({ type: AIRCARFT_WAR_ACTION_TYPE.ENEMY_CHANGE_DIRECTION, id })
  }, CHNAGE_FREQUENCY[difficulty])

  const style: React.CSSProperties = useMemo(() => ({
    left: x,
    top: y,
    width: w,
    height: h,
  }), [y, x, w, h])

  return isDestory ? null : <div style={style} id={id} className="ememy" ></div>

}
