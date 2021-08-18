import { RequestHandler, Request, Response, NextFunction } from "express";
const uResponse = require("./response")

module.exports = {
  /**
   * @name createHexRandom 生成指定位数 hex 随机字符串
   * 
   * @param {number}  length 位数
   * 
   * @return {string} 
   */
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
  },

  // 统一接口错误捕捉
  catchError: (handler: RequestHandler) => {
    return (req: Request, res:Response, next: NextFunction) => {
      try {
        handler(req, res, next)
      } catch(e) {
        uResponse.error(res, e.message || 'catchError: 服务器错误')
      }
    }
  },

  // 统一处理替换 协议头
  replaceProtocol: (str: string, before: string, after: string) => {
    return str.replace(before, after)
  }
}