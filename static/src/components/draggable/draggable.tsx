import React, { PropsWithChildren, useCallback, useEffect, useMemo, useState } from "react";

import "./draggable.less"

interface IProps {
  onDragEnd?: (t: IPostionType) => void
}

type IPostionType = { x: number, y: number }

const POSITION: IPostionType = {x: 0, y: 0}

export default function DraggableItem(props: PropsWithChildren<IProps>) {
  const id = Date.now() + "";
  const { children, onDragEnd } = props
  // 拖拽状态 status
  const [ isDragging, setIsDragging ] = useState(false)
  // 原始div相对于窗口左上角的 x y，会在鼠标按下时是初始化赋值
  const [ originPos, setOriginPos ] = useState<IPostionType>(POSITION)
  // 拖拽后的偏移量 x y，会在鼠标移动时是初始化赋值
  const [ offsetPos, setOffsetPos ] = useState<IPostionType>(POSITION)

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsDragging(true)
    setOriginPos({x: event.clientX, y: event.clientY})
  }

  const handleMouseMove = useCallback(({ clientX, clientY }) => {
    setOffsetPos({x: clientX - originPos.x, y: clientY - originPos.y})
  }, [originPos])

  const handleMouseUp = useCallback((e) => {
    onDragEnd && onDragEnd(offsetPos)
    setIsDragging(false)
  }, [onDragEnd])

  useEffect(() => {
    if(isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);

      setOffsetPos(POSITION);
    }
  }, [isDragging])

  const styleees = useMemo(() => ({
    transform: `translate(${offsetPos.x}px, ${offsetPos.y}px)`,
    transition: isDragging ? 'none' : 'transform 500ms',
    zIndex: isDragging ? 2 : 1,
  }), [isDragging, offsetPos])

  return <div id={id} className={`draggableItem`} style={styleees} data-draggable="true" onMouseDown={e => handleMouseDown(e)}>
    {children}
  </div>
}