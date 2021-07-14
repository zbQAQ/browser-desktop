import React from "react"

export interface ToastInstance {
  id: number,
  content: string
}

interface IProps {
  id: number
  content: string
}

export default function Toast(props: IProps) {
  const { content, id } = props
  return <h1 style={{position: "absolute", top: "0"}}>{content} {id}</h1>
}