import React, { useEffect, useCallback, useState, useContext } from "react";
import { AircraftWarContext, AIRCARFT_WAR_ACTION_TYPE } from "@/context/aircraftWarProvider"
import useSetInterval from "@/hooks/useSetInterval"

// 37 38 39 40
// 左上右下

const EVENT_OF_KEY = {
	ArrowRight: AIRCARFT_WAR_ACTION_TYPE.PLAYER_MOVE_RIGHT,
	ArrowLeft: AIRCARFT_WAR_ACTION_TYPE.PLAYER_MOVE_LEFT,
	ArrowUp: AIRCARFT_WAR_ACTION_TYPE.PLAYER_MOVE_UP,
	ArrowDown: AIRCARFT_WAR_ACTION_TYPE.PLAYER_MOVE_DOWN,
}

export default function Player() {

	// 记录 game 需要的按键状态 
	// false: 未按下;  true: 按下;
	const [ controlKeySataus, setControlKeyStatus ] = useState({ 
		ArrowRight: false,
		ArrowLeft: false,
		ArrowUp: false,
		ArrowDown: false 
	})

	const { playerX, playerY, playerW, playerH, dispatch } = useContext(AircraftWarContext)

	const playerAction = useCallback(() => {
		for(let key in controlKeySataus) {
			if(controlKeySataus[key]) {
				dispatch({ type: EVENT_OF_KEY[key] })
			}
		}
	}, [dispatch, controlKeySataus])

	useSetInterval(() => {
		playerAction()
	}, 1000 / 60)

	const handleKeyEvent = useCallback((e: KeyboardEvent, status: boolean) => {
		const { code } = e
		switch (code) {
			case 'ArrowRight':
				setControlKeyStatus({ ...controlKeySataus, 'ArrowRight': status })
				break;
			case 'ArrowLeft':
				setControlKeyStatus({ ...controlKeySataus, 'ArrowLeft': status })
				break;
			case 'ArrowUp':
				setControlKeyStatus({ ...controlKeySataus, 'ArrowUp': status })
				break;
			case 'ArrowDown':
				setControlKeyStatus({ ...controlKeySataus, 'ArrowDown': status })
				break;
		}
	}, [setControlKeyStatus, controlKeySataus])


	const KeyUpEventListener = useCallback((e: KeyboardEvent) => {
		handleKeyEvent(e, false)
	}, [handleKeyEvent])

	const KeyDownEventListener = useCallback((e: KeyboardEvent) => {
		handleKeyEvent(e, true)
	}, [handleKeyEvent])

	useEffect(() => {
		document.addEventListener('keydown', KeyDownEventListener)
		document.addEventListener('keyup', KeyUpEventListener)
		return () => {
		document.removeEventListener('keydown', KeyDownEventListener)
		document.removeEventListener('keyup', KeyUpEventListener)
		}
	}, [KeyDownEventListener, KeyUpEventListener])


	const style: React.CSSProperties = {
		width: playerW + 'px', 
		height: playerH + 'px', 
		left: playerX + 'px',
		top: playerY + 'px',
	}

	return (
		<div style={style} className="player">123</div>
	)
}
