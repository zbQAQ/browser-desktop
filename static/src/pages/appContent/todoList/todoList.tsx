import React, { useCallback, useEffect, useRef, useState } from "react"

import MIcon from "@/components/mIcon/mIcon"
import { getTodoList, addTotoList, deleteTodoList, updateTodoStatus } from "@/api/todoList"
import { animation, timeFormat } from "@/util/common"
import useFetch, { FETCH_STATUS } from "@/hooks/useFetch"

import "./todoList.less"

interface ITodoListItem {
  id: string
  status: number // status 0: 无状态  1：complete已完成
  title: string
}

export default function TodoList() {
  const [data, setData] = useState<ITodoListItem[]>([])
  const [selectId, setSelectId] = useState("")
  const [afterAction, setAfterAction] = useState("")
  const [isIncrease, setIsIncrease] = useState(false)
  const increaseInput = useRef() as any

  const getList = useCallback(() => {
    return getTodoList()
  }, [])
  const { data: listData, triggerFetch: triggerGetList } = useFetch(getList, { autoReset: true })

  const addTodo = useCallback(() => {
    const value = increaseInput.current.value.trim()
    return value.length > 0 ? addTotoList(increaseInput.current.value.trim()) : Promise.resolve()
  }, [increaseInput.current])
  const { status: addStatus, triggerFetch: triggerAddTodo } = useFetch(addTodo, { autoReset: true, immediate: false })

  const delTodo = useCallback(() => {
    return selectId ? deleteTodoList(selectId) : Promise.resolve()
  }, [selectId])
  const { triggerFetch: triggerDelTodo } = useFetch(delTodo, { autoReset: true, immediate: false })

  const updateTode = useCallback(() => {
    const stataus = listData.find((v: ITodoListItem) => v.id === selectId)?.status
    return selectId ? updateTodoStatus(selectId, !!stataus) : Promise.resolve()
  }, [selectId])
  const { triggerFetch: triggerUpdateTodo } = useFetch(updateTode, { autoReset: true, immediate: false })


  useEffect(() => {
    if(listData && listData.length > 0) {
      setData(listData)
    }
  }, [listData])

  useEffect(() => {
    if(addStatus === FETCH_STATUS.FETCH_SUCCEEDED) {
      const cntDom = document.getElementById(`todoCnt`)
      if(cntDom) {
        const width = cntDom.offsetWidth
        increaseInput.current.value = ''
        triggerGetList()
        animation(cntDom, { left: width, opacity: 0 }, 5, () => {
          animation(cntDom, { left: -width / 5 }, 1, () => {
            animation(cntDom, { left: 0, opacity: 100, }, 5)
          })
        })
      }
    }
  }, [addStatus])

  const clearAction = () => {
    setSelectId("")
    setAfterAction("")
  }

  // 动作触发
  useEffect(() => {
    if(selectId && afterAction){
      if(afterAction === 'delete') {
        const itemDom = document.getElementById(`todoItem${selectId}`)
        if(itemDom) {
          triggerDelTodo()
          animation(itemDom, { opacity: 0 }, 5, () => {
            animation(itemDom, { height: 0, marginBottom: 0 }, 4, () => {
              triggerGetList()
              clearAction()
            })
          })
        }
      }
      if(afterAction === 'updateStatus') {
        // 为保留 update 时 check动画 修改状态时只更新本地列表和请求update接口
        // 等新的时机 获取服务器新的列表
        triggerUpdateTodo()
        setData(data.map(d => {
          if(d.id === selectId) {
            d.status = d.status ? 0 : 1
          }
          return d
        }))
        setTimeout(() => {
          clearAction()
        }, 0)
      }
      
    }
  }, [selectId, afterAction])


  const renderItem = (item: any) => {
    const { status, title, id, createTime } = item
    return (
      <div key={id} id={`todoItem${id}`} className={`todoItem pointer mb10 ${status === 1 ? 'complete' : ''}`}>
        <div className="checkbox textCenter" onClick={()=>{setSelectId(id);setAfterAction('updateStatus')}}></div>
        <p className="name">{title}</p>
        {createTime && <p className="updateTime">{timeFormat(createTime, "MM-dd")}</p>}
        <div className="deleteIcon textCenter" onClick={()=>{setSelectId(id);setAfterAction('delete')}}>
          <MIcon iconType="iconfont" iconName="iconlajitong"></MIcon>
        </div>
      </div>
    )
  }

  const clickIncreaseIcon = () => {
    setIsIncrease(!isIncrease)
    if(!isIncrease && increaseInput.current) {
      increaseInput.current.focus()
    }
  }

  const increaseInputKeyUp = (e: KeyboardEvent) => {
    if(e.key === 'Enter') {
      triggerAddTodo()
    }
  }

  const renderHead = () => {
    const inputClassStr = `mr10 ${isIncrease ? 'isIncrease' : ''}`
    const iconClassStr = `pointer ${isIncrease ? 'isIncrease' : ''}`
    return (
      <>
        <span className="title">Todo</span>
        <div className="increase">
          <input type="text" ref={increaseInput} className={inputClassStr} placeholder="Enter 添加你的计划" onKeyUp={(e: any) => {increaseInputKeyUp(e)}} />
          <MIcon iconType="iconfont" iconName="iconadd" className={iconClassStr} onClick={() => {clickIncreaseIcon()}}></MIcon>
        </div>
      </>
    )
  }
  
  const render = () => {
    return (
      <div className="todoContainer">
        <div className="todoHead">
          {renderHead()}
        </div>
        <div className="todoCnt mt10 pb10" id="todoCnt">
          {data.map(v => renderItem(v))}
        </div>
      </div>
    )
  }
  
  
  return render()
}