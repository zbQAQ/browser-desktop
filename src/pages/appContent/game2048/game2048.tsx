import React, { useCallback, useEffect, useState } from "react"
import { deepClone, randomNum } from "@/util/common"
import useToast from "@/hooks/useToast"
import Cube, { ICubeType } from "./cube"

import "./game2048.less"

type IMapType = ICubeType[][]

// 立方体大小
export const CUBE_SIZE = 100

// 间距
export const SPACEING = 20

// 过渡时间 单位ms
export const TRANSITION_TIME = 450

type ItemPosType = Record<"x" | "y", number>

export enum KEY_MAPS {
  LEFT = "ArrowLeft",
  UP = "ArrowUp",
  RIGHT = "ArrowRight",
  DOWN = "ArrowDown",
}

const initMap = (): IMapType => {
  const initMaps = [ [{}, {}, {}, {}], [{}, {}, {}, {}], [{}, {}, {}, {}], [{}, {}, {}, {}], ]
  let id = 0;
  for(let i = 0; i < initMaps.length; i++) {
    for(let j = 0; j < initMaps[i].length; j++) {
      initMaps[i][j] = {
        id: "cube" + (id + 1),
        mapY: i,
        mapX: j,
        value: 0,
        rotateY: 0,
        rotateX: 0,
      }
      id += 1
    }
  }
  return initMaps as IMapType
}

function findActionIndexs(action: KEY_MAPS, curItem: ICubeType) {
  const indexs: number[] = []
  let curIndex = action === KEY_MAPS.UP || action === KEY_MAPS.DOWN ? curItem.mapY : curItem.mapX

  const calculate = (i: number, calculator: "+" | "-") => {
    if(calculator === "-" ? (i - 1) < 0 : (i + 1) > 3 ) return;
    const ni = calculator === "-" ? i - 1 : i + 1
    indexs.push(ni)
    calculate(ni, calculator)
  }
  switch(action) {
    case KEY_MAPS.UP: 
      calculate(curIndex, "-")
      break;
    case KEY_MAPS.RIGHT: 
      calculate(curIndex, "+")
      break;
    case KEY_MAPS.DOWN: 
      calculate(curIndex, "+")
      break;
    case KEY_MAPS.LEFT: 
      calculate(curIndex, "-")
      break;
    default: 
      return indexs;
  }

  return indexs;
}

/**
 * @name merge 合并操作
 * 
 * @param data         地图
 * @param mergedTarget 被合并目标
 * @param moveTarget   移动目标
 * @param distance     移动距离（用于旋转）
 * @param setValue     setstate方法
 */
function merge(data: IMapType, mergedTarget: ICubeType, moveTarget: ICubeType, distance: number, action: KEY_MAPS): IMapType {
  const mergedTargetTemp = Object.assign({}, mergedTarget, { value: 0, mapY: moveTarget.mapY, mapX: moveTarget.mapX, })
  const moveTargetTemp = Object.assign({}, 
    moveTarget,
    { value: mergedTarget.value + moveTarget.value, mapY: mergedTarget.mapY, mapX: mergedTarget.mapX }, 
    action === KEY_MAPS.UP || action === KEY_MAPS.DOWN ? { rotateX: distance * 360 } : { rotateY: distance * 360 }
  )
  data[mergedTarget.mapY][mergedTarget.mapX] = moveTargetTemp
  data[moveTarget.mapY][moveTarget.mapX] = mergedTargetTemp
  return data;
}

function move(data: IMapType, destination: ICubeType, moveTarget: ICubeType, distance: number, action: KEY_MAPS): IMapType {
  const destinationTemp = Object.assign({}, destination, { value: 0, mapY: moveTarget.mapY, mapX: moveTarget.mapX, })
  const moveTargetTemp = Object.assign({}, 
    moveTarget, 
    { value: moveTarget.value, mapY: destination.mapY, mapX: destination.mapX },
    action === KEY_MAPS.UP || action === KEY_MAPS.DOWN ? { rotateX: distance * 360 } : { rotateY: distance * 360 }
  )
  data[destination.mapY][destination.mapX] = moveTargetTemp
  data[moveTarget.mapY][moveTarget.mapX] = destinationTemp
  return data;
}

/**
 * @name doAction 判断行为函数
 * 
 * @param data      地图数组
 * @param curPos    当前定位
 * @param targetPos 判断目标定位
 * @param action    action方向
 * 
 * 1. 判断value是否相等； 相等直接执行合并操作; 不相等执行第2步
 * 2. 判断value是否等于 0， 并且坐标为 边界坐标则直接执行 移动操作；如果不是边界坐标则直接忽略;
 * 
 * doAction 需要执行两边 修复 移动和合并操作并行的情况
 * 
 * @returns fn
 */
