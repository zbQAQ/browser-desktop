import { useCallback, useEffect, useReducer } from "react"

// fetch 状态
export const enum FETCH_STATUS {
  INIT = 'init',
  READY = 'ready',
  FETCHING = 'fetching',
  FETCH_SUCCEEDED = 'fetchSucceeded',
  FETCH_FAILED = 'fetchFailed',
}

interface IFetchState {
  // 请求状态
  status: FETCH_STATUS,
  // loading 状态
  loading: boolean,
  // 返回的数据
  data: any
  // 错误信息
  errormsg: string
}

// 异步请求体
type IFetcher = (...args: any[]) => Promise<Record<string, any>>;

interface IFetchOptions {
  // 是否立即请求
  immediate?: boolean
  // 初始数据 data
  initData?: any
}

const defaultOption = {
  immediate: true,
  initData: null,
}

// 请求状态处理
function fetchReducer(state: IFetchState, action: IAction) {
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

export default function useFetch(fetcher: IFetcher, options: IFetchOptions): IFetchState {
  const opts = { ...defaultOption, ...options }
  const { immediate, initData } = opts

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
        const payload = { data: resp.data }
        dispatch({ type: FETCH_STATUS.FETCH_SUCCEEDED, payload: payload })
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

  return { ...state }
}