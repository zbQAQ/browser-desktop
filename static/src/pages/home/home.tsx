import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"

import Wallpaper from "@/components/wallpaper/wallpaper"

import Applications from "./components/applications/applications"
import AppDialog from "./components/appDialog/appDialog"

import mockData, { IMockFace } from "@/config/mockData"

import "./home.css"

interface IAppInfoContext {
  appKey: string;
  setAppKey: Function;
  // dialogIsShow: boolean;
  setDialogIsShow: Function;
}

const defaultAppInfo: IAppInfoContext = {
  appKey: "",
  setAppKey: () => {},
  // dialogIsShow: false,
  setDialogIsShow: () => {}
}

export const AppInfoContext = React.createContext(defaultAppInfo);
export default function Home() {

  const [appKey, setAppKey] = useState('')
  const [dialogIsShow, setDialogIsShow] = useState(false)
  const history = useHistory()

  useEffect(() => {
    if(appKey) {
      const curApp = mockData.find((v: IMockFace) => v.key === appKey) as IMockFace
      if(curApp.showType === 'dialog') {
        setDialogIsShow(true)
      } else if(curApp.showType === 'newPage' && curApp.pagePath) {
        history.push(curApp.pagePath)
      }
    }else {
      setDialogIsShow(false)
    }
  }, [appKey])

  return (
    <AppInfoContext.Provider value={{appKey, setAppKey, setDialogIsShow}}>
      <Wallpaper isBlur={dialogIsShow} />
      <div className="home">
        {!dialogIsShow && <Applications />}
        <AppDialog visible={dialogIsShow}></AppDialog>
      </div>
    </AppInfoContext.Provider>
  )
}