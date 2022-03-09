import React, { useContext, useEffect, useRef } from "react";
import Player from "../player/player"
import { AircraftWarContext, AIRCARFT_WAR_ACTION_TYPE } from "@/context/aircraftWarProvider"

export default function gameContainer() {
  const spaceRef = useRef(null)
	const { dispatch, gameBoundary } = useContext(AircraftWarContext)

  useEffect(() => {
    const data = gameBoundary
    if(spaceRef.current) {
      const { width, height } = (spaceRef.current as HTMLElement).getBoundingClientRect()
      dispatch({ type: AIRCARFT_WAR_ACTION_TYPE.UPDATE_BOUNDARY, data: { ...data, down: height, right: width } })
    }
  }, [spaceRef])

  return (
    <div className="aircraft-container">
      <div className="war-space" ref={spaceRef} id="test" >
        <Player />
      </div>
    </div>
  )
}
