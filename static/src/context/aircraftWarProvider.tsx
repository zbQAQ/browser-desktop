import React, { useReducer, PropsWithChildren } from "react"


// AircraftWar应用 reducer操作
export enum AIRCARFT_WAR_ACTION_TYPE {
  PLAYER_MOVE_LEFT = 'player_move_left',
  PLAYER_MOVE_RIGHT = 'nplayer_move_right',
  PLAYER_MOVE_UP = 'nplayer_move_up',
  PLAYER_MOVE_DOWN = 'nplayer_move_down',
  // 更新边界
  UPDATE_BOUNDARY = 'update_boundary'
}

interface IAircraftWarContext {
  // 玩家宽度
  playerW: number;
  // 玩家高度
  playerH: number;
  // 玩家 坐标X
  playerX: number
  // 玩家 坐标Y
  playerY: number
  // 玩家 移动速度
  playerSpeed: number;
  // 地图边界
  gameBoundary: {
    up: number,
    right: number,
    down: number,
    left: number,
  };

  dispatch: React.Dispatch<IAnyAction<AIRCARFT_WAR_ACTION_TYPE>>
}

const initAircarftInfo: IAircraftWarContext = {
  playerW: 50,
  playerH: 50,
  playerX: 175,
  playerY: 275,
  playerSpeed: 4,
  gameBoundary: {
    up: 0,
    right: 0,
    down: 0,
    left: 0,
  },
  dispatch: () => { }
}

export const AircraftWarContext = React.createContext(initAircarftInfo);


const reducer = (state: IAircraftWarContext, action: IAnyAction<AIRCARFT_WAR_ACTION_TYPE>) => {
  const { gameBoundary: { up, right, down, left } , playerW, playerH, playerX, playerSpeed, playerY} = state
  switch (action.type) {
    case AIRCARFT_WAR_ACTION_TYPE.PLAYER_MOVE_LEFT:
      return { ...state, playerX: playerX - playerSpeed < left ? left : playerX - playerSpeed }
    case AIRCARFT_WAR_ACTION_TYPE.PLAYER_MOVE_RIGHT:
      return { ...state, playerX: playerX + playerSpeed + playerW > right ? right - playerW : playerX + playerSpeed }
    case AIRCARFT_WAR_ACTION_TYPE.PLAYER_MOVE_UP:
      return { ...state, playerY: playerY - playerSpeed < up ? up : playerY - playerSpeed }
    case AIRCARFT_WAR_ACTION_TYPE.PLAYER_MOVE_DOWN:
      return { ...state, playerY: playerY + playerSpeed + playerH > down ? down - playerH: playerY + playerSpeed }
    case AIRCARFT_WAR_ACTION_TYPE.UPDATE_BOUNDARY:
      return { ...state, gameBoundary: action.data }
    default:
      return state
  }
}

export const AircraftWarProvider = (props: PropsWithChildren<{}>) => {
  const [state, dispatch] = useReducer(reducer, initAircarftInfo)
  return (
    <AircraftWarContext.Provider value={{ ...state, dispatch }}>
      {props.children}
    </AircraftWarContext.Provider>
  )
}