import { appContentMap } from "@/config/appContentMap"


/**
 * 根据appkey 找到app对应的 content 信息
 * 
 * @param appKey: IAppKey
 * @return IAppContentMap
 */
 export const findAppContentByKey = (appKey: IAppKey) => {
  if(appKey !== '') {
    return appContentMap.find(c => c.key === appKey) || null
  }
}