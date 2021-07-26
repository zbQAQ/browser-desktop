import React, { PropsWithChildren, createContext, useState } from "react"
import { generateId } from "@/util/common"
import { ToastInstance } from "./toast"
import ToastContainer from "./toastContainer"

// 宽度
export const COMMON_TOAST_WIDTH = 375

// 间距
export const COMMON_TOAST_SPACING = 20

export interface IToastHelper {
  // 传入content  返回生成toastId
  showToast: (options: ToastInstance) => string
  // 传入要隐藏的toastId  返回传入的id
  hideToast: (instanceId?: string) => void
}

export const ToastContext = createContext<IToastHelper | null>(null)

export default function ToastProvider(props: PropsWithChildren<Record<string, any>>) {

  const [ toasts, setToasts ] = useState<ToastInstance[]>([])

  const clearHiddenToasts = () => {
    setToasts(pre => pre.filter(t => t.visible))
  }

  const showToast = (options: ToastInstance) => {
    const id = generateId()
    setToasts(pre => [...pre.filter(v => v.visible), { id, ...options, visible: true }])
    return id
  }

  const hideToast = (id?: string) => {
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

  return (
    <ToastContext.Provider value={contextValue}>
      {props.children}
      <ToastContainer toasts={toasts} clearToasts={clearHiddenToasts} />
    </ToastContext.Provider>
  )

}