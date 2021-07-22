import React, { PropsWithChildren, createContext, useState } from "react"
import { ToastInstance } from "./toast"
import ToastContainer from "./toastContainer"

const COMMON_TOAST_WIDTH = 375

export interface IToastHelper {
  // 传入content  返回生成toastId
  showToast: (options: ToastInstance) => number
  // 传入要隐藏的toastId  返回传入的id
  hideToast: (instanceId?: number) => void
}

export const ToastContext = createContext<IToastHelper | null>(null)

export default function ToastProvider(props: PropsWithChildren<Record<string, any>>) {

  const [ toasts, setToasts ] = useState<ToastInstance[]>([])

  const showToast = (options: ToastInstance) => {
    const id = Date.now()
    setToasts(pre => [...pre.filter(v => v.visible), { id, width: COMMON_TOAST_WIDTH, ...options, visible: true }])
    return id
  }

  const hideToast = (id?: number) => {
    setToasts(pre => {
      return pre.map(t => {
        if(t.id === id) t.visible = false;
        return t
      })
    })
  }
  
  const contextValue: IToastHelper = {
    showToast,
    hideToast
  }

  // console.log("ToastProvider toasts", toasts)
  return (
    <ToastContext.Provider value={contextValue}>
      {props.children}
      <ToastContainer toasts={toasts} />
    </ToastContext.Provider>
  )

}