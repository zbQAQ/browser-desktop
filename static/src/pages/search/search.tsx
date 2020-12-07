import React, { useEffect, useRef, useState } from "react"
import { timeFormat } from "@/util/common"
import useSetInterval from "@/hooks/useSetInterval"

import MIcon from "@/components/mIcon/mIcon"

import "./search.css"
import { animation } from "@/util/common"

const INPUT_PLACEHOLDER_TEXT = "Search"
const SEARCH_OPTIONS = [
  {
    type: "baidu",
    icon: "iconbaidu",
    prePath: "https://www.baidu.com/s?word="

  },
  {
    type: "chrome",
    icon: "iconguge",
    prePath: "https://www.google.com/search?q="
  }
]

export default function Search() {
  const searchOptList = SEARCH_OPTIONS

  //input 是否 focus
  const [focusInput, setFocusInput] = useState(false)
  const [searchType, setSearchType] = useState(searchOptList[0].type || 'baidu')
  const [placeholder, setPlaceholder] = useState(INPUT_PLACEHOLDER_TEXT)
  const inputRef = useRef(null) as any
  const searchOptRef = useRef(null)

  const onInputFocus = (flag = true) => {
    setFocusInput(flag)
    setPlaceholder(flag ? '' : INPUT_PLACEHOLDER_TEXT)
  }
  const clickTrigger = (e: any) => {
    const willFocusClass = ["searchOpt", "searchInput", "searchOptIcon"] 
    const className = e.target.className
    for(let i in willFocusClass) {
      if(className.includes(willFocusClass[i])) {
        onInputFocus(true)    
        return
      }
    }
    onInputFocus(false)
  }

  const inputKeyup = (e: any) => {
    if(e.keyCode === 13) {
      const curType = searchOptList.find(v => v.type === searchType)
      const value = inputRef.current.value
      if(curType && focusInput && value.length) {
        window.open(curType.prePath + value)
      }
    }
  }

  const renderClock = () => {
    const [timeText, setTimeText] = useState(timeFormat(new Date(), "HH:mm:ss"))
    const clockText = useRef(null)

    useSetInterval(() => {
      setTimeText(timeFormat(new Date(), "HH:mm:ss"))
    }, 1000)

    const hoverClockText = () => {
      animation(clockText.current, {"font-size": 42}, 2, () => {
        animation(clockText.current, {"font-size": 40}, 2)
      })
    }
    const leaveClockText = () => {
      animation(clockText.current, {"font-size": 34}, 2, () => {
        animation(clockText.current, {"font-size": 36}, 2)
      })
    }

    return(
      <h1 className="clock pointer textCenter" ref={clockText} onMouseEnter={hoverClockText} onMouseOut={leaveClockText}>
        {timeText}
      </h1>
    )
  }

  useEffect(() => {
    window.addEventListener("click", clickTrigger)
    window.addEventListener("keyup", inputKeyup)
    return () => {
      window.removeEventListener("click", clickTrigger)
      window.removeEventListener("keyup", inputKeyup)
    }
  }, [focusInput, searchType])

  const render = () => {
    const inputClasses = `searchInput textCenter ${ focusInput ? 'onFocus' : '' }`
    const optClasses = `searchOptBox ${ focusInput ? 'show' : 'hide' }`
    return (
      <>
        {renderClock()}

        <div className="searchContainer textCenter">
          <div className={optClasses} ref={searchOptRef}>
            {searchOptList.map(v => (
              <div key={v.type} className={`searchOpt pointer ${searchType === v.type ? 'active' : ''}`} onClick={() => {setSearchType(v.type)}}>
                <MIcon iconName={`searchOptIcon ${v.icon}`} iconType="iconfont"></MIcon>
              </div>
            ))}
          </div>

          <input 
            type="text"
            ref={inputRef}
            placeholder={placeholder} 
            className={inputClasses}
          />
        </div>
      </>
    )
  }

  return render()
}