function doAction(data: IMapType, curPos: ItemPosType, targetPos: ItemPosType, newTargetPos: ItemPosType, lastTargetPos: ItemPosType, action: KEY_MAPS): Record<string, any> {
  
  const curItem: ICubeType = data[curPos.y][curPos.x]
  const actionTargets: ICubeType = data[targetPos.y][targetPos.x]
  const nextTarget: ICubeType = data[newTargetPos.y][newTargetPos.x]
  const lastTarget: ICubeType = data[lastTargetPos.y][lastTargetPos.x]

  // const boundary = action === KEY_MAPS.UP || action === KEY_MAPS.LEFT ? 0 : 3
  const judegFlag = action === KEY_MAPS.UP || action === KEY_MAPS.DOWN ? "mapY" : "mapX"
  const actionMap = { move, merge }

  const distance = Number(curItem[judegFlag] - actionTargets[judegFlag])

  if(curItem.value === 0) return { cb: null, name: "stop"};

  if(curItem.value !== actionTargets.value && lastTarget.value !== 0) {
    return { cb: null, name: "stop"};
  }

  if(curItem.value === actionTargets.value) {
    return { cb: () => actionMap["merge"](data, actionTargets, curItem, distance, action), name: "merge", moveTarget: curItem, target: actionTargets, distance }
  }

  if(actionTargets.id === nextTarget.id && actionTargets.value === 0) {
    return { cb: () => actionMap["move"](data, actionTargets, curItem, distance, action), name: "move", moveTarget: curItem, target: actionTargets, distance }
  }

  if( actionTargets.value === 0 && nextTarget.value !== 0 && nextTarget.value !== curItem.value) {
    return { cb: () => actionMap["move"](data, actionTargets, curItem, distance, action), name: "move", moveTarget: curItem, target: actionTargets, distance }
  }

  return { cb: null, name: null};
}

function isGameOver(data: IMapType, mapIndexs: Record<"x" | "y", number>[]): boolean {
  let status = false

  const emptyPos = mapIndexs.filter(p => data[p.y][p.x].value === 0)
  // 还有空位 就没有 gameover
  if(emptyPos.length > 0) return false;

  // 监测上右下左 是否有和自己相等的
  for(let i = 0; i < mapIndexs.length; i++) {
    const curPos = mapIndexs[i]
    const item = data[curPos["y"]][curPos["x"]]

    const upPos = { y: curPos["y"] - 1 < 0 ? 0 : curPos["y"] - 1, x: curPos["x"] }
    const rightPos = { y: curPos["y"], x: curPos["x"] + 1 > 3 ? 3 : curPos["x"] + 1 }
    const downPos = { y: curPos["y"] + 1 > 3 ? 3 : curPos["y"] + 1, x: curPos["x"] }
    const leftPos = { y: curPos["y"], x: curPos["x"] - 1 < 0 ? 0 : curPos["x"] - 1 }

    const upItem = data[upPos.y][upPos.x]
    const rightItem = data[rightPos.y][rightPos.x]
    const downItem = data[downPos.y][downPos.x]
    const leftItem = data[leftPos.y][leftPos.x]
    if( 
      (item.id !== upItem.id && item.value === upItem.value) ||
      (item.id !== rightItem.id && item.value === rightItem.value) ||
      (item.id !== downItem.id && item.value === downItem.value) ||
      (item.id !== leftItem.id && item.value === leftItem.value)
    ) {
      status = false
      break;
    } else {
      status = true
    }
  }

  return status
}

/**
 * 合并操作：
 *  1. 被合并目标：mapXY 修改为移动目标的mapXY value值重置为0
 *  2. 移动目标：mapXY 修改为被合并目标mapXY value值两者相加 rotateX为 两者差距 * 360
 * 
 * 移动操作(前提为目的地 value 为 0):
 *  1. 移动目标：自己的 mapXY 设置为目的地的 mapXY
 *  2. 目的地：mapXY 修改为移动目标的 mapXY 
 * 
 * action操作
 *  1. 判断自己 value 是否为 0； 0则无操作；大于0则继续第2步
 *  2. 判断 action方 value 是否为 0；为0则 action方向加1作为新的目标继续执行第2步; 加1操作如果到达边界则直接执行移动操作；不为0则进行第3步
 *  3. 判断 action方不为0的模板 是否与自己value相等； 相等则执行合并操作；不相等执行第4步
 *  4. 以 action方 前一格作为移动目标做 移动操作
 */
