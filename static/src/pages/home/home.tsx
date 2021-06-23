import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"

import Wallpaper from "@/components/wallpaper/wallpaper"

import Applications from "./components/applications/applications"
import AppDialog from "./components/appDialog/appDialog"

import { desktopApp } from "@/config/appContentMap"

import "./home.less"

interface IAppInfoContext {
  appKey: IAppKey
  setAppKey: Function
  // dialogIsShow: boolean;
  setDialogIsShow: Function
}

const defaultAppInfo: IAppInfoContext = {
  appKey: "",
  setAppKey: () => {},
  // dialogIsShow: false,
  setDialogIsShow: () => {}
}

export const AppInfoContext = React.createContext(defaultAppInfo);
export default function Home() {

  const [appKey, setAppKey] = useState<IAppKey>('')  
  const [dialogIsShow, setDialogIsShow] = useState(false)
  const history = useHistory()

  useEffect(() => {
    if(appKey) {
      const curApp = desktopApp.find((v: IDesktopAppType) => v.key === appKey) as IDesktopAppType
      if(curApp) {
        if(curApp.showType === 'dialog') {
          setDialogIsShow(true)
        } else if(curApp.showType === 'newPage' && curApp.pagePath) {
          history.push(curApp.pagePath)
        }
      } else {
        console.error("未找到相关app")
      }
    }else {
      setDialogIsShow(false)
    }
  }, [appKey])

  useEffect(() => {
    const { search } = location
    const searchArr = search.substr(1).split("&")
    let urlParmas: UrlParmas = {}
    if(searchArr.length > 0) {
      for(let str in searchArr) {
        let param = searchArr[str].split("=")
        urlParmas[param[0]] = param[1]
      }
    }
    if(urlParmas.appkey) {
      setAppKey(urlParmas.appkey)
    }
  }, [])

  return (
    <AppInfoContext.Provider value={{appKey, setAppKey, setDialogIsShow}}>
      <Wallpaper isBlur={dialogIsShow} />
      <div className="home">
        <h1>123</h1>
        {dialogIsShow ? <AppDialog visible={dialogIsShow}></AppDialog> : <Applications />}
      </div>
    </AppInfoContext.Provider>
  )
}