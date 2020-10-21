import React, { useState, useEffect } from "react"
import { timeFormat } from "@/util/common"

interface IProps {
  timerFlag?: Boolean
}

export default function SearchBar(props: IProps) {
  const [timeText, setTimeText] = useState(timeFormat(new Date(), "HH:mm"));
  const { timerFlag = true } = props
  //计时功能
  if(timerFlag) {
    setInterval(() => {
      setTimeText(timeFormat(new Date(), "HH:mm"))
    }, 1000)
  }

  return (
    <div className="searchBar">
      <p className="countTime">{timeText}</p>
    </div>
  )
}