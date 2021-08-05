
//applications 唯一键值的appkey
type IAppKey = '' | 'search' | 'chess' | 'tic_tac_toe' | 'todo_list' | 'huarong_road' | 'waterfall_layout' | 'wallpaper_selector' | 'toast_example' | 'icss_wall'

//applications 显示方式 
type IShowType = 'dialog' | 'newPage';

//appContent 应用程序显示的dialog样式 static\src\components\appDialog\appContentStyle.less
type IAppContentStyle = 
  'fullScreen' |
  'darkBackground' |
  'floatWindow' |
  'floatCenter' |
  'garyBackground' |
  'fontBlack' |
  'fontWhite' |
  'w650px' |
  'h650px' |
  'w850px' |
  'h850px' |
  'w1200px' |
  'w1200px' |
  'whiteShadow' |
  'blackShadow' |
  'darkCloseBtn'

interface IAppContentMap {
  //IAppContentMap 渲染app内容的类型接口
  key: IAppKey
  dialogStyle: IAppContentStyle[]
  renderComponents: any
}

interface IDesktopAppType {
  //IDesktopAppType 桌面app数据的类型接口
  id: number
  key: IAppKey
  name: string
  iconType: string
  iconName: string
  showType: IShowType
  pagePath?: string
}

interface Window {
  CONFIG: {
    apiHost: string
  }
  createObjcectURL: any
  createOjcectURL: any
}


interface IActionType<T = any> {
  type: T
}

// context & reducer
interface IAnyAction<T> extends IActionType<T> {
  // payload?: any
  // dispatch 不再显示 key， 需 reducer 根据不同类型约定使用不同key
  [extraProps: string]: any
}