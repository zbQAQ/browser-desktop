import React, { useState } from "react";
import useToast from "@/hooks/useToast"


export default function ToastExample() {

  const [ toastId, setToastId ] = useState(0)
  const { showToast } = useToast()

  const handleShowClick = () => {
    const id = showToast("你好啊")
    setToastId(id)
  }


  return (
    <div>
      <h1 onClick={handleShowClick}>showToast</h1>
    </div>
  )
}