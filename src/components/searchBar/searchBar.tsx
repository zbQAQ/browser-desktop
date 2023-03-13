import React, { useState, useEffect, useRef } from "react"
import { timeFormat } from "@/util/common"
import useSetInterval from "@/hooks/useSetInterval"

import "./searchBar.css"

interface IProps {
  // 时钟功能的flag
  timerFlag?: Boolean
}

interface IState {}

export default function SearchBar(props: IProps) {
  const [timeText, setTimeText] = useState(timeFormat(new Date(), "HH:mm:ss"));
  const { timerFlag = true } = props
  //时钟功能
  if(timerFlag) {
    useSetInterval(() => {
      setTimeText(timeFormat(new Date(), "HH:mm:ss"))
    }, 1000)
  }

  return (
    <div className="searchBar textCenter">
      <p className="countTime mb10 fontblack textCenter">{timeText}</p>
      <input type="text" className="searchInput textCenter" placeholder="Search" />
    </div>
  )
} 