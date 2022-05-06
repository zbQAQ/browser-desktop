import React, { useReducer, PropsWithChildren } from "react"
import { generateId, randomNum } from "@/util/common"
import {
  AIRCARFT_WAR_ACTION_TYPE,
  GAME_STATUS,
  ENEMY_DIFFICULTY,
  DIRECTION_TYPE,
  IBoundary,
  IEnemy,
  IBullet,
  IAircraftWarContext,
  ENEMY_CHNAGE_FREQUENCY,
  ENEMY_SPEEDS,
  ENEMY_SHOT_RATE,
  ENEMY_SPAWN_POINTS,
  IBulletBelong,
  ENEMY_SCORE_MAP,
  GAME_LEVELS,
  GAME_LEVELS_INFO_MAP,
} from "@/constant/aircraftWar"

const initAircarftInfo: IAircraftWarContext = {
  gameLevels: GAME_LEVELS.SIMPLE,
  gameStatus: GAME_STATUS.ABORT,
  playerW: 50,
  playerH: 50,
  playerX: 175,
  playerY: 500,
  playerSpeed: 4,
  playerShotRate: 200,
  gameBoundary: {
    up: 0,
    right: 0,
    down: 0,
    left: 0,
  },
  bulletQueue: [],
  enemyQueue: [],
  score: 0,
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
    case AIRCARFT_WAR_ACTION_TYPE.PLAYER_SHOT:
      return playerShot(state)
    case AIRCARFT_WAR_ACTION_TYPE.BULLET_MOVE: 
      return bulletMove(state, action.id)
    case AIRCARFT_WAR_ACTION_TYPE.BULLET_CLEAN: 
      return bulletQueue.length > 0 ? { ...state, bulletQueue: bulletQueue.filter(b => !b.isDestory) } : state
    case AIRCARFT_WAR_ACTION_TYPE.SPAWN_ENEMY: 
      return spawnEnemy(state, action.difficulty)
    case AIRCARFT_WAR_ACTION_TYPE.ENEMY_RANDOM_MOVE: 
      return enemyRondomMove(state, action.id)
    case AIRCARFT_WAR_ACTION_TYPE.ENEMY_CHANGE_DIRECTION: 
      return enemyChangeDirection(state, action.id)
    case AIRCARFT_WAR_ACTION_TYPE.ENEMY_SHOT: 
      return enemyShot(state, action.id)
    case AIRCARFT_WAR_ACTION_TYPE.JUDGE_PLAYER_OVERLAP_ENEMY: 
      return judgePlayerOverlapEnemy(state)
    case AIRCARFT_WAR_ACTION_TYPE.JUDGE_BULLET_OVERLAP_ENEMY: 
      return judgeBulletOverlapEnemy(state, action.id)
    case AIRCARFT_WAR_ACTION_TYPE.JUDGE_BULLET_OVERLAP_PLAYER: 
      return judgeBulletOverlapPlayer(state)
    case AIRCARFT_WAR_ACTION_TYPE.CHANGE_GAME_LEVELS: 
      return { ...state, gameLevels: action.levels }
    case AIRCARFT_WAR_ACTION_TYPE.DESTORY_ENEMY: 
      return destoryEnemy(state, action.id)
    case AIRCARFT_WAR_ACTION_TYPE.GAME_RESTART: 
      return restartGame(state)
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
 function judeOutBoundart(upBoundary: number, downBoundary: number, y: number) {
  return y < upBoundary || y > downBoundary
}

// 生成 enemy
function spawnEnemy(state: IAircraftWarContext, difficulty: ENEMY_DIFFICULTY) {
  const now = Date.now()
  const { enemyQueue } = state
  const { x, y } = ENEMY_SPAWN_POINTS[randomNum(0, ENEMY_SPAWN_POINTS.length - 1)]
  return { ...state, enemyQueue: [ 
    ...enemyQueue, 
    {
      id: generateId(),
      x,
      y,
      w: 50,
      h: 50,
      speed: ENEMY_SPEEDS[difficulty],
      isDestory: false,
      ct: now,
      difficulty: difficulty,
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
  const moveDown = () => enemy.y = enemy.y + enemy.speed > down ? down : enemy.y + enemy. speed
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

// enemy 射击
function enemyShot(state: IAircraftWarContext, id: string) {
  const now = Date.now()
  const { bulletQueue, enemyQueue } = state
  const index = enemyQueue.findIndex(v => v.id === id)
  if(index < 0) return state;
  const enemy = enemyQueue[index]
  const { x, y, w, difficulty} = enemy
  if(bulletQueue.length <= 0 || now - bulletQueue[bulletQueue.length - 1].ct > ENEMY_SHOT_RATE[difficulty]) {
    bulletQueue.push(generateBullet(x + (w / 2) - 5, y, now, 'enemy'))
    return { ...state, bulletQueue: bulletQueue }
  } else {
    return state
  }
}

// player 射击
function playerShot(state: IAircraftWarContext) {
  const now = Date.now()
  const { bulletQueue, playerShotRate, playerX, playerW, playerY } = state
  // 根据 playerShotRate 判断是否插入新子弹
  // 判断 bulletQueue.length <= 0 是为了不管射速快慢触发射击事件的一瞬间就要生成一颗子弹
  if(bulletQueue.length <= 0 || now - bulletQueue[bulletQueue.length - 1].ct > playerShotRate) {
    // 计算player头位置 减 5 为子弹固定长宽 10 / 2 
    bulletQueue.push(generateBullet(playerX + (playerW / 2) - 5, playerY, now, 'player'))
    return { ...state, bulletQueue: bulletQueue }
  } else {
    return state
  }
}

// 初始化子弹
function generateBullet(x: number, y: number, ct: number, belong: IBulletBelong): IBullet {
  return {
    id: generateId(),
    x,
    y,
    w: 10,
    h: 10,
    speed: 10,
    isDestory: false,
    ct,
    belong,
  }
}

// 子弹移动
function bulletMove(state: IAircraftWarContext, id: string) {
  const { bulletQueue, gameBoundary: { up, down } } = state
  const bullet = bulletQueue.find(b => b.id === id)
  if(bullet) {
    bullet.y = bullet.belong === 'player' ? bullet.y - bullet.speed : bullet.y + bullet.speed
    // 子弹超出边界需要标记为 以销毁 不再渲染
    bullet.isDestory = judeOutBoundart(up, down, bullet.y)
  }
  return { ...state, bulletQueue: bulletQueue }
}

// 生成随机方向值
function randomDirections(): DIRECTION_TYPE {
  const dirs = Object.values(DIRECTION_TYPE)
  return dirs[randomNum(0, dirs.length - 1)]
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

// 判断bullet和player是否重叠
function judgeBulletOverlapPlayer(state: IAircraftWarContext) {
  const { bulletQueue, playerH, playerW, playerX, playerY } = state
  const existBullets = bulletQueue.length > 0 ? bulletQueue.filter(v => !v.isDestory && v.belong !== 'player') : []
  let isHit = false
  if(existBullets.length > 0) {
    for(let i = 0; i < existBullets.length; i++) {
      const curBullet = existBullets[i]
      isHit = isOverlap(curBullet, { h: playerH, w: playerW, x: playerX, y: playerY })
      if (isHit) {
        curBullet.isDestory = true
        break;
      }
    }
    return isHit ? { ...state, bulletQueue: bulletQueue, gameStatus: GAME_STATUS.OVER,  } : state
  } else {
    return state
  }
}

// 判断bullet和enemy是否重叠
function judgeBulletOverlapEnemy(state: IAircraftWarContext, enemyId: string) {
  const { enemyQueue, bulletQueue, score } = state
  const enemy = enemyQueue.length > 0 ? enemyQueue.find(v => v.id === enemyId) : null
  const existBullets = bulletQueue.length > 0 ? bulletQueue.filter(v => !v.isDestory && v.belong !== 'enemy') : []
  if(enemy && existBullets.length > 0) {
    for(let i = 0; i < existBullets.length; i++) {
      const curBullet = existBullets[i]
      if(isOverlap(curBullet, enemy)) {
        enemy.isDestory = true
        curBullet.isDestory = true
        state.score = triggerScore(score, ENEMY_SCORE_MAP[enemy.difficulty])
      }
    }
    return { ...state, enemyQueue: enemyQueue, bulletQueue: bulletQueue }
  } else {
    return state
  }
}

function destoryEnemy(state: IAircraftWarContext, enemyId: string) {
  const { enemyQueue } = state
  const enemy = enemyQueue.find(v => v.id === enemyId)
  if(enemy) {
    enemy.isDestory = true
    return { ...state, enemyQueue: enemyQueue }
  } else {
    return state
  }
}

// 触发得分
function triggerScore(sourceScore: number, value: number) {
  return sourceScore + value
}

// 重开
function restartGame(state: IAircraftWarContext) {
  return {
    ...state,
    gameStatus: GAME_STATUS.ABORT,
    bulletQueue: [],
    enemyQueue: [],
    score: 0,
    playerX: 175,
    playerY: 500,
  }
}

export {
  AIRCARFT_WAR_ACTION_TYPE,
  GAME_STATUS,
  ENEMY_DIFFICULTY,
  DIRECTION_TYPE,
  IBoundary,
  IEnemy,
  IBullet,
  IAircraftWarContext,
  ENEMY_CHNAGE_FREQUENCY,
  ENEMY_SPEEDS,
  ENEMY_SHOT_RATE,
  GAME_LEVELS,
  GAME_LEVELS_INFO_MAP
}
