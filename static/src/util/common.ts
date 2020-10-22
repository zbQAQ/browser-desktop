
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
 * @param rate 速率 越大越慢越小越快
 * 
 * options 支持大部分基础样式
 * 需要注意的是 opacity的范围是 1~100 而不是 0~1
 * 
 * key 不支持驼峰 比如 fontSize就不行 必须font-size
 * 
 */
export const animation = (el: HTMLElement | null, options: Record<string,  number>, rate: number = 10) => {
  if(!el) return;
  // debugger;
  const timer = setInterval(() => {
    let flag = true;
    for(let k in options) {
      // debugger;
      let curVal: number;
      let realVal = getRealStyleValue(el, k)
      let unit = ""
      if(realVal.includes("px")) {
        unit = "px"
      }

      if(k === 'opacity') {
        curVal = Number(realVal) * 100
      }else {
        curVal = parseInt(realVal.replace("px", "")) //加上parseInt修复原始值带小数的情况
      }

      if(curVal !== options[k]) {
        flag = false
      }

      let speed = (options[k] - curVal) / rate //速率
      speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed)

      if(k === 'opacity') {
        el.style[k] = (curVal + speed) / 100 + unit
      }else {
        el.style[k] = curVal + speed + unit
      }
      
    }
    if(flag) {
      clearInterval(timer)
    }
  }, 1000/60)
}