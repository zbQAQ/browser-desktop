import React, { useState } from "react";
import useToast from "@/hooks/useToast"


export default function ToastExample() {

  const [ toastId, setToastId ] = useState<string>()
  const { showToast, hideToast } = useToast()

  const handleShowClick = () => {
    const id = showToast({ 
      position: "left",
      content: "现在时间是" + new Date(),
    })
    setToastId(id)
  }


  return (
    <div className="textCenter">
      <h1 onClick={handleShowClick}>showToast</h1>
      <h1 onClick={() => hideToast(toastId) }>关闭</h1>
    </div>
  )
}