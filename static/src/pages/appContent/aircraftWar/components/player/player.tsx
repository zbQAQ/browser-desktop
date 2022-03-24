import React, { useEffect, useCallback, useState, useContext, useMemo } from "react";
import { AircraftWarContext, AIRCARFT_WAR_ACTION_TYPE } from "@/context/aircraftWarProvider"
import useSetInterval from "@/hooks/useSetInterval"

// 按下（true状态下）事件触发key
const DOWN_EVENT_OF_KEY = {
	ArrowRight: AIRCARFT_WAR_ACTION_TYPE.PLAYER_MOVE_RIGHT,
	ArrowLeft: AIRCARFT_WAR_ACTION_TYPE.PLAYER_MOVE_LEFT,
	ArrowUp: AIRCARFT_WAR_ACTION_TYPE.PLAYER_MOVE_UP,
	ArrowDown: AIRCARFT_WAR_ACTION_TYPE.PLAYER_MOVE_DOWN,
	Space: AIRCARFT_WAR_ACTION_TYPE.GENERATE_BULLET,
}

// 抬起（false状态下）事件触发key
const UP_EVENT_OF_KEY = {
	Space: AIRCARFT_WAR_ACTION_TYPE.BULLET_CLEAN,
}

export default function Player() {

	// 记录 game 需要的按键状态 
	// false: 未按下;  true: 按下;
	const [ controlKeySataus, setControlKeyStatus ] = useState({ 
		ArrowRight: false,
		ArrowLeft: false,
		ArrowUp: false,
		ArrowDown: false,
		KeyD: false,
		KeyA: false,
		KeyW: false,
		KeyS: false,
		Space: false
	})

	const { playerX, playerY, playerW, playerH, dispatch } = useContext(AircraftWarContext)

	const playerAction = useCallback(() => {
		for(let key in controlKeySataus) {
			const downEvent = DOWN_EVENT_OF_KEY[key]
			const upEvent = UP_EVENT_OF_KEY[key]
			if(controlKeySataus[key]) {
				!!downEvent && dispatch({ type: downEvent })
			} else {
				!!upEvent && dispatch({ type: upEvent })
			}
		}
	}, [dispatch, controlKeySataus])

	useSetInterval(() => {
		playerAction()
	}, 1000 / 60)

	const handleKeyEvent = useCallback((e: KeyboardEvent, status: boolean) => {
		const { code } = e
		// console.log('code', code, status)
		switch (code) {
			case 'ArrowRight':
			case 'KeyD':
				setControlKeyStatus({ ...controlKeySataus, 'ArrowRight': status })
				break;
			case 'ArrowLeft':
			case 'KeyA':
				setControlKeyStatus({ ...controlKeySataus, 'ArrowLeft': status })
				break;
			case 'ArrowUp':
			case 'KeyW':
				setControlKeyStatus({ ...controlKeySataus, 'ArrowUp': status })
				break;
			case 'ArrowDown':
			case 'KeyS':
				setControlKeyStatus({ ...controlKeySataus, 'ArrowDown': status })
				break;
			case 'Space':
				setControlKeyStatus({ ...controlKeySataus, 'Space': status })
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

	const style: React.CSSProperties = useMemo(() => ({
		width: playerW + 'px', 
		height: playerH + 'px', 
		left: playerX + 'px',
		top: playerY + 'px',
	}), [playerW, playerH, playerX, playerY])

	return (
		<div style={style} className="player"></div>
	)
}
