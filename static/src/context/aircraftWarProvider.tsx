import React, { useReducer, PropsWithChildren } from "react"
import { generateId, randomNum } from "@/util/common"

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
  // 生成 enemy
  SPAWN_ENEMY = 'spawn_enemy',
  // enemy 移动
  ENEMY_RANDOM_MOVE = 'enemy_random_move',
  // enemy 变向
  ENEMY_CHANGE_DIRECTION = 'enemy_change_direction',
  // 判断 player 和 enemy 是否重叠
  JUDGE_PLAYER_OVERLAP_ENEMY = 'judge_player_overlap_enemy',
  // 判断 bullet 和 enemy 是否重叠
  JUDGE_BULLET_OVERLAP_ENEMY = 'judge_bullet_overlap_enemy',
  // 修改游戏状态
  CHANGE_GAME_STATUS = 'change_game_status',
}

export enum GAME_STATUS {
  // 进行中
  ONLINT = "online",
  // 停止
  ABORT = "abort",
  // 游戏结束
  OVER = "over",
}

// 常规 boundary
interface IBoundary {
  x: number,
  y: number,
  w: number,
  h: number
}

// enemy 难度
enum ENEMY_DIFFICULTY {
  // 障碍物 不需要变向
  OBSTACLE = "obstacle",

  NOOB = "noob",
  STRONG = "strong",
}

// 根据难度值 变向频率 单位毫秒ms
export const CHNAGE_FREQUENCY = {
  [ENEMY_DIFFICULTY.NOOB]: 1000,
  [ENEMY_DIFFICULTY.STRONG]: 500,
}

// 方向
enum DIRECTION_TYPE {
  LEFT = 'left',
  UP = 'up',
  RIGHT = 'right',
  DOWN = 'down',
  LEFT_UP = 'left_up',
  LEFT_DOWN = 'left_down',
  RIGHT_UP = 'right_up',
  RIGHT_DOWN = 'right_down',
}

export interface IEnemy {
  id: string
  x: number
  y: number
  w: number
  h: number
  // 移动速度
  speed: number
  // 标记销毁
  isDestory: boolean
  // 生成时间
  ct: number
  // 移动方向
  direction: DIRECTION_TYPE
  // 难度
  difficulty: ENEMY_DIFFICULTY
}

export interface IBullet {
  id: string
  x: number
  y: number
  w: number
  h: number
  // 移动速度
  speed: number
  // 标记销毁
  isDestory: boolean
  // 生成时间
  ct: number
}

interface IAircraftWarContext {
  // 游戏状态
  gameStatus: GAME_STATUS,
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
  enemyQueue: IEnemy[]

  dispatch: React.Dispatch<IAnyAction<AIRCARFT_WAR_ACTION_TYPE>>
}

const initAircarftInfo: IAircraftWarContext = {
  gameStatus: GAME_STATUS.ABORT,
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
  enemyQueue: [],
  dispatch: () => { }
}

export const AircraftWarContext = React.createContext(initAircarftInfo);

