import React, { useRef, useState } from "react"

import MIcon from "@/components/mIcon/mIcon"

import { animation } from "@/util/common"

import "./todoList.css"

interface ITodoListItem {
  id: number
  status: number // status 0: 无状态  1：complete已完成
  title: string
}

const mockTodoData: ITodoListItem[] = [
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
  {
    id: 4,
    status: 0,
    title: "nameeeeeeeeee3"
  },
  {
    id: 5,
    status: 0,
    title: "nameeeeeeeeee3"
  },
  {
    id: 6,
    status: 0,
    title: "nameeeeeeeeee3"
  },
  {
    id: 7,
    status: 0,
    title: "nameeeeeeeeee3"
  },
  {
    id: 8,
    status: 0,
    title: "nameeeeeeeeee3"
  },
  {
    id: 9,
    status: 0,
    title: "nameeeeeeeeee3"
  },
  {
    id: 10,
    status: 0,
    title: "nameeeeeeeeee3"
  },
  {
    id: 11,
    status: 0,
    title: "nameeeeeeeeee3"
  },
]

const mockTodoApi = {
  changeStatus: (id: number, status: number) => {
    const item = mockTodoData.find(v => v.id === id)
    if(item) {
      item.status = status
    }
    return mockTodoData
  },
  delete: (id: number) => {
    const index = mockTodoData.findIndex(v => v.id === id)
    mockTodoData.splice(index, 1)
    return mockTodoData
  },
  increase: (title: string) => {
    mockTodoData.unshift({
      id: Date.now(),
      status: 0,
      title: title
    })
    return mockTodoData
  }
}

export default function TodoList() {
  const [data, setData] = useState(mockTodoData)
  const [isIncrease, setIsIncrease] = useState(false)
  const increaseInput = useRef() as any

  const setItemStatus = (item: ITodoListItem, status: boolean) => {
    //status 是经过取反的值
    const data = mockTodoApi.changeStatus(item.id, status ? 1 : 0)
    setData(data)
  }

  const delItem = (id: number) => {
    const itemDom = document.getElementById(`todoItem${id}`)
    if(itemDom) {
      const data = mockTodoApi.delete(id)
      animation(itemDom, { opacity: 0 }, 5, () => {
        animation(itemDom, { height: 0, marginBottom: 0 }, 4, () => {
          setData(data)
        })
      })
    }
  }

  const increaseTodo = () => {
    const cntDom = document.getElementById(`todoCnt`)
    if(cntDom) {
      const width = cntDom.offsetWidth
      const title = increaseInput.current.value
      const data = mockTodoApi.increase(title)
      increaseInput.current.value = ''
      animation(cntDom, { left: width, opacity: 0 }, 5, () => {
        animation(cntDom, { left: -width / 5 }, 1, () => {
          setData([...data])
          animation(cntDom, { left: 0, opacity: 100, }, 5)
        })
      })
    }
  }

  const renderItem = (item: any) => {
    const { status, title, id } = item
    return (
      <div key={id} id={`todoItem${id}`} className={`todoItem pointer mb10 ${status === 1 ? 'complete' : ''}`}>
        <div className="checkbox textCenter" onClick={()=>{setItemStatus(item, !status)}}></div>
        <p className="name fontBlack">{title}</p>
        <div className="deleteIcon textCenter" onClick={()=>{delItem(id)}}>
          <MIcon iconType="iconfont" iconName="iconlajitong"></MIcon>
        </div>
      </div>
    )
  }

  const clickIncreaseIcon = () => {
    setIsIncrease(!isIncrease)
  }


  const renderHead = () => {
    return (
      <>
        <span className="title">Today</span>
        <div className="increase">
          <input type="text" ref={increaseInput} className={`mr10 fontBlack ${isIncrease ? 'isIncrease' : ''}`} onKeyUp={(e: any) => {e.key === 'Enter' ? increaseTodo() : null} } />
          <MIcon iconType="iconfont" iconName="iconadd" className={`pointer ${isIncrease ? 'isIncrease' : ''}`} onClick={() => {clickIncreaseIcon()}}></MIcon>
        </div>
      </>
    )
  }

  const render = () => {
    console.log("render once")
    return (
      <div className="todoContainer">
        <div className="todoHead">
          {renderHead()}
        </div>
        <div className="todoCnt mt10 mb10" id="todoCnt">
          {data.map(v => renderItem(v))}
        </div>
      </div>
    )
  }
  
  
  return render()
}