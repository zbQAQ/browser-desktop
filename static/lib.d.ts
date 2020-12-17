
//applications 唯一键值的appkey
type IAppKey = '' | 'search' | 'chess' | 'tic_tac_toe' | 'todo_list'

//applications 显示方式 
type IShowType = 'dialog' |  'newPage';

//appContent 应用程序显示的dialog样式
type IAppContentStyle = 'fullScreen'| 'darkBackground'| 'floatWindow'| 'floatCenter' | 'garyBackground'

interface UrlParmas {
  appkey?: IAppKey
}

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