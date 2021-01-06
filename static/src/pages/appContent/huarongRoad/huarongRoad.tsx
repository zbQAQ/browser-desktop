import React, { useCallback, useEffect, useRef, useState } from "react"

interface IContainerInfo {
  offsetTop: number  //div距离屏幕顶部的高度
  offsetLeft: number //div距离屏幕左侧的宽度
  scrollTop: number  //div滚动了多少
}

interface IMousePosition {
  x: number  //div距离屏幕顶部的高度
  y: number //div距离屏幕左侧的宽度
}

import "./huarongRoad.css"

const capacity = { col: 8, row: 40 }

const singleGridW = 100
const singleGridH = 100

const randomColor = () => {
  return '#' + Math.random().toString(16).substr(2, 6).toUpperCase();
}

let goods: any = [
  {
    id: 1,
    style: {
      backgroundColor: 'rgb(87 80 204 / 0.8)',
    },
    size: { col: 2, row: 1},
    coordinate: { x: 0, y: 0, angle: 0 }
  },
  {
    id: 2,
    style: {
      backgroundColor: 'rgb(66 66 123 / 0.8)',
    },
    size: { col: 3, row: 4},
    coordinate: { x: 0, y: 5, angle: 0 }
  },
]

const goodsMockApi = {
  findItemById: (id: number) => {
    return goods.find((v: { id: number; }) => v.id === id)
  },
  changeCoordinate: (id: number, x: number, y: number, angle?: number) => {
    const { coordinate } = goods.find((v: { id: number; }) => v.id === id)
    if(coordinate.x === x && coordinate.y === y && coordinate.angle === angle) return;
    coordinate.x = x
    coordinate.y = y
    coordinate.angle = angle
    return goods
  }
}

function getGridByMousePos(mousePos: IMousePosition, containerInfo: IContainerInfo) {

  const { x: mouseX, y: mouseY } = mousePos
  const { offsetLeft, offsetTop, scrollTop } = containerInfo

  let gridX = Math.floor((mouseX - offsetLeft) / singleGridW)
  let gridY = Math.floor((mouseY - offsetTop + scrollTop) / singleGridH)

  return [gridX, gridY]
}


export default function HuarongRoad() {

  const [isDragging, setIsDragging] = useState(false)
  const [draggingId, setDraggingId] = useState(0)
  const [mousePosition, setMousePosition] = useState<IMousePosition>({ x: 0, y: 0 })

  const [containerInfo, setContainerInfo] = useState<IContainerInfo>({
    offsetTop: 0,
    offsetLeft: 0,
    scrollTop: 0,
  })

  let gridMap = Array(capacity.row).fill(Array(capacity.col).fill(''))

  useEffect(() => {
    const container = document.getElementById("huarongContainer")
    if(container) {
      const { top, left } = container.getBoundingClientRect() as any
      setContainerInfo({
        offsetTop: top,
        offsetLeft: left,
        scrollTop: container.scrollTop
      })
    }
  }, [])

  useEffect(() => {
    if(isDragging) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
    } else {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging])

  const handleMouseDown = (e: any, id: number) => {
    e.persist()
    setIsDragging(true)
    setDraggingId(id)
    // setMousePosition({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: any) => {
    if(isDragging && draggingId != 0) {
      //拖拽中
      console.log("拖拽中", { x: e.clientX, y: e.clientY })
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
  }
  
  const handleMouseUp = (e: any) => {
    const hoverGoodsItem = goodsMockApi.findItemById(draggingId)
    console.log(hoverGoodsItem)

    const [x, y] = getGridByMousePos({ x: e.clientX, y: e.clientY }, containerInfo)
    
    setIsDragging(false)
    setDraggingId(0)
  }

  const renderGrid = () => {
    let html = []
    // i 代表第几行 j代表第几列
    for(let i = 0; i < gridMap.length; i++) {
      const curRow = gridMap[i]
      for(let j = 0; j < curRow.length; j++) {
        html.push(<div className="singleGrid fontWhite textCenter" key={`${j},${i}`}>{j}, {i}</div>)
      }
    }
    return html
  }

  const renderGoods = () => {
    let html = []
    
    for(let i = 0; i < goods.length; i++) {
      let { id, coordinate, size, style } = goods[i]
      const width = size.row * singleGridW
      const height = size.col * singleGridH
      let left = coordinate.x * singleGridW
      let top = coordinate.y * singleGridH
      if(isDragging && draggingId !== 0) {
        left = draggingId === id ? mousePosition.x - containerInfo.offsetLeft - width / 2 : left
        top = draggingId === id ? mousePosition.y - containerInfo.offsetTop - height / 2 + containerInfo.scrollTop : top
      }
      let styles = {
        ...style,
        left,
        top,
        width,
        height,
      }
      html.push(
        <div 
          key={id}
          className="goodsItem" 
          style={styles}
          onMouseDown={(e) => {handleMouseDown(e, id)}}
        ></div>
      )
    }

    return html

  }
  
  const handleScroll = (e: any) => {
    e.persist()
    setContainerInfo({
      ...containerInfo,
      scrollTop: e.target.scrollTop
    })
  }

  const render = () => {
    return (
      <div className="huarongContainer" id="huarongContainer" onScroll={handleScroll}>
        {renderGrid()}
        {renderGoods()}
      </div>
    )
  }

  return render()
}