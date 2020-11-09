import { useRef, useEffect } from "react"

interface IntervalRef {
  current: Function
}

export default function useSetInterval(callback: Function, delay: number) {
  const ref = useRef() as IntervalRef

  useEffect(() => {
    ref.current= callback
  })

  useEffect(() => {
    const tick = () => {
      ref.current();
    }
    const timer = setInterval(tick, delay)
    return () => clearInterval(timer)
  }, [])

}