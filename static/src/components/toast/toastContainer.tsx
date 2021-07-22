import React from "react"
import Toast, { ToastInstance } from "./toast"

import "./toastContainer.less"

interface ToastContainerProps {
  toasts: ToastInstance[]
}

export default function ToastContainer(props: ToastContainerProps) {
  const { toasts } = props
  // console.log("toastContainer", toasts)
  return (
    <div className="toastContainer">
      {
        toasts.map((toast: ToastInstance) => {
          const { id, content } = toast
          return <Toast key={id} { ...toast } />
        })
      }
    </div>
  )
}