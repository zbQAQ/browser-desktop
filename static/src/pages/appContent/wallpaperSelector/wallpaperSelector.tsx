import React, { useEffect, useRef, useState } from "react"
import { uploadImag } from "@/api/image"

import "./wallpaperSelector.less"

function WallpaperSelector() {
  
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)

  const upload = () => {
    if(inputRef.current && inputRef.current.files) {
      setFile(inputRef.current.files[0])
    }
  }

  useEffect(() => {
    if(file) {
      const formData = new FormData()
      formData.append("file", file);
      uploadImag(formData)
    }
  }, [file])

  return (
    <div className="wallpaper-container">
      <input type="file" ref={inputRef}/>
      <button onClick={upload}>upload</button>
    </div>

  )
}

export default WallpaperSelector