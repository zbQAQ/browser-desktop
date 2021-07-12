import { useCallback, useEffect, useReducer } from "react"

// fetch 状态
export const enum FETCH_STATUS {
  INIT = 'init',
  READY = 'ready',
  FETCHING = 'fetching',
  FETCH_SUCCEEDED = 'fetchSucceeded',
  FETCH_FAILED = 'fetchFailed',
}

interface IFetchState<T> {
  // 请求状态
  status: FETCH_STATUS,
  // loading 状态
  loading: boolean,
  // 返回的数据
  data: any
  // 错误信息
  errormsg: string
}
interface R<T> extends IFetchState<T> {
  /** 请求触发器，由外层调用 */
  triggerFetch: () => void;
}

// 异步请求体
type IFetcher = (...args: any[]) => Promise<any>;

interface IFetchOptions {
  // 是否立即请求
  immediate?: boolean
  // 初始数据 data
  initData?: any
  // 是否自动重置
  autoReset?: boolean
  // 自动重置计时
  autoResetDelay?: number
  // 请求结束手动延时
  mockDelay?: number
  // 请求完成时的回调函数
  callback?: () => void
}

const defaultOption: IFetchOptions = {
  immediate: true,
  initData: null,
  autoReset: false,
  autoResetDelay: 1000,
  mockDelay: 0,
}

// 请求状态处理
function fetchReducer<T>(state: IFetchState<T>, action: IAction) {
  console.log("fetchReducer", state, action)
  switch (action.type) {
    case FETCH_STATUS.INIT:
    case FETCH_STATUS.READY: {
      return { ...state, status: action.type, loading: false }
    }
    case FETCH_STATUS.FETCHING: {
      return { ...state, status: action.type, loading: true }
    }
    case FETCH_STATUS.FETCH_SUCCEEDED: {
      const { data } = action.payload
      return { ...state, status: action.type, data, errormsg: '', loading: false }
    }
    case FETCH_STATUS.FETCH_FAILED: {
      const { errormsg } = action.payload
      return { ...state, status: action.type, data: null, errormsg, loading: false }
    }
    default:
      throw new Error('Unknown fetch action');
  }
}

export default function useFetch<T = Record<string, any>>(fetcher: IFetcher, options?: IFetchOptions): R<T> {
  const opts = { ...defaultOption, ...options }
  const { immediate, initData, autoReset, autoResetDelay, mockDelay, callback } = opts

  const initState = {
    data: initData ?? null,
    errormsg: '',
    status: FETCH_STATUS.INIT,
    loading: false,
  }

  const [ state, dispatch ] = useReducer(fetchReducer, initState)
  
  const { status } = state

  // 请求触发器
  const triggerFetch = useCallback(() => {
    dispatch({ type: FETCH_STATUS.READY })
  }, [])

  // 请求体
  const doFetch = useCallback(async () => {
    try {
      dispatch({ type: FETCH_STATUS.FETCHING })
      const resp = await fetcher()
      if(resp.status === 200) {
        const dispatchSuccess = () => {
          const payload = { data: resp.data }
          dispatch({ type: FETCH_STATUS.FETCH_SUCCEEDED, payload: payload })
          callback && callback()
          if(autoReset) {
            setTimeout(() => {
              dispatch({ type: FETCH_STATUS.INIT })
            }, autoResetDelay)
          }
        }
        if(mockDelay) {
          setTimeout(dispatchSuccess, mockDelay)
        } else {
          dispatchSuccess()
        }
      } else {
        const payload = { errormsg: 'Failed to fetch' }
        dispatch({ type: FETCH_STATUS.FETCH_FAILED, payload: payload })
      }
    } catch (error) {
      const payload = { errormsg: error.message || 'Failed to fetch' }
      dispatch({ type: FETCH_STATUS.FETCH_FAILED, payload: payload })
    }
  }, [fetcher])

  // 请求状态由非Ready变成Ready时，触发请求逻辑
  useEffect(() => {
    if(status === FETCH_STATUS.READY) {
      doFetch()
    }
  }, [status, doFetch])

  // 检测是否立即触发请求
  useEffect(() => {
    immediate && triggerFetch();
  }, [triggerFetch, immediate]);

  return { ...state, triggerFetch }
}