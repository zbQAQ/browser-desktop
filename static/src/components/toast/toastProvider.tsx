import React, { PropsWithChildren, createContext, useState } from "react"
import { ToastInstance } from "./toast"
import ToastContainer from "./toastContainer"


export interface IToastHelper {
  // 传入content  返回生成toastId
  showToast: (content: string) => number
  // 传入要隐藏的toastId  返回传入的id
  hideToast: (instanceId?: number) => void
}

export const ToastContext = createContext<IToastHelper | null>(null)

export default function ToastProvider(props: PropsWithChildren<Record<string, any>>) {

  const [ toasts, setToasts ] = useState<ToastInstance[]>([])

  const showToast = (content: string) => {
    const id = Date.now()
    setToasts(pre => [...pre, {id, content}])
    return id
  }

  const hideToast = (id?: number) => {
    setToasts(preToast => id ? preToast.filter(v => v.id !== id) : [])
  }
  
  const contextValue: IToastHelper = {
    showToast,
    hideToast
  }

  console.log("ToastProvider toasts", toasts)
  return (
    <ToastContext.Provider value={contextValue}>
      {props.children}
      <ToastContainer toasts={toasts} />
    </ToastContext.Provider>
  )

}