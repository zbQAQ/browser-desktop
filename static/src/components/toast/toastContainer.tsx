import React from "react"
import Toast, { ToastInstance } from "./toast"
import { COMMON_TOAST_SPACING } from "./toastProvider"

import "./toastContainer.less"

interface ToastContainerProps {
  toasts: ToastInstance[]
  clearToasts: () => void
}

const getCurrTop = (originArr: ToastInstance[], index: number): number => {
  const beforeToast = originArr.slice(0, index)
  const totalHeight = beforeToast.reduce((total, current) => {
    const h = document.getElementById("toast-" + current.id)?.clientHeight || 0
    return h + total + COMMON_TOAST_SPACING
  }, COMMON_TOAST_SPACING)

  return totalHeight
}

export default function ToastContainer(props: ToastContainerProps) {
  const { toasts, clearToasts } = props

  return (
    <div className="toastContainer">
      {
        toasts.map((toast: ToastInstance, index, oriArr) => {
          const { id } = toast
          const top = getCurrTop(oriArr, index)
          return <Toast key={id} { ...toast } top={top} resetTopCallback={clearToasts} />
        })
      }
    </div>
  )
}