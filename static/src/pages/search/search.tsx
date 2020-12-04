import React, { useEffect, useRef, useState } from "react"

import MSvg from "@/components/mSvg/mSvg"

import "./search.css"

const INPUT_PLACEHOLDER_TEXT = "Search"
const SEARCH_OPTIONS = [
  {
    type: "baidu",
    svg: "iconbaiduGray",
    prePath: "https://www.baidu.com/s?word="

  },
  {
    type: "chrome",
    svg: "iconguge",
    prePath: "https://www.google.com/search?q="
  }
]

export default function Search() {
  const searchOptList = SEARCH_OPTIONS

  //input 是否 focus
  const [focusInput, setFocusInput] = useState(false)
  const [searchType, setSearchType] = useState(searchOptList[0].type || 'baidu')
  const [placeholder, setPlaceholder] = useState(INPUT_PLACEHOLDER_TEXT)
  const inputRef = useRef(null)

  const onInputFocus = (flag = true) => {
    setFocusInput(flag)
    setPlaceholder(flag ? '' : INPUT_PLACEHOLDER_TEXT)
  }
  const clickTrigger = (e: any) => {
    if(e.target !== inputRef.current) {
      onInputFocus(false)
    }
  }

  useEffect(() => {
    window.addEventListener("click", clickTrigger)
    return () => {
      window.removeEventListener("click", clickTrigger)
    }
  }, [])


  const render = () => {
    
    const inputClasses = `searchInput textCenter ${ focusInput ? 'onFocus' : '' }`
    const optClasses = `searchOptBox ${ focusInput ? 'show' : 'hide' }`
    return (

      <div className="searchContainer textCenter">

        <div className={optClasses}>
          {searchOptList.map(v => (
            <div key={v.type} className={`searchOpt pointer ${searchType === v.type ? 'active' : ''}`} onClick={() => {setSearchType(v.type)}}>
              <MSvg iconName={v.svg}></MSvg>
            </div>
          ))}
        </div>

        <input 
          type="text"
          ref={inputRef}
          placeholder={placeholder} 
          className={inputClasses} 
          onFocus={() => {onInputFocus(true)}} 
          // onBlur={onInputBlur}
        />

      </div>

    )
  }

  return render()
}