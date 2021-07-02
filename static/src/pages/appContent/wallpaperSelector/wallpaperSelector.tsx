import React, { useEffect, useRef, useState } from "react"
import { uploadImag } from "@/api/image"

import "./wallpaperSelector.less"

const img1 = require("@/assets/background.jpg").default
const img2 = require("@/assets/background2.jpeg").default
const img3 = require("@/assets/background3.jpeg").default

function WallpaperSelector() {
  
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)

  const upload = () => {
    if(inputRef.current && inputRef.current.files) {
      setFile(inputRef.current.files[0])
    }
  }

  const inputFileChange = () => {
    if(inputRef.current && inputRef.current.files) {
      console.log(inputRef.current.files[0])
      setFile(inputRef.current.files[0])
    }
  }

  // useEffect(() => {
  //   if(file) {
  //     const formData = new FormData()
  //     formData.append("file", file);
  //     uploadImag(formData)
  //   }
  // }, [file])

  return (
    <div className="wallpaper-container">
      <div className="title-box">
        <span className="title mr10">壁纸选择</span>
        <label>
          <input type="file" ref={inputRef} style={{visibility: "hidden", width: 0}} onChange={inputFileChange} />
          <span className="sub-title pointer">上传我喜欢的壁纸</span>
        </label>
        
      </div>

      <div className="wallpaper-list">

        <div className="wallpaper-item" style={{backgroundImage: `url(${img1})`}}>
          <div className="selected textCenter">
            <span className="iconfont iconxuanzhong"></span>
          </div>
        </div>

      </div>
      

      {/* <input type="file" ref={inputRef}/>
      <button onClick={upload}>upload</button> */}
    </div>

  )
}

export default WallpaperSelector