export const timeFormat = (time: number | Date, fmt = "yyyy-MM-dd") => {
  const date = time ? new Date(time) : new Date()
  let resTime = fmt

  const o = {
    // "y+": date.getFullYear(),
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "D+": date.getDate(),
    "h+": date.getHours(),
    "H+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds(),
  }

  if(new RegExp(`(y+)`).test(fmt)) {
    resTime = resTime.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length) )
  }

  for(let k in o) {
    if(new RegExp(`(${k})`).test(fmt)) {
      resTime = resTime.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] + "" : ( "00" + o[k]).substr(("" + o[k]).length))
    }
  }

  return resTime;
}

export const getRealStyleValue = (el: HTMLElement, key: string) => {
  return window.getComputedStyle(el, null).getPropertyValue(key)
}

/**
 * @name animation 动画函数
 * 
 * @param el 元素HTMLElement
 * @param options 样式修改项
 * @param rate 速率 越大越慢 越小越快
 * 
 * options 支持大部分基础样式
 * 需要注意的是 opacity的范围是 1~100 而不是 0~1
 * 
 */
let timer: any = null
export const animation = (el: HTMLElement | null, options: Record<string,  number>, rate: number = 10, callBack?: Function) => {
  if(!el) return;
  if(timer) clearInterval(timer);
  timer = setInterval(() => {
    let flag = true;
    for(let k in options) {
      let curVal: number;
      let realKey = k.replace(/[A-Z]/g, (str) => `-${str.toLowerCase()}`);
      let realVal = getRealStyleValue(el, realKey)
      let unit = ""
      if(realVal.includes("px")) {
        unit = "px"
      }

      if(realKey === 'opacity') {
        curVal = Number(realVal) * 100
      }else {
        curVal = parseInt(realVal.replace("px", "")) //加上parseInt修复原始值带小数的情况
      }

      if(curVal !== options[k]) {
        flag = false
      }

      let speed = (options[k] - curVal) / rate //速率
      speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed)

      if(realKey === 'opacity') {
        el.style[realKey] = (curVal + speed) / 100 + unit
      }else {
        el.style[realKey] = curVal + speed + unit
      }
      
    }
    if(flag) {
      clearInterval(timer)

      if(callBack) callBack();

    }
  }, 1000/60)
}

/**
 * @name windowResize 窗口大小变化函数
 * 
 * @return {width: 100, height: 100} 返回当前窗口的宽度和高度
 * 
 * 需要主动使用addEventListener监听resize事件
 * 在组件注销时使用removeEventListener主动销毁
 */

export const windowResize = () => {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  }
}

/**
 * 防抖
 * 
 * @param fn      防抖的回调函数
 * @param delay   延迟
 * @param args    剩余参数
 */
export function debounce(fn: Function, delay: number = 500, ...args: any[]) {
  let timer: any = 0
  return function () {
    if(timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}

/**
 * 节流
 * 
 */
export function throttle(fn: Function, delay: number = 500, ...args: any[]) {
  let last = Date.now()
  return function() {
    let now = Date.now()
    if(now - last > delay) {
      fn(...args)
    }
    last = now
  }
}


/**
 * @name queryParse 用于处理 页面参数解析
 * 
 * 不支持同名key值 后面的key-value会覆盖前面的
 * 
 * @param str       即将解析的数据 str
 * @param seq       各个参数之间分隔符
 * @param eq        单个参数中 key-value的分隔符
 * 
 * @return {Object} 返回解析后的数据对象
 */
export function queryParse(str: string, seq: string = "&", eq: string = "="): Record<string, any> {
  const res = {}
  // 删除 问号和问号之前的字符
  const cStr = str.replace(/.*\?/g, '')
  const valuesArr = cStr.split(seq)
  const len = valuesArr.length
  for(let i = 0; i < len; i++) {
    const [key, value] = valuesArr[i].split(eq)
    res[key] = value
  }
  return res
}

/**
 * @name queryStringify 用于处理 对象格式化 为 类似页面参数形式
 * 
 * @param obj       即将格式化的数据对象
 * @param seq       各个参数之间分隔符
 * @param eq        单个参数中 key-value的分隔符
 * 
 * @return {string} 返回格式化后的字符串 不带问号
 */
export function queryStringify(obj: Record<string, any>, seq: string = "&", eq: string = "=") {
  const qs = []
  const keys = Object.keys(obj)
  const len = keys.length
  for(let i = 0; i < len; i++) {
    const value = obj[keys[i]]
    const key = keys[i]
    qs.push( [key, value].join(eq) )
  }
  return qs.join(seq)
}