export default function Game2048() {
  const [ hasAnimation, setHasAnimation ] = useState(true)
  const [ gameover, setGameOver ] = useState(false)
  const [ score, setScore ] = useState(0)
  const [ curAction, setCurAction ] = useState<KEY_MAPS | null>(null)
  const [ stageMap, setStageMap ] = useState<IMapType>(initMap())
  const { showToast } = useToast()

  const renderStage = useCallback(() => {
    return stageMap.map((cols, cindex) => {
      return cols.map((r, rindex) => {
        return <Cube key={`${cindex}-${rindex}`} {...r} animation={hasAnimation} action={curAction} />
      })
    })
  }, [stageMap, hasAnimation])

  const handleUp = (data: IMapType, mapIndexs: Record<"x" | "y", number>[]): number => {
    console.log("up");
    // 由于每次action只能执行一次操作所以在
    // 合并过的cube id
    const mergedCubeIds: string[] = []
    let moveNum = 0
    for(let i = 0; i < mapIndexs.length; i++) {
      const { x, y } = mapIndexs[i]
      const item = data[y][x]
      const needJudgeIndexs = findActionIndexs(KEY_MAPS.UP, item)
      const needJudgeItems = needJudgeIndexs.map(ny => ({ y: ny, x }))

      for(let k = 0; k < needJudgeItems.length; k++) {
        const nextTargetPos = needJudgeItems[k + 1] ? needJudgeItems[k + 1] : needJudgeItems[k]
        const lastTargetPos = needJudgeItems[k - 1] ? needJudgeItems[k - 1] : needJudgeItems[k]
        const { cb, name, target, moveTarget, distance } = doAction(data, mapIndexs[i], needJudgeItems[k], nextTargetPos, lastTargetPos, KEY_MAPS.UP);
        if(cb && name) {
          if(name === "merge") {
            if(!mergedCubeIds.includes(target.id)) {
              cb()
              setScore(n => n + moveTarget.value + target.value)
              moveNum += 1
              mergedCubeIds.push(item.id)
            } else {
              const newTarget = data[needJudgeItems[k - 1]["y"]][needJudgeItems[k - 1]["x"]] 
              move(data, newTarget, moveTarget, distance, KEY_MAPS.UP)
              moveNum += 1
            }
          } else {
            cb()
            moveNum += 1
          }
        } else if(name === "stop") {
          break;
        }
      }
    }
    return moveNum
  }
  
  const handleRight = (data: IMapType, mapIndexs: Record<"x" | "y", number>[]): number => {
    console.log("right");
    // 由于每次action只能执行一次操作所以在
    // 合并过的cube id
    const mergedCubeIds: string[] = []
    let moveNum = 0
    for(let i = mapIndexs.length - 1; i >= 0; i--) {
      const { x, y } = mapIndexs[i]
      const item = data[y][x]
      const needJudgeIndexs = findActionIndexs(KEY_MAPS.RIGHT, item)
      const needJudgeItems = needJudgeIndexs.map(nx => ({ y, x: nx }));
      for(let k = 0; k < needJudgeItems.length; k++) {
        const nextTargetPos = needJudgeItems[k + 1] ? needJudgeItems[k + 1] : needJudgeItems[k]
        const lastTargetPos = needJudgeItems[k - 1] ? needJudgeItems[k - 1] : needJudgeItems[k]
        const { cb, name, target, moveTarget, distance } = doAction(data, mapIndexs[i], needJudgeItems[k], nextTargetPos, lastTargetPos, KEY_MAPS.RIGHT);

        if(cb && name) {
          if(name === "merge") {
            if(!mergedCubeIds.includes(target.id)) {
              cb()
              setScore(n => n + moveTarget.value + target.value)
              moveNum += 1
              mergedCubeIds.push(item.id)
            } else {
              const newTarget = data[needJudgeItems[k - 1]["y"]][needJudgeItems[k - 1]["x"]] 
              move(data, newTarget, moveTarget, distance, KEY_MAPS.RIGHT)
              moveNum += 1
            }
          } else  {
            cb()
            moveNum += 1
          }
        } else if(name === "stop") {
          break;
        }
      }
    }
    return moveNum;
  }

  const handleDown = (data: IMapType, mapIndexs: Record<"x" | "y", number>[]): number => {
    console.log("down");
    // 由于每次action只能执行一次操作所以在
    // 合并过的cube id
    const mergedCubeIds: string[] = []
    let moveNum = 0
    for(let i = mapIndexs.length - 1; i >= 0; i--) {
      const { x, y } = mapIndexs[i]
      const item = data[y][x]
      const needJudgeIndexs = findActionIndexs(KEY_MAPS.DOWN, item)
      const needJudgeItems = needJudgeIndexs.map(ny => ({ y: ny, x }));
      for(let k = 0; k < needJudgeItems.length; k++) {
        const nextTargetPos = needJudgeItems[k + 1] ? needJudgeItems[k + 1] : needJudgeItems[k]
        const lastTargetPos = needJudgeItems[k - 1] ? needJudgeItems[k - 1] : needJudgeItems[k]
        const { cb, name, target, moveTarget, distance } = doAction(data, mapIndexs[i], needJudgeItems[k], nextTargetPos, lastTargetPos, KEY_MAPS.DOWN);

        if(cb && name) {
          if(name === "merge") {
            if(!mergedCubeIds.includes(target.id)) {
              cb()
              setScore(n => n + moveTarget.value + target.value)
              moveNum += 1
              mergedCubeIds.push(item.id)
            } else {
              const newTarget = data[needJudgeItems[k - 1]["y"]][needJudgeItems[k - 1]["x"]] 
              move(data, newTarget, moveTarget, distance, KEY_MAPS.DOWN)
              moveNum += 1
            }
          } else  {
            cb()
            moveNum += 1
          }
        } else if(name === "stop") {
          break;
        }
      }
    }
    return moveNum;
  }

  const handleLeft = (data: IMapType, mapIndexs: Record<"x" | "y", number>[]): number => {
    console.log("left");
    // 由于每次action只能执行一次操作所以在
    // 合并过的cube id
    const mergedCubeIds: string[] = []
    let moveNum = 0
    for(let i = 0; i < mapIndexs.length; i++) {
      const { x, y } = mapIndexs[i]
      const item = data[y][x]
      const needJudgeIndexs = findActionIndexs(KEY_MAPS.LEFT, item)
      const needJudgeItems = needJudgeIndexs.map(nx => ({ y, x: nx }))
      for(let k = 0; k < needJudgeItems.length; k++) {
        const nextTargetPos = needJudgeItems[k + 1] ? needJudgeItems[k + 1] : needJudgeItems[k]
        const lastTargetPos = needJudgeItems[k - 1] ? needJudgeItems[k - 1] : needJudgeItems[k]
        const { cb, name, target, moveTarget, distance } = doAction(data, mapIndexs[i], needJudgeItems[k], nextTargetPos, lastTargetPos, KEY_MAPS.LEFT);
        if(cb && name) {
          if(name === "merge") {
            if(!mergedCubeIds.includes(target.id)) {
              cb()
              setScore(n => n + moveTarget.value + target.value)
              moveNum += 1
              mergedCubeIds.push(item.id)
            } else {
              const newTarget = data[needJudgeItems[k - 1]["y"]][needJudgeItems[k - 1]["x"]] 
              move(data, newTarget, moveTarget, distance, KEY_MAPS.LEFT)
              moveNum += 1
            }
          } else  {
            cb()
            moveNum += 1
          }
        } else if(name === "stop") {
          break;
        }
      }
    }
    return moveNum;
  }

  const nextStep = (data: IMapType, mapIndexs: Record<"x" | "y", number>[]) => {
    const emptyPos = mapIndexs.filter(p => data[p.y][p.x].value === 0)
    if(emptyPos.length === 0) return data;
    const createPos = randomNum(0, emptyPos.length - 1)
    data[emptyPos[createPos]["y"]][emptyPos[createPos]["x"]].value = 2
    data[emptyPos[createPos]["y"]][emptyPos[createPos]["x"]].rotateX = 0
    data[emptyPos[createPos]["y"]][emptyPos[createPos]["x"]].rotateY = 0
    return data;
  }

  const handleKeyUp = useCallback(({ key }) => {
    if(gameover) return;

    const clicktime = Date.now()
    const lastTime = window.localStorage.getItem("enter_time")
    if(clicktime - Number(lastTime) <= TRANSITION_TIME) {
      window.localStorage.setItem("enter_time", clicktime + "")
      showToast({ content: "你点的太快了!", autoCloseDelay: TRANSITION_TIME + 100, type: "warning" })
      return;
    }
    window.localStorage.setItem("enter_time", clicktime + "")

    let moveNum = 0
    let data = deepClone(stageMap)
    const mapIndexs: Record<"x" | "y", number>[] = data.map((c: ICubeType[], cindex: number) => c.map((r: ICubeType, rindex: number) => ({ y: cindex, x: rindex }))).flat()
    setCurAction(key)
    switch(key) {
      case KEY_MAPS.UP: 
        const upNum = handleUp(data, mapIndexs)
        moveNum += upNum
        break;
      case KEY_MAPS.RIGHT: 
        const rightNum = handleRight(data, mapIndexs)
        moveNum += rightNum
        break;
      case KEY_MAPS.DOWN: 
        const downNum = handleDown(data, mapIndexs)
        moveNum += downNum
        break;
      case KEY_MAPS.LEFT: 
        const leftNum = handleLeft(data, mapIndexs)
        moveNum += leftNum
        break;
      default: 
        return;
    }

    for(let y = 0; y < data.length; y++) {
      for(let x = 0; x < data[y].length; x++) {
        if(data[y][x].id !== stageMap[y][x].id) {
          let oldItem = stageMap.flat().find(v => v.id === data[y][x].id)
          if(oldItem) {
            stageMap[oldItem.mapY][oldItem.mapX] = Object.assign(oldItem, {id: data[y][x].id, mapY: data[y][x].mapY, mapX: data[y][x].mapX, value: data[y][x].value, rotateX: data[y][x].rotateX, rotateY: data[y][x].rotateY })
          }
        }
      }
    }
    setStageMap([...stageMap])
    data = nextStep(data, mapIndexs)
    if(moveNum === 0) {
      const gameOver = isGameOver(data, mapIndexs)
      if(gameOver) {
        setGameOver(true)
        return;
      }
    }

    setTimeout(() => {
      setHasAnimation(false)
      setStageMap([...data])
    }, TRANSITION_TIME)
    setHasAnimation(true)
  }, [stageMap, handleUp, handleRight, handleDown, handleLeft])

  const startGame = () => {
    const n1 = { y: randomNum(0, 3), x: randomNum(0, 3) }
    const n2 = { y: randomNum(0, 3), x: randomNum(0, 3) }
    setStageMap(v => {
      const newValue = deepClone(v)
      newValue[n1.y][n1.x].value = 2
      newValue[n2.y][n2.x].value = 2
      return [...newValue]
    })
  }

  const resetGame = () => {
    setStageMap(initMap())
    setGameOver(false)
    setScore(0)
    startGame()
  }

  useEffect(() => {
    window.addEventListener("keyup", handleKeyUp)
    return () => {
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [handleKeyUp])

  useEffect(() => {
    if(gameover) {
      showToast({ content: "gameover!", autoClose: false, showCloseBtn: true, type: "error" })
    }
  }, [gameover])


  useEffect(() => {
    window.localStorage.setItem("enter_time", Date.now() + "")
    startGame()
  }, [])

  return (
    <div className="game2048-container">
      <div className="header">
        <div className="score-label">
          <div className="side">当前得分:</div>
          <div className="side"></div>
          <div className="side"></div>
          <div className="side"></div>
          <div className="side"></div>
          <div className="side"></div>
        </div>
        <div className="score">
          <div className="side">{ score }</div>
          <div className="side"></div>
          <div className="side"></div>
          <div className="side"></div>
          <div className="side"></div>
          <div className="side"></div>
        </div>
        <div className="reset pointer" onClick={() => resetGame()}>
          <div className="side">reset</div>
          <div className="side"></div>
          <div className="side"></div>
          <div className="side"></div>
          <div className="side"></div>
          <div className="side"></div>
        </div>
      </div>
      <div className="stage">
        {renderStage()}
      </div>
      <div className="board-panel">
        <div className="keyboard up pointer" onClick={() => handleKeyUp({ key: KEY_MAPS.UP })}>
          <div className="side">↑</div>
          <div className="side"></div>
          <div className="side"></div>
          <div className="side"></div>
          <div className="side"></div>
          <div className="side"></div>
        </div>
        <div className="keyboard right pointer" onClick={() => handleKeyUp({ key: KEY_MAPS.RIGHT })}>
          <div className="side">→</div>
          <div className="side"></div>
          <div className="side"></div>
          <div className="side"></div>
          <div className="side"></div>
          <div className="side"></div>
        </div>
        <div className="keyboard down pointer" onClick={() => handleKeyUp({ key: KEY_MAPS.DOWN })}>
          <div className="side">↓</div>
          <div className="side"></div>
          <div className="side"></div>
          <div className="side"></div>
          <div className="side"></div>
          <div className="side"></div>
        </div>
        <div className="keyboard left pointer" onClick={() => handleKeyUp({ key: KEY_MAPS.LEFT })}>
          <div className="side">←</div>
          <div className="side"></div>
          <div className="side"></div>
          <div className="side"></div>
          <div className="side"></div>
          <div className="side"></div>
        </div>
      </div>
    </div> 
  )
}