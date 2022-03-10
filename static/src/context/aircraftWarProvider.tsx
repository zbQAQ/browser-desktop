import React, { useReducer, PropsWithChildren } from "react"
import { generateId } from "@/util/common"

// AircraftWar应用 reducer操作
export enum AIRCARFT_WAR_ACTION_TYPE {
  PLAYER_MOVE_LEFT = 'player_move_left',
  PLAYER_MOVE_RIGHT = 'nplayer_move_right',
  PLAYER_MOVE_UP = 'nplayer_move_up',
  PLAYER_MOVE_DOWN = 'nplayer_move_down',
  // 更新边界
  UPDATE_BOUNDARY = 'update_boundary',
  // 生成子弹
  GENERATE_BULLET = 'generate_bullet',
  // 子弹移动
  BULLET_MOVE = 'bullet_move',
  // 标记子弹为 已销毁
  BULLET_MARK_DESTROY = 'bullet_mark_destroy',
  // 清除被标记为 已销毁 的子弹
  BULLET_CLEAN = 'bullet_clean',
}

export interface IBullet {
  id: string
  x: number
  y: number
  // 移动速度
  speed: number
  // 标记销毁
  isDestory: boolean
  // 生成时间
  ct: number
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
  // 玩家 射速 单位毫秒
  playerShotRate: number;
  // 地图边界
  gameBoundary: {
    up: number,
    right: number,
    down: number,
    left: number,
  };
  // 子弹队列
  bulletQueue: IBullet[]

  dispatch: React.Dispatch<IAnyAction<AIRCARFT_WAR_ACTION_TYPE>>
}

const initAircarftInfo: IAircraftWarContext = {
  playerW: 50,
  playerH: 50,
  playerX: 175,
  playerY: 500,
  playerSpeed: 4,
  playerShotRate: 500,
  gameBoundary: {
    up: 0,
    right: 0,
    down: 0,
    left: 0,
  },
  bulletQueue: [],
  dispatch: () => { }
}

export const AircraftWarContext = React.createContext(initAircarftInfo);

const reducer = (state: IAircraftWarContext, action: IAnyAction<AIRCARFT_WAR_ACTION_TYPE>) => {
  const { gameBoundary: { up, right, down, left } , playerW, playerH, playerX, playerSpeed, playerY, playerShotRate, bulletQueue } = state
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
    case AIRCARFT_WAR_ACTION_TYPE.GENERATE_BULLET:
      const now = Date.now()
      // 根据 playerShotRate 判断是否插入新子弹
      // 判断 bulletQueue.length <= 0 是为了不管射速快慢触发射击事件的一瞬间就要生成一颗子弹
      if(bulletQueue.length <= 0 || now - bulletQueue[bulletQueue.length - 1].ct > playerShotRate) {
        // 计算player头位置 减 5 为子弹固定长宽 10 / 2 
        return { ...state, bulletQueue: [ 
          ...bulletQueue, 
          {
            id: generateId(),
            x: playerX + (playerW / 2) - 5,
            y: playerY,
            speed: 10,
            isDestory: false,
            ct: now
          }
        ]}
      } else {
        return state
      }
    case AIRCARFT_WAR_ACTION_TYPE.BULLET_MOVE: 
      const bullet = bulletQueue.find(b => b.id === action.id)
      if(bullet) {
        bullet.y -= bullet.speed
        // 子弹超出边界需要标记为 以销毁 不再渲染
        bullet.isDestory = judeOutBoundart(up, bullet.y)
      }
      return { ...state, bulletQueue: bulletQueue }
    case AIRCARFT_WAR_ACTION_TYPE.BULLET_CLEAN: 
      if(bulletQueue.length > 0) {
        return { ...state, bulletQueue: bulletQueue.filter(b => !b.isDestory) }
      } else {
        return state
      }
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

/**
 * @name judeOutBoundart 判断子弹是否超出边界
 * @param upBoundary 上边界
 * @param bulletY    子弹实际y
 */
 function judeOutBoundart(upBoundary: number, y: number) {
  return y < upBoundary
}