const reducer = (state: IAircraftWarContext, action: IAnyAction<AIRCARFT_WAR_ACTION_TYPE>) => {
  const { gameBoundary: { up, right, down, left } , playerW, playerH, playerX, playerSpeed, playerY, bulletQueue } = state
  switch (action.type) {
    case AIRCARFT_WAR_ACTION_TYPE.CHANGE_GAME_STATUS:
      return { ...state, gameStatus: action.status }
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
      return generateBullet(state)
    case AIRCARFT_WAR_ACTION_TYPE.BULLET_MOVE: 
      return bulletMove(state, action.id)
    case AIRCARFT_WAR_ACTION_TYPE.BULLET_CLEAN: 
      return bulletQueue.length > 0 ? { ...state, bulletQueue: bulletQueue.filter(b => !b.isDestory) } : state
    case AIRCARFT_WAR_ACTION_TYPE.SPAWN_ENEMY: 
      return spawnEnemy(state)
    case AIRCARFT_WAR_ACTION_TYPE.ENEMY_RANDOM_MOVE: 
      return enemyRondomMove(state, action.id)
    case AIRCARFT_WAR_ACTION_TYPE.ENEMY_CHANGE_DIRECTION: 
      return enemyChangeDirection(state, action.id)
    case AIRCARFT_WAR_ACTION_TYPE.JUDGE_PLAYER_OVERLAP_ENEMY: 
      return judgePlayerOverlapEnemy(state)
    case AIRCARFT_WAR_ACTION_TYPE.JUDGE_BULLET_OVERLAP_ENEMY: 
      return judgeBulletOverlapEnemy(state, action.id)
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

// 生成 enemy
function spawnEnemy(state: IAircraftWarContext) {
  const now = Date.now()
  const { enemyQueue } = state
  return { ...state, enemyQueue: [ 
    ...enemyQueue, 
    {
      id: generateId(),
      x: 0,
      y: 0,
      w: 50,
      h: 50,
      speed: 2,
      isDestory: false,
      ct: now,
      difficulty: ENEMY_DIFFICULTY.STRONG,
      direction: DIRECTION_TYPE.DOWN
    }
  ]}
}

// enemy 随机移动
function enemyRondomMove(state: IAircraftWarContext, id: string) {
  const { enemyQueue, gameBoundary: { up, right, down, left } } = state
  const enemyIdx = enemyQueue.findIndex(v => v.id === id && !v.isDestory)
  const enemy = enemyQueue[enemyIdx]
  const moveLeft = () => enemy.x = enemy.x - enemy.speed < left ? left : enemy.x - enemy.speed
  const moveUp = () => enemy.y = enemy.y - enemy.speed < up ? up : enemy.y - enemy.speed
  const moveRight = () => enemy.x = enemy.x + enemy.speed + enemy.w > right ? right - enemy.w : enemy.x + enemy.speed
  const moveDown = () => enemy.y = enemy.y + enemy.speed + enemy.h > down ? down - enemy.h: enemy.y + enemy.speed
  if(enemyIdx > -1) {
    switch(enemy.direction) {
      case 'up':
        moveUp()
        break;
      case 'right':
        moveRight()
        break;
      case 'down':
        moveDown()
        break;
      case 'left':
        moveLeft()
        break;
      case 'left_up':
        moveLeft()
        moveUp()
        break;
      case 'left_down':
        moveLeft()
        moveDown()
        break;
      case 'right_up':
        moveUp()
        moveRight()
        break;
      case 'right_down':
        moveRight()
        moveDown()
        break;
    }
    return { ...state, enemyQueue }
  } else {
    return state
  }
}

// enemy 变向
function enemyChangeDirection(state: IAircraftWarContext, id: string) {
  const { enemyQueue } = state
  const enemy = enemyQueue.find(v => v.id === id && !v.isDestory)
  const ranDir = randomDirections()
  if(enemy) {
    enemy.direction = ranDir
    return { ...state, enemyQueue }
  } else {
    return state
  }
}

// 初始化子弹
function generateBullet(state: IAircraftWarContext) {
  const now = Date.now()
  const { bulletQueue, playerShotRate, playerX, playerW, playerY } = state
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
        w: 10,
        h: 10,
        speed: 10,
        isDestory: false,
        ct: now
      }
    ]}
  } else {
    return state
  }
}

// 子弹移动
function bulletMove(state: IAircraftWarContext, id: string) {
  const { bulletQueue, gameBoundary: { up } } = state
  const bullet = bulletQueue.find(b => b.id === id)
  if(bullet) {
    bullet.y -= bullet.speed
    // 子弹超出边界需要标记为 以销毁 不再渲染
    bullet.isDestory = judeOutBoundart(up, bullet.y)
  }
  return { ...state, bulletQueue: bulletQueue }
}

// 生成随机方向值
function randomDirections(): DIRECTION_TYPE {
  const directions = ['up', 'right', 'down', 'left', 'left_up', 'left_down', 'right_up', 'right_down']
  return Object.values(DIRECTION_TYPE)[randomNum(0, directions.length - 1)]
}

// 判断两者重叠
function isOverlap(b1: IBoundary, b2: IBoundary) {
  const { x: x1, y: y1, w: w1, h: h1 } = b1
  const { x: x2, y: y2, w: w2, h: h2 } = b2
  return !((y2 + h2 < y1) || (y2 > y1 + h1) || (x2 + w2 < x1) || (x2 > x1 + w1))
}

// 判断palyer和enemy是否重叠
function judgePlayerOverlapEnemy(state: IAircraftWarContext) {
  const { enemyQueue, playerX, playerY, playerH, playerW } = state
  const aliveEnemys = enemyQueue.length > 0 ? enemyQueue.filter(v => !v.isDestory) : []
  let isHit = false
  if(aliveEnemys.length > 0) {
    for(let i = 0; i < aliveEnemys.length; i++) {
      // 重叠被撞
      isHit = isOverlap({ x: playerX, y: playerY, w: playerW, h: playerH }, aliveEnemys[i])
      if (isHit) {
        break;
      }
    }
    return isHit ? { ...state, gameStatus: GAME_STATUS.OVER } : state
  } else {
    return state
  }
}

// 判断bullet和enemy是否重叠
function judgeBulletOverlapEnemy(state: IAircraftWarContext, enemyId: string) {
  const { enemyQueue, bulletQueue } = state
  const enemy = enemyQueue.length > 0 ? enemyQueue.find(v => v.id === enemyId) : null
  const existBullets = bulletQueue.length > 0 ? bulletQueue.filter(v => !v.isDestory) : []
  if(enemy && existBullets.length > 0) {
    for(let i = 0; i < existBullets.length; i++) {
      const curBullet = existBullets[i]
      if(isOverlap(curBullet, enemy)) {
        enemy.isDestory = true
        curBullet.isDestory = true
      }
    }
    return { ...state, enemyQueue: enemyQueue, bulletQueue: bulletQueue }
  } else {
    return state
  }
}