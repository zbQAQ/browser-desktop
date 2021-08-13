import React, { useCallback, useEffect, useState } from "react"
import { deepClone } from "@/util/common"

import Cube, { ICubeType } from "./cube"

import "./game2048.less"

type IMapType = ICubeType[][]

enum ACTION_TYPE {
  MOVE = "move",
  MERGE = "merge",
}

// 立方体大小
export const CUBE_SIZE = 100

// 间距
export const SPACEING = 20

// 过渡时间 单位ms
export const TRANSITION_TIME = 450

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
    if(calculator === "-" ? (i - 1) < 0 : (i + 1) > 4 ) return;
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
 * @name moveJudge cube 移动判断
 * 
 * @param actionTargets 
 * @param curItem 
 * 
 * 1. 按 actionTargets 顺序判断value
 * 2. 如果 actionTargets[i].value === 0 则直接 continue 跳出本次循环执行下次循环；
 * 3. 如果 actionTargets[i].value === curItem.value 则直接执行 merge 操作；
 * 4. 如果 actionTargets[i].value !== curItem.value 则直接执行移动操作;
 * 
 */
interface IMoveJudgeResult {
  name: ACTION_TYPE,
  target: ICubeType
  moveTarget: ICubeType
  distance: number
}
function doCubeMoveJudge(actionTargets: ICubeType, curItem: ICubeType, action: KEY_MAPS, data: IMapType): IMoveJudgeResult | null {
  // const result: IMoveJudgeResult[] = []
  const boundary = action === KEY_MAPS.UP || KEY_MAPS.LEFT ? 0 : 3
  const judegFlag = action === KEY_MAPS.UP || KEY_MAPS.DOWN ? "mapY" : "mapX"
  if(curItem.value === 0) return null;
  if(actionTargets.value === 0) {
    if(actionTargets[judegFlag] === boundary) {
      // result.unshift({ name: "move", destination: actionTargets, moveTarget: curItem})
      // return move(data, actionTargets, curItem, curItem[judegFlag] - actionTargets[judegFlag])
      return { name: ACTION_TYPE.MOVE, target: actionTargets, moveTarget: curItem, distance: Number(curItem[judegFlag] - actionTargets[judegFlag]) }
    }
  };
  if(actionTargets.value === curItem.value) {
    // result.unshift({ name: "merge", mergedTarget: actionTargets, moveTarget: curItem})
    // return merge(data, actionTargets, curItem, curItem[judegFlag] - actionTargets[judegFlag])
    return { name: ACTION_TYPE.MERGE, target: actionTargets, moveTarget: curItem, distance: Number(curItem[judegFlag] - actionTargets[judegFlag]) }
  } else if(actionTargets[judegFlag] !== boundary) {
    // result.unshift({ name: "move", destination: actionTargets, moveTarget: curItem})
    // return move(data, actionTargets, curItem, curItem[judegFlag] - actionTargets[judegFlag])
    return { name: ACTION_TYPE.MOVE, target: actionTargets, moveTarget: curItem, distance: Number(curItem[judegFlag] - actionTargets[judegFlag]) }
  }
  return null;
}
type ItemPosType = Record<"x" | "y", number>
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
function doAction(data: IMapType, curPos: ItemPosType, targetPos: ItemPosType, newTargetPos: ItemPosType, action: KEY_MAPS): Record<string, any> {
  
  const curItem: ICubeType = data[curPos.y][curPos.x]
  const actionTargets: ICubeType = data[targetPos.y][targetPos.x]
  const nextTarget: ICubeType = data[newTargetPos.y][newTargetPos.x]

  const boundary = action === KEY_MAPS.UP || action === KEY_MAPS.LEFT ? 0 : 3
  const judegFlag = action === KEY_MAPS.UP || action === KEY_MAPS.DOWN ? "mapY" : "mapX"
  const actionMap = { move, merge }

  const distance = Number(curItem[judegFlag] - actionTargets[judegFlag])
  if(curItem.value === 0) return { cb: null, name: null};

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

export default function Game2048() {
  const [ hasAnimation, setHasAnimation ] = useState(true)
  const [ curAction, setCurAction ] = useState<KEY_MAPS | null>(null)
  const [ stageMap, setStageMap ] = useState<IMapType>(initMap())

  const renderStage = useCallback(() => {
    return stageMap.map((cols, cindex) => {
      return cols.map((r, rindex) => {
        return <Cube key={`${cindex}-${rindex}`} {...r} animation={hasAnimation} action={curAction} />
      })
    })
  }, [stageMap, hasAnimation])

  const handleKeyUp = useCallback(({ key }) => {
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
     * 
     */

    // 由于每次action只能执行一次操作所以在
    // 合并过的cube id
    const mergedCubeIds: string[] = []
    let data = deepClone(stageMap)
    const mapIndexs: Record<"x" | "y", number>[] = data.map((c: ICubeType[], cindex: number) => c.map((r: ICubeType, rindex: number) => ({ y: cindex, x: rindex }))).flat()
    setCurAction(key)
    switch(key) {
      case KEY_MAPS.UP: 
        console.log("up");
        for(let i = 0; i < mapIndexs.length; i++) {
          const { x, y } = mapIndexs[i]
          const item = data[y][x]
          const needJudgeIndexs = findActionIndexs(KEY_MAPS.UP, item)
          const needJudgeItems = needJudgeIndexs.map(ny => ({ y: ny, x }))

          for(let k = 0; k < needJudgeItems.length; k++) {
            const { cb, name, target, moveTarget, distance } = doAction(data, mapIndexs[i], needJudgeItems[k], needJudgeItems[k + 1] ? needJudgeItems[k + 1] : needJudgeItems[k], KEY_MAPS.UP);
            if(cb && name) {
              if(name === "merge") {
                if(!mergedCubeIds.includes(target.id)) {
                  cb()
                  mergedCubeIds.push(item.id)
                } else {
                  const newTarget = data[needJudgeItems[k - 1]["y"]][needJudgeItems[k - 1]["x"]] 
                  move(data, newTarget, moveTarget, distance, KEY_MAPS.UP)
                }
              } else {
                cb()
              }
            }
          }
        }
        break;
      case KEY_MAPS.RIGHT: 
        console.log("right");
        break;
      case KEY_MAPS.DOWN: 
        console.log("down");
        break;
      case KEY_MAPS.LEFT: 
        console.log("left");
        for(let i = 0; i < mapIndexs.length; i++) {
          const { x, y } = mapIndexs[i]
          const item = data[y][x]
          const needJudgeIndexs = findActionIndexs(KEY_MAPS.LEFT, item)
          const needJudgeItems = needJudgeIndexs.map(nx => ({ y, x: nx }))
          console.log("needJudgeItems", item, needJudgeItems)
          for(let k = 0; k < needJudgeItems.length; k++) {
            const { cb, name, target, moveTarget, distance } = doAction(data, mapIndexs[i], needJudgeItems[k], needJudgeItems[k - 1] ? needJudgeItems[k - 1] : needJudgeItems[k], KEY_MAPS.LEFT);
            if(cb && name) {
              if(name === "merge") {
                if(!mergedCubeIds.includes(target.id)) {
                  cb()
                  mergedCubeIds.push(item.id)
                } else {
                  const newTarget = data[needJudgeItems[k + 1]["y"]][needJudgeItems[k + 1]["x"]] 
                  move(data, newTarget, moveTarget, distance, KEY_MAPS.LEFT)
                }
              } else {
                cb()
              }
            }
          }
        }
        break;
      default: 
        return;
    }
    console.log("handleKeyUp", key)

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
    setTimeout(() => {
      setHasAnimation(false)
      setStageMap([...data])
    }, TRANSITION_TIME)
    setHasAnimation(true)
  }, [stageMap])

  useEffect(() => {
    window.addEventListener("keyup", handleKeyUp)
    return () => {
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [handleKeyUp])

  useEffect(() => {
    // debug
    setStageMap(v => {
      const newValue = deepClone(v)
      newValue[0][0].value = 2
      newValue[0][1].value = 2
      newValue[1][0].value = 2

      newValue[1][1].value = 2

      newValue[2][1].value = 2

      newValue[1][2].value = 4
      newValue[3][2].value = 2

      newValue[0][3].value = 4
      
      newValue[3][3].value = 4
      newValue[3][1].value = 2
      newValue[3][0].value = 4
      return newValue
    })
  }, [])

  console.log("return stageMap", stageMap)
  return (
    <div className="game2048-container">
      <div className="stage">
        {renderStage()}
      </div>
    </div> 
  )
}