import React, { useCallback, useContext } from "react";
import { AircraftWarContext } from "@/context/aircraftWarProvider"
import Bullet from "./bullet";


export default function BulletContainer() {
  const { bulletQueue } = useContext(AircraftWarContext)
  
  const renderBullet = useCallback(() => {
    const bullets = []
    for(let i = 0; i < bulletQueue.length; i++) {
      !(bulletQueue[i].isDestory) && bullets.push(<Bullet key={bulletQueue[i].id} {...bulletQueue[i]}/>)
    }
    return bullets
  }, [bulletQueue])

  return (
    <div>
      {bulletQueue.length > 0 ? renderBullet() : null}
    </div>
  )
}