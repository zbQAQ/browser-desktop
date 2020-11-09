const mockData = (count: number) => {
  let result = []
  const iconMap = {
    1: "iconsearch",
    2: "iconjingziqi",
    3: "iconyouxiyouxiqipai",
  }
  const nameMap = {
    5: "一个很长很长很长很长很长的应用名字"
  }
  for(let i = 1; i < count; i++) {
    result.push({
      id: i,
      name: nameMap[i] || `应用${i}`,
      iconType: "svg",
      iconName: iconMap[i] || "iconsearch"
    })
  }
  return result
}

export default mockData(11)