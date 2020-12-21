import React, { useState } from "react"
import { compilation } from "webpack"

import "./tictactoe.css"


/**
 * 0 0 0
 * 0 0 0
 * 0 0 0
 * 
 * x o 0
 * 
 */

const initBoard = [
  ["null", "null", "null"],
  ["null", "null", "null"],
  ["null", "null", "null"]
]


export default function TicTacToe() {

  const [checkerBoard, setCheckerBoard] = useState(initBoard)

  const renderBoard = () => {
    return (
      <>
        {checkerBoard.map((row, rIndex) => {
          return <div className="row" key={`${row}${rIndex}`}>
            {row.map((col, cIndex) => {
              return renderColItem(col, rIndex, cIndex)
            })}
          </div>
        })}
      </>
    )
  }
  
  const renderColItem = (value: string, rIndex: number, cIndex: number) => {
    return (
      <div className="col pointer" key={`${rIndex}${cIndex}`} onClick={() => {clickColItem(rIndex, cIndex)}}>
        {value === 'null' ? '' : value}
      </div>
    )
  }

  const clickColItem = (rIndex: number, cIndex: number) => {
    console.log("你当前点击了", [rIndex, cIndex])
  }

  return (
    <div className="ticTacToeContainer">
      <h1 className="title textCenter"> ~ 井字棋 ~ </h1>
      <div className="gameStage">
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