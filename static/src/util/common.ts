
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