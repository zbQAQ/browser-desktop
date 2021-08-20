import React from "react"
import Toast, { ToastInstance, ToastPosition } from "./toast"
import { COMMON_TOAST_SPACING } from "./toastProvider"

import "./toastContainer.less"

interface ToastContainerProps {
  toasts: ToastInstance[]
  clearToasts: () => void
}

const getCurrTop = (originArr: ToastInstance[], index: number, position: ToastPosition): number => {
  const beforeToast = originArr.slice(0, index)
  const totalHeight = beforeToast.reduce((total, current) => {
    const { position: pCurrent = 'center' } = current
    const h = position === pCurrent ? (document.getElementById("toast-" + current.id)?.clientHeight || 0) + COMMON_TOAST_SPACING : 0
    return h + total
  }, COMMON_TOAST_SPACING)

  return totalHeight
}

export default function ToastContainer(props: ToastContainerProps) {
  const { toasts, clearToasts } = props

  return (
    <div className="toast-container">
      {
        toasts.map((toast: ToastInstance, index, oriArr) => {
          const { id, position = 'center' } = toast
          const top = getCurrTop(oriArr, index, position)
          return <Toast key={id} { ...toast } top={top} resetTopCallback={clearToasts} />
        })
      }
    </div>
  )
}