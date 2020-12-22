import React, { useEffect, useRef, useState } from "react"

import "./tictactoe.css"

type INextStepType = 'computer' | 'player'

type ICheckerValueType = 'null' | 'x' | 'o'

/**
 * 0 0 0
 * 0 0 0
 * 0 0 0
 * 
 * x o 0
 * 
 */

const initBoard: ICheckerValueType[][] = [
  ["null", "null", "null"],
  ["null", "null", "null"],
  ["null", "null", "null"]
]

const FIRST_STEP: INextStepType = "player"

export default function TicTacToe() {
  const nextStep = useRef<INextStepType>(FIRST_STEP)
  const [checkerBoard, setCheckerBoard] = useState<ICheckerValueType[][]>(initBoard)
  
  const [emptyCheckerItems, setEmptyCheckerItems] = useState<[number, number][]>([])
  const [gameover, setGameover] = useState(false)


  useEffect(() => {
    resetEmptyCheckerItems()
  }, [])

  useEffect(() => {
    console.log("监测游戏结果", checkerBoard)
    /** 监测游戏结束  */
    if(emptyCheckerItems.length <= 0) {
      setGameover(true)
    }else {
      setGameover(false)
    }
  }, [emptyCheckerItems])

  const renderBoard = () => {
    return (
      <>
        {checkerBoard.map((row, rIndex) => {
          return (
            <div className="row" key={`${row}${rIndex}`}>
              {row.map((col, cIndex) => {
                return renderColItem(col, rIndex, cIndex)
              })}
            </div>
          )
        })}
      </>
    )
  }
  
  const renderColItem = (value: string, rIndex: number, cIndex: number) => {
    return (
      <div className="col pointer" key={`${rIndex}${cIndex}`} onClick={() => {playerClickColItem(rIndex, cIndex)}}>
        {value === 'null' ? '' : value}
      </div>
    )
  }

  const resetEmptyCheckerItems = () => {
    //获取棋盘上空位的所有坐标
    const emptyCheckerItem: [number, number][] = []
    for(let i = 0; i < initBoard.length; i++) {
      for(let j = 0; j < initBoard[i].length; j++) {
        if(initBoard[i][j] === 'null') emptyCheckerItem.push([i, j]);
      }
    }
    setEmptyCheckerItems(emptyCheckerItem)
    return emptyCheckerItem
  }

  //玩家点击
  const playerClickColItem = async (rIndex: number, cIndex: number) => {
    await changeValueByIndex(rIndex, cIndex)
    const emptyItems = resetEmptyCheckerItems()
    if(emptyItems.length > 0) {
      //轮到电脑
      nextStep.current = 'computer'
      const coordinate = randomCoordinate(emptyItems)
      computerClickColItem(coordinate[0], coordinate[1])
    }
  }

  //电脑点击
  const computerClickColItem = async (rIndex: number, cIndex: number) => {
    await changeValueByIndex(rIndex, cIndex)
    resetEmptyCheckerItems()
    //轮到玩家
    nextStep.current = 'player'
  }


  /** 通过传入的坐标返回value */
  const getValueByIndex = (rIndex: number, cIndex: number) => checkerBoard[rIndex][cIndex]

  /** 通过传入的坐标改变value */
  const changeValueByIndex = (rIndex: number, cIndex: number) => {
    return new Promise(resolve => {
      const targetValue = nextStep.current === 'computer' ? 'x' : 'o'
      if(getValueByIndex(rIndex, cIndex) === 'null') {
        checkerBoard[rIndex][cIndex] = targetValue
        setCheckerBoard([...checkerBoard])
        resolve()
      }
    })
  }

  /** 
   * 轮到电脑下的时候 从所有空的坐标中 随机坐标
   * emptyItems 棋盘上的空位
   */
  const randomCoordinate = (emptyItems: [number, number][]): [number, number] => {
    if(emptyItems.length === 0) {
      return emptyItems[0]
    }
    const randomIndex = Math.floor(Math.random() * emptyItems.length)
    const coordinate = emptyItems[randomIndex]
    if(getValueByIndex(coordinate[0], coordinate[1]) !== 'null') {
      return randomCoordinate(emptyItems)
    }
    return coordinate
  }

  return (
    <div className="ticTacToeContainer">
      <h1 className="title textCenter"> ~ 井字棋 ~ </h1>
      <div className={`gameStage ${gameover ? 'gameover' : ''}`}>
        {renderBoard()}
        {/* <div className="row">
          <div className="col pointer">x</div>
          <div className="col pointer">x</div>
          <div className="col pointer">x</div>
        </div>
        <div className="row">
          <div className="col pointer">o</div>
          <div className="col pointer">o</div>
          <div className="col pointer">o</div>
        </div>
        <div className="row">
          <div className="col pointer">o</div>
          <div className="col pointer">o</div>
          <div className="col pointer">o</div>
        </div> */}
        <div className="cLine col1"></div>
        <div className="cLine col2"></div>
        <div className="rLine row1"></div>
        <div className="rLine row2"></div>
      </div>

    </div>
  )
}