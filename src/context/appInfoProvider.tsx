import React, { useReducer } from 'react';

const SELECTED_WALLPAPER = 'selected-wallpaper';

interface IAppInfoContext {
  appKey: IAppKey;
  wallpaper: string;
  dispatch: React.Dispatch<IAnyAction<APP_ACTION_TYPE>>;
}

const initAppInfo: IAppInfoContext = {
  appKey: '',
  // wallpaper: "http://zhoubao-browser-desktop.oss-cn-shenzhen.aliyuncs.com/images/default-wallpaper.jpg",
  wallpaper: window.localStorage.getItem(SELECTED_WALLPAPER)
    ? window.localStorage.getItem(SELECTED_WALLPAPER) || ''
    : 'https://zhoubao-browser-desktop.oss-cn-shenzhen.aliyuncs.com/images/42bf51b4d888633d171fa27aa6b9e357.png',
  dispatch: () => {},
};

export const AppInfoContext = React.createContext(initAppInfo);

// app应用 操作
export enum APP_ACTION_TYPE {
  // applications
  UPDATE_APP = 'update_app',
  CLEAR_APP = 'clear_app',

  // wallpaper
  UPDATE_WALLPAPER = 'update_wallpaper',
}

const reducer = (
  state: IAppInfoContext,
  action: IAnyAction<APP_ACTION_TYPE>
) => {
  switch (action.type) {
    case APP_ACTION_TYPE.UPDATE_APP:
      return { ...state, appKey: action.appKey };
    case APP_ACTION_TYPE.CLEAR_APP:
      return { ...state, appKey: '' };
    case APP_ACTION_TYPE.UPDATE_WALLPAPER:
      window.localStorage.setItem(SELECTED_WALLPAPER, action.wallpaper || '');
      return { ...state, wallpaper: action.wallpaper };
    default:
      return state;
  }
};

//context引发的重复渲染 详见https://zhuanlan.zhihu.com/p/50336226
export const AppInfoProvider = (props: any) => {
  const [state, dispatch] = useReducer(reducer, initAppInfo);
  return (
    <AppInfoContext.Provider value={{ ...state, dispatch }}>
      {props.children}
    </AppInfoContext.Provider>
  );
};
