import React, { useContext } from "react";
import { IBullet, AircraftWarContext, AIRCARFT_WAR_ACTION_TYPE } from "@/context/aircraftWarProvider"
import useSetInterval from "@/hooks/useSetInterval"

interface IProps extends IBullet {}

export default function Bullet(props: IProps) {
  const { dispatch } = useContext(AircraftWarContext)
  const { x, y, id, isDestory } = props

  useSetInterval(() => {
    dispatch({ type: AIRCARFT_WAR_ACTION_TYPE.BULLET_MOVE, id })
  }, 1000 / 60)
  
  const style: React.CSSProperties = {
    left: x,
    top: y,
  }
  return isDestory ? null : <div style={style} id={id} className="bullet" ></div>
}