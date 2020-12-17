import React, { useState } from "react"

import MIcon from "@/components/mIcon/mIcon"

import "./todoList.css"

// status 0: 无状态  1：complete已完成
const mockTodoData = [
  { 
    id: 1,
    status: 0,
    title: "nameeeeeeeeee1"
  },
  {
    id: 2,
    status: 1,
    title: "nameeeeeeeeee2"
  },
  {
    id: 3,
    status: 0,
    title: "nameeeeeeeeee3"
  },
]

export default function TodoList() {
  const [data, setData] = useState(mockTodoData)
  const setItemStatus = (item: { status: any; title?: string }, status: number) => {
  }

  const renderItem = (item: any) => {
    const { status, title, id } = item
    return (
      <div key={id} className={`todoItem pointer mb10 ${status === 1 ? 'complete' : ''}`} onClick={()=>{setItemStatus(item, 1)}}>
        <div className="checkbox textCenter"></div>
        <p className="name fontBlack">{title}</p>
        <div className="deleteIcon textCenter">
          <MIcon iconType="iconfont" iconName="iconlajitong"></MIcon>
        </div>
      </div>
      
    )
  }

  const render = () => {
    return (
      <div className="todoContainer">
        <div className="todoHead">
          <span className="title">Today</span>
        </div>
        <div className="todoCnt mt10 mb10">
          {data.map(v => renderItem(v))}
        </div>
      </div>
    )
  }
  
  
  return render()
}