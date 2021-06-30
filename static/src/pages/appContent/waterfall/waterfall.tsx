import React, { useEffect, useRef, useState } from "react"
import { randomNum } from "@/util/common"

import "./Waterfall.less"

// 等宽 | 等高
type IEqualType = 'width' | 'height' 

interface IDataModel {
  text: number
  width: number
  height: number
  backgroundColor: string
  top?: number
  left?: number
  styles: Record<string, any>
}

// 随机数据
const randomData = (len: number, type = 'width') => {
  const res: IDataModel[] = []
  for(let i = 0; i < len; i++) {
    res.push({
      text: i + 1,
      width: type === 'width' ? 200 : randomNum(200, 300),
      height: type === 'height' ? 200 : randomNum(260, 500),
      backgroundColor: `rgba(${randomNum(0, 255)}, ${randomNum(0, 255)}, ${randomNum(0, 255)}, 0.5)`,
      styles: {}
    })
  }

  return res;
}

// 初始化 数据地图信息
const constructorList = (len: number): any[] => {
  const res: any[] = []
  if(len <= 0) return res
  let i = 0
  while(i < len) {
    res.push([])
    i++
  }
  return res
}

// 获取当前数据 所在列的下标
const getColumnIndex = (index: number, columnNum: number) => {
  return index % columnNum
}

// 根据当前 x y 获取 top 和 left
const getPosition = (map: IDataModel[][], columnNum: number, rowIndex: number, spacing: number) => {

  let top = 0
  let left = 0
  if(rowIndex > 0) {
    let grand = map[columnNum].slice(0, rowIndex)
    let h = grand.reduce((total: number, next: any) => total + next.height, 0)
    let s = grand.length * spacing
    top = h + s
  }
  if(columnNum > 0) {
    let grand = map.slice(0, columnNum)
    let w = grand.reduce((total, next) => total + next[0].width, 0)
    let s = grand.length * spacing
    left = w + s
  }
  return { top, left }
}

// 获取高度最高的列高和
const getMaxHeight = (map: IDataModel[][]) => {
  const heightArr = map.map(col => (col[col.length - 1].top || 0) + col[col.length - 1].height)
  return Math.max(...heightArr)
}

const DATA_NUM = 30

function Waterfall() {

  const btnOption = [
    {text: "刷新数据", key: "refresh", onclick: () => setData(randomData(DATA_NUM, equalType))},
    {text: "等宽布局", key: "width", onclick: () => setEqualType('width')},
    {text: "等高布局", key: "height", onclick: () => setEqualType('height')},
  ]

  
  // 布局类型 等宽或等高
  const [equalType, setEqualType] = useState<IEqualType>("width")
  // 布局数据
  const [data, setData] = useState(randomData(DATA_NUM, equalType))
  // 整体瀑布流容器 宽度
  const [flowContainerW, setFlowContainerW] = useState(0)
  // 整体瀑布流容器 高度
  const [flowContainerH, setFlowContainerH] = useState(0)
  // 整体瀑布流容器
  const flowContent = useRef<HTMLDivElement>(null)
  // 布局信息 列数、列间距
  const [grid, setGrid] = useState({ columnNum: 0, spacing: 0 })
  // 最终渲染的列表
  const [list, setList] = useState<IDataModel[]>([])

  useEffect(() => {
    setData(randomData(DATA_NUM, equalType))
  }, [equalType])

  useEffect(() => {
    if(flowContent.current) {
      setFlowContainerW(flowContent.current.offsetWidth)
      // 等宽  根据容器宽度获取列数和间距
      const columnNum = Math.floor(flowContent.current.offsetWidth / data[0].width)
      const spacing = (flowContent.current.offsetWidth % data[0].width) / (columnNum - 1)

      setGrid({ columnNum, spacing })
    }
  }, [flowContent, data])

  useEffect(() => {
    if(grid.columnNum > 0) {
      getFlowItem(data, equalType)
    }
  }, [grid, data])

  const getFlowItem = (data: IDataModel[], type: 'width' | 'height') => {

    if(type === 'width') {
      // 等宽
      const { columnNum, spacing } = grid
      const listInfoMap = constructorList(columnNum)
      for(let i = 0; i < data.length; i++) {
        const cur = data[i]
        listInfoMap[getColumnIndex(i, columnNum)].push(cur)
      }
  
      for(let i = 0; i < columnNum; i++) {
        const columnData = listInfoMap[i]
        for(let j = 0; j < columnData.length; j++) {
          const curItem = columnData[j]
          const { top, left } = getPosition(listInfoMap, i, j, spacing)
          curItem["top"] = top
          curItem["left"] = left
          curItem["styles"] = {
            width: curItem.width,
            height: curItem.height,
            backgroundColor: curItem.backgroundColor,
            top: curItem.top,
            left: curItem.left,
          }
        }
      }
      setFlowContainerH(getMaxHeight(listInfoMap))
      setList(listInfoMap.flat())
    } else if(type === 'height') {
      // 等高
      const height = data[0].height
      // 容器宽度
      const clientWidth = flowContainerW
      // 等高布局行间距固定
      const rowSpacing = 20
      // 当前是 第几行
      let rowCount = 0

      let list = []
      
      let lastItemsH = 0
      let lastItemsW = 0
      for(let i = 0; i < data.length; i++) {
        const curItem = data[i]
        const nextItem = data[i + 1]
        if(i === 0) {
          curItem["top"] = 0
          curItem["left"] = 0
        } else {
          curItem["top"] = lastItemsH
          curItem["left"] = lastItemsW
        }

        curItem["styles"] = {
          width: curItem.width,
          height: height,
          backgroundColor: curItem.backgroundColor,
          top: curItem.top,
          left: curItem.left,
        }

        lastItemsH = (height + rowSpacing) * rowCount
        lastItemsW += curItem.width

        if(!!list[rowCount]) {
          list[rowCount].push(curItem)
        } else {
          list[rowCount] = [curItem]
        }

        if(lastItemsW + (nextItem ? nextItem.width : 0) > clientWidth) {
          rowCount += 1
          lastItemsH = height * rowCount + rowCount * rowSpacing
          lastItemsW = 0
        }
      }

      for(let i = 0; i < list.length; i++) {
        const row = list[i]
        const rowLen = row.length
        const colSpacing = (clientWidth - row.reduce((total, next) => total + next.width, 0)) / (rowLen - 1)
        for(let j = 1; j < rowLen; j++) {
          row[j]["styles"].left = (row[j]["styles"].left || 0) + colSpacing * j
        }
      }
      
      setFlowContainerH( height * (rowCount + 1) + rowSpacing * rowCount)
      setList(list.flat())
    }

  }
  

  return (
    <div className="waterfall-container">
      <div className="flow-options fontWhite mb20 pb10">
        {btnOption.map(v => (
          <span className={`pointer ${v.key === equalType ? 'active' : ''}`} onClick={v.onclick}>{v.text}</span>
        ))}
      </div>
      <div className="flow-content" ref={flowContent} style={{height: flowContainerH}}>
        {list.length > 0 && (
          list.map(v => (
            <div key={v.text} className="flow-item textCenter" style={v.styles}>
              <p className="fontWhite">{v.text}</p>
            </div>
          ))
        )}
      </div>
    </div>  
  )
}

export default Waterfall;