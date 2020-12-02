import React, { useEffect, useState } from "react"
import Applications from "./components/applications/applications"
import AppDialog from "./components/appDialog/appDialog"

import "./home.css"

interface IAppInfoContext {
  appKey: string;
  setAppKey: Function;
  dialogIsShow: boolean;
  // setDialogIsShow: Function;
}

const defaultAppInfo: IAppInfoContext = {
  appKey: "",
  setAppKey: () => {},
  dialogIsShow: false,
  // setDialogIsShow: () => {}
}

export const AppInfoContext = React.createContext(defaultAppInfo);
export default function Home() {

  const [appKey, setAppKey] = useState('Search')
  const [dialogIsShow, setDialogIsShow] = useState(false)

  useEffect(() => {
    if(appKey) {
      setDialogIsShow(true)
    }else {
      setDialogIsShow(false)
    }
  }, [appKey])

  return (
    <AppInfoContext.Provider value={{appKey, setAppKey, dialogIsShow}}>
      <div className="home">
        <Applications></Applications>
        <AppDialog></AppDialog>
      </div>
    </AppInfoContext.Provider>
  )
}