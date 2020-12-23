import React, { useEffect, useRef, useState } from "react"

import "./tictactoe.css"

type INextStepType = 'computer' | 'player'

type ICheckerValueType = 'null' | 'x' | 'o'

/**
 * 0 0 0
 * 0 0 0
 * 0 0 0
 * 
 * 横排
 * [0, 0] [0, 1] [0, 2]
 * [1, 0] [1, 1] [1, 2]
 * [2, 0] [2, 1] [2, 2]
 * 
 * 斜着
 * [0, 0] [1, 1] [2, 2]
 * [0, 2] [1, 1] [2, 0]
 * 
 * 
 * 竖排
 * [0, 0] [1, 0] [2, 0]
 * [0, 1] [1, 1] [2, 1]
 * [0, 2] [1, 2] [2, 2]
 * 
 */


let initBoard: ICheckerValueType[][] = [
  ["null", "null", "null"],
  ["null", "null", "null"],
  ["null", "null", "null"]
]

const initBoardApi = {
  changeBoardValueByIndex: (rIndex: number, cIndex: number, value: ICheckerValueType) => {
    initBoard[rIndex][cIndex] = value
    return initBoard
  },
  reset: () => {
    initBoard = Array(["null", "null", "null"], ["null", "null", "null"], ["null", "null", "null"])
    return initBoard
  }
}

const overSituation = {
  row1: [ [0, 0], [0, 1], [0, 2] ],
  row2: [ [1, 0], [1, 1], [1, 2] ],
  row3: [ [2, 0], [2, 1], [2, 2] ],
  col1: [ [0, 0], [1, 0], [2, 0] ],
  col2: [ [0, 1], [1, 1], [2, 1] ],
  col3: [ [0, 2], [1, 2], [2, 2] ],
  slash1: [ [0, 0], [1, 1], [2, 2] ],
  slash2: [ [0, 2], [1, 1], [2, 0] ],
}

const FIRST_STEP: INextStepType = "player"

export default function TicTacToe() {
  const [nextStep, setNextStep] = useState<INextStepType>(FIRST_STEP)
  const [checkerBoard, setCheckerBoard] = useState<ICheckerValueType[][]>(initBoard)
  const [emptyCheckerItems, setEmptyCheckerItems] = useState<[number, number][]>([[1, 1]])
  const [gameover, setGameover] = useState(false)
  const [overStatus, setOverStatus] = useState('')
  const [winner, setWinner] = useState('')

  useEffect(() => {
    const emptyItems = resetEmptyCheckerItems()
    /** 监测游戏结束  */
    const overSituationKey = Object.keys(overSituation)
    let isOver = false
    for(let i = 0; i < overSituationKey.length; i++) {
      let firstValue = ''
      const curSit = overSituation[overSituationKey[i]]
      for(let j = 0; j < curSit.length; j++) {
        const sitValue = getValueByIndex(curSit[j][0], curSit[j][1])
        if(sitValue === 'null') {
          isOver = false
          break
        }else if(firstValue === '') {
          firstValue = sitValue
        }else if(firstValue !== sitValue){
          isOver = false
          break
        }else {
          isOver = true
        }
      }

      if(isOver) {
        setGameover(true)
        setOverStatus(overSituationKey[i])
        setWinner(firstValue === 'o' ? 'player' : 'computer')
        break
      }
    }

    if(!isOver && emptyItems.length <= 0) {
      setGameover(true)
      setWinner('null')
    }

  }, [checkerBoard])

  useEffect(() => {
    if(!gameover && nextStep === 'computer') {
      // 棋盘还有位置并且监测到游戏还没结束
      if(emptyCheckerItems.length > 0) {
        //轮到电脑
        const coordinate = randomCoordinate(emptyCheckerItems)
        computerClickColItem(coordinate[0], coordinate[1])
        setNextStep('player')
      }
    }
  }, [nextStep])

  useEffect(() => {
    return () => {
      restartGame()
    }
  }, [])


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
    setEmptyCheckerItems([...emptyCheckerItem])
    return emptyCheckerItem
  }

  //玩家点击
  const playerClickColItem = async (rIndex: number, cIndex: number) => {
    await changeValueByIndex(rIndex, cIndex)
    setNextStep('computer')
    
  }

  //电脑点击
  const computerClickColItem = async (rIndex: number, cIndex: number) => {
    await changeValueByIndex(rIndex, cIndex)
  }


  /** 通过传入的坐标返回value */
  const getValueByIndex = (rIndex: number, cIndex: number) => checkerBoard[rIndex][cIndex]

  /** 通过传入的坐标改变value */
  const changeValueByIndex = (rIndex: number, cIndex: number) => {
    return new Promise(resolve => {
      const targetValue = nextStep === 'computer' ? 'x' : 'o'
      if(getValueByIndex(rIndex, cIndex) === 'null') {
        const newBoard = initBoardApi.changeBoardValueByIndex(rIndex, cIndex, targetValue)
        setCheckerBoard([...newBoard])
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

  const restartGame = () => {
    setNextStep(FIRST_STEP)
    setCheckerBoard(initBoardApi.reset())
    setEmptyCheckerItems([[1, 1]])
    setGameover(false)
    setOverStatus('')
    setWinner('')
  }

  return (
    <div className="ticTacToeContainer">
      <h1 className="title textCenter"> 井 字 棋 </h1>
      <div className={`gameStage ${gameover ? 'gameover' : ''}`}>
        {renderBoard()}
        <div className="cLine col1"></div>
        <div className="cLine col2"></div>
        <div className="rLine row1"></div>
        <div className="rLine row2"></div>
        <div className={`overLine ${overStatus !== '' && overStatus}`}></div>
      </div>
      <div className={`overMessage textCenter ${gameover ? '' : 'none'}`}>
        <p className="mb10">{winner !== 'null' ? `${winner === 'player' ? '你': '电脑'}赢了！`: '和局'}</p>
        <p className="pointer restartBtn" onClick={restartGame}>要不要再来一局</p>
      </div>

    </div>
  )
}