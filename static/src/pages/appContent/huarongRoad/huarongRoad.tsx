import React, { useCallback, useEffect, useRef, useState } from "react"
import { debug } from "webpack"

import "./huarongRoad.css"
interface IContainerInfo {
  offsetTop: number  //div距离屏幕顶部的高度
  offsetLeft: number //div距离屏幕左侧的宽度
  scrollTop: number  //div滚动了多少
}

interface IMousePosition {
  x: number  //div距离屏幕顶部的高度
  y: number //div距离屏幕左侧的宽度
}

interface IGoodsType {
  id: number 
  style: {},
  size: { col: number, row: number },
  coordinate: { x: number, y: number, angle: number }
}

const capacity = { col: 8, row: 8 }

const singleGridW = 100
const singleGridH = 100

const randomColor = () => {
  return '#' + Math.random().toString(16).substr(2, 6).toUpperCase();
}


let Goods: IGoodsType[] = []
const goodsMockApi = {
  initGoods: () => {
    // coordinate 的xy坐标是物品左上角的坐标 即起始点的坐标
    // size col是横向宽  row是纵向的高
    Goods = [
      {
        id: 1,
        style: {
          backgroundColor: 'rgb(87 80 204 / 0.8)',
        },
        size: { col: 2, row: 2 },
        coordinate: { x: 0, y: 0, angle: 0 }
      },
      {
        id: 2,
        style: {
          backgroundColor: 'rgb(66 66 123 / 0.8)',
        },
        size: { col: 3, row: 3 },
        coordinate: { x: 0, y: 5, angle: 0 }
      },
    ]
    return Goods
  },
  findItemById: (id: number) => {
    return Goods.find((v: { id: number; }) => v.id === id)
  },
  changeCoordinate: (id: number, x: number, y: number, angle: number = 0) => {
    const item = Goods.find((v: { id: number; }) => v.id === id)
    if(item) {
      const { coordinate } = item
      if(coordinate.x === x && coordinate.y === y && coordinate.angle === angle) return;
      coordinate.x = x
      coordinate.y = y
      coordinate.angle = angle
    }
    return Goods
  }
}

let gridMap: number[][] = []
const gridMapMockApi = {
  initGridMap: () => {
    gridMap = Array(8).fill(capacity.row).map(() => Array(capacity.col).fill(0))
    return gridMap
  },
  setSingleGridData: (j: number, i: number, goodsId: number) => {
    gridMap[i][j] = goodsId
    return gridMap
  }
}


//通过鼠标坐标xy 和 地图信息 来获取当前鼠标指向的是哪个 singleGrid
function getGridByMousePos(mousePos: IMousePosition, containerInfo: IContainerInfo) {

  const { x: mouseX, y: mouseY } = mousePos
  const { offsetLeft, offsetTop, scrollTop } = containerInfo

  let gridX = Math.floor((mouseX - offsetLeft) / singleGridW)
  let gridY = Math.floor((mouseY - offsetTop + scrollTop) / singleGridH)

  return [gridX, gridY]
}

//根据当前渲染的grid xy, 判断是否 被某个goods占位
function setGoodsIdByCoordinate(x: number, y: number, goods: IGoodsType[]) {
  let result = { flag: false, data: 0, corrdinate: [x, y] }
  for(let i = 0; i < goods.length; i++) {
    const { coordinate, size, id } = goods[i]
    const start = [coordinate.x, coordinate.y]
    const end = [coordinate.x + size.col - 1, coordinate.y + size.row - 1]
    if(x >= start[0] && x <= end[0] && y >= start[1] && y <= end[1]) {
      result = Object.assign(result, { flag: true, data: id })
      return result;
    } else {
      result = Object.assign(result, { flag: false, data: 0 })
    }
  }
  return result
}

export default function HuarongRoad() {
  //通过第一次渲染 gridMap 时 来对 grid进行赋值
  const [firstRender, setFirstRender] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [draggingId, setDraggingId] = useState(0)
  const [mousePosition, setMousePosition] = useState<IMousePosition>({ x: 0, y: 0 })
  const [containerInfo, setContainerInfo] = useState<IContainerInfo>({
    offsetTop: 0,
    offsetLeft: 0,
    scrollTop: 0,
  })
  const [goods, setGoods] = useState<IGoodsType[]>(goodsMockApi.initGoods())
  const [gridMap, setGirdMap] = useState<number[][]>(gridMapMockApi.initGridMap())

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
    setMousePosition({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: any) => {
    if(isDragging && draggingId != 0) {
      //拖拽中
      // console.log("拖拽中", { x: e.clientX, y: e.clientY })
      setMousePosition({ x: e.clientX, y: e.clientY })
      console.log(getGridByMousePos({ x: e.clientX, y: e.clientY }, containerInfo))
    }
  }
  
  const handleMouseUp = (e: any) => {
    const hoverGoodsItem = goodsMockApi.findItemById(draggingId)
    
    console.log(hoverGoodsItem)
    const [x, y] = getGridByMousePos({ x: e.clientX, y: e.clientY }, containerInfo)
    console.log(x, y)

    // getGoodsIdByCoordinate(x, y, goods)

    setIsDragging(false)
    setDraggingId(0)
  }

  const renderGrid = () => {
    // console.log("renderGrid", mousePosition, isDragging)
    let html = []
    // i 代表第几行 j代表第几列
    for(let i = 0; i < gridMap.length; i++) {
      const curRow = gridMap[i]
      for(let j = 0; j < curRow.length; j++) {

        if(firstRender) {
          const { flag, data } = setGoodsIdByCoordinate(j, i, goods)
          if(flag && data !== 0 && gridMap[i][j] === 0) {
            const newGridMap = gridMapMockApi.setSingleGridData(j, i, data)
            setGirdMap(newGridMap)
          }
        }

        const classs = "singleGrid fontWhite textCenter"
        if(isDragging && draggingId != 0) {
          //当前被拖拽的goods
          // const dragItem = goodsMockApi.findItemById(draggingId)
          // const { size } = dragItem
          
          // console.log(getGridByMousePos(mousePosition, containerInfo))
        }

        html.push(<div className={classs} key={`${j},${i}`}>{j}, {i} {gridMap[i][j] > 0 && `, ${gridMap[i][j]}`}</div>)
      }
    }

    firstRender && setFirstRender(false)
    return html
  }

  const renderGoods = () => {
    let html = []
    
    for(let i = 0; i < goods.length; i++) {
      let { id, coordinate, size, style } = goods[i]
      const width = size.col * singleGridW
      const height = size.row * singleGridH
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