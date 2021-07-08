import React, { useReducer } from "react"

interface IAppInfoContext {
  appKey: IAppKey
  wallpaper: string
  dispatch: React.Dispatch<IAction>
}

const initAppInfo: IAppInfoContext = {
  appKey: "",
  wallpaper: "https://zhoubao-browser-desktop.oss-cn-shenzhen.aliyuncs.com/images/background.jpg",
  dispatch: () => {}
}

export const AppInfoContext = React.createContext(initAppInfo);

// app应用 操作
export enum APP_ACTION_TYPE {
  UPDATE_APP = 'update_app',
  CLEAR_APP = 'clear_app'
}

const reducer = (state: IAppInfoContext, action: IAction ) => {
  switch(action.type) {
    case APP_ACTION_TYPE.UPDATE_APP:
      const { payload } = action
      return { ...state, appKey: payload.appKey}
    case APP_ACTION_TYPE.CLEAR_APP:
      return { ...state, appKey: ''}
    default:
      return state  
  }
}

//context引发的重复渲染 详见https://zhuanlan.zhihu.com/p/50336226
export const AppInfoProvider = (props: any) => {
  const [state, dispatch] = useReducer(reducer, initAppInfo)
  return (
    <AppInfoContext.Provider value={{ ...state, dispatch }}>
      {props.children}
    </AppInfoContext.Provider>
  )
}