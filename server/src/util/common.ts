/**
 * @name createHexRandom 生成指定位数 hex 随机字符串
 * 
 * @param {number}  length 位数
 * 
 * @return {string} 
 */

module.exports = {
  createHexRandom: (length: number) => { 
    let num = ""
    for(let i = 0; i < length; i++) {
      const temp = Math.ceil(Math.random() * 15)
      if(temp > 9) {
        switch(temp){ 
          case(10):
            num+='a';
            break;
          case(11):
            num+='b';
            break;
          case(12):
              num+= 'c';
            break;
          case(13):
            num+='d';
            break;
          case(14):
            num+='e';
            break;
          case(15):
            num+='f';
            break;
        }
      } else {
        num += temp
      }
    }
    return num
  }
}