import React, { useContext, useCallback, useRef, useState } from "react"

import MIcon from "@/components/mIcon/mIcon"
import Loading, { LOADING_TYPE } from "@/components/loadingv2/loading"
import TransitionGroup from "@/components/transitionGroup/transitionGroup"

import useFetch, { FETCH_STATUS } from "@/hooks/useFetch"
import { uploadImage, getWallpaperThumb } from "@/api/image"

import { AppInfoContext, APP_ACTION_TYPE } from "@/context/appInfoProvider"

import "./wallpaperSelector.less"

export default function WallpaperSelector() {
  const { dispatch, wallpaper } = useContext(AppInfoContext)
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)

  const inputFileChange = () => {
    if(inputRef.current && inputRef.current.files) {
      console.log(inputRef.current.files[0])
      setFile(inputRef.current.files[0])
    }
  }

  const getThumbList = useCallback(() => {
    return getWallpaperThumb()
  }, [])

  const uploadWallpaper = useCallback(async () => {
    if(file) {
      const formData = new FormData()
      formData.append("file", file);
      const res = await uploadImage(formData)
      if(res.data === 'ok') {
        clearFileInput()
      }
      return res
    } else {
      return Promise.resolve()
    }
  }, [file])
  
  const { data, status, triggerFetch: triggerList } = useFetch(getThumbList, { autoReset: true, mockDelay: 2000 })

  const handleItemClick = (wallpaper: string) => {
    dispatch({ type: APP_ACTION_TYPE.UPDATE_WALLPAPER, wallpaper })
  }

  const renderList = useCallback(() => {
    if(!data) return <Loading className="wloading" visible={!data} type={LOADING_TYPE.MATRIX} />;
    return data.map((v: any)=> (
      <div key={v.name} className={`wallpaper-item pointer ${v.url === wallpaper ? 'active': ''}`} style={{backgroundImage: `url(${v.thumbUrl})`}} onClick={() => handleItemClick(v.url)}>
        <div className="selected textCenter">
          <span className="iconfont iconxuanzhong"></span>
        </div>
      </div>
    ))
  }, [status, wallpaper])

  const uploadFetchOption = {
    immediate: false,
    autoReset: true,
    mockDelay: 1000,
    callback: triggerList
  }
  const { status: uploadStatus, triggerFetch: triggerUpload } = useFetch(uploadWallpaper, uploadFetchOption)

  const clearFileInput = () => {
    if(inputRef.current) {
      inputRef.current.value = ''
    }
    setFile(null)
  }
  
  const uploadIcon = () => {
    const readyUpload = uploadStatus === FETCH_STATUS.INIT && !!file
    if(readyUpload) {
      return  (
        <TransitionGroup 
          visible={readyUpload}
          className="icon-upload"
          enterAnimation="flash"
          leaveAnimation="fadeOut"
        >
          <MIcon iconType="iconfont" iconName="iconcloudupload pointer" onClick={() => triggerUpload()}></MIcon>
        </TransitionGroup>
      )
    }
    if(uploadStatus === FETCH_STATUS.FETCHING) {
      return <MIcon iconType="iconfont" iconName="iconloading"></MIcon>
    }
    return null
  }

  return (
    <div className="wallpaper-container">
      <div className="title-box">
        <span className="title mr10">壁纸选择</span>
        <label>
          <input type="file" id="file" ref={inputRef} style={{visibility: "hidden", width: 0}} onChange={inputFileChange} />
          <span className="sub-title pointer">
            上传我喜欢的壁纸
          </span>
        </label>
        {uploadIcon()}
      </div>

      <div className="wallpaper-list">
        {renderList()}
      </div>
      
    </div>

  )
}
