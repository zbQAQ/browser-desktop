import React, { useContext, useCallback, useRef, useState } from "react"

import useFetch, { FETCH_STATUS } from "@/hooks/useFetch"
import { uploadImag, getWallpaperThumb } from "@/api/image"

import { AppInfoContext, APP_ACTION_TYPE } from "@/context/appInfoProvider"

import "./wallpaperSelector.less"

const mockData = [
  "https://zhoubao-browser-desktop.oss-cn-shenzhen.aliyuncs.com/images/background.jpg",
  "https://zhoubao-browser-desktop.oss-cn-shenzhen.aliyuncs.com/images/15655977217c186ce142d61e3c98588a.jpg",
  "https://zhoubao-browser-desktop.oss-cn-shenzhen.aliyuncs.com/images/2751f1c4ac9bf2e4c1e15417bd2ddc3e.jpg",
  "https://zhoubao-browser-desktop.oss-cn-shenzhen.aliyuncs.com/images/ead944ae9254f7394ee5e828b846da75.jpg",
]

function WallpaperSelector() {
  const { dispatch } = useContext(AppInfoContext)
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

  
  const getThumbList = useCallback(() => {
    return getWallpaperThumb()
  }, [])
  
  const { data, status } = useFetch(getThumbList, { immediate: true })

  const isFetching = status === FETCH_STATUS.FETCHING;
  const isFailed = status === FETCH_STATUS.FETCH_FAILED;
  const isSucceeed = status === FETCH_STATUS.FETCH_SUCCEEDED;

  const handleItemClick = (wallpaper: string) => {
    const payload = { wallpaper }
    dispatch({ type: APP_ACTION_TYPE.UPDATE_WALLPAPER, payload })
  }

  const renderList = useCallback(() => {
    if(!isSucceeed) return null;
    return data.map((v: any)=> (
      <div key={v.name} className="wallpaper-item" style={{backgroundImage: `url(${v.thumbUrl})`}} onClick={() => handleItemClick(v.url)}>
        <div className="selected textCenter">
          <span className="iconfont iconxuanzhong"></span>
        </div>
      </div>
    ))
  }, [isSucceeed])

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
        {renderList()}
      </div>
      

      {/* <input type="file" ref={inputRef}/>
      <button onClick={upload}>upload</button> */}
    </div>

  )
}

export default WallpaperSelector