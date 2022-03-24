import React, { useContext } from "react";
import { AircraftWarContext, AIRCARFT_WAR_ACTION_TYPE, IEnemy, CHNAGE_FREQUENCY } from "@/context/aircraftWarProvider"
import useSetInterval from "@/hooks/useSetInterval";

interface IProps extends IEnemy {}

export default function Enemys(props: IProps) {
  const { dispatch } = useContext(AircraftWarContext)
  const { x, y, id, w, h, isDestory, difficulty } = props

  useSetInterval(() => {
    dispatch({ type: AIRCARFT_WAR_ACTION_TYPE.ENEMY_RANDOM_MOVE, id })
  }, 1000 / 60)

  useSetInterval(() => {
    dispatch({ type: AIRCARFT_WAR_ACTION_TYPE.ENEMY_CHANGE_DIRECTION, id })
  }, CHNAGE_FREQUENCY[difficulty])

  const style: React.CSSProperties = {
    left: x,
    top: y,
    width: w,
    height: h,
  }

  return isDestory ? null : <div style={style} id={id} className="ememy" ></div>

}
