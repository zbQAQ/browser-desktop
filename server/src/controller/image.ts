import { Request, Response, NextFunction } from 'express'
const { getConfig } = require("../util/config")
const OSS = require('ali-oss');

const client = new OSS({...getConfig("oss")})

class MImage {
  constructor(){}

  async thumbnailList(req: Request, res: Response, next: NextFunction) {
    const { objects } = await client.listV2({
      prefix: 'images/'
    })
    const data = []
    // 根据数据返回 objects 中 size不为0的才是正确文件内容
    for(let i = 0; i < objects.length; i++) {
      const n = objects[i]
      if(n.size > 0) {
        data.push({
          name: n.name,
          thumbUrl: n.url + "?x-oss-process=image/resize,w_180",
          url: n.url
        })
      }
    }

    // TODO: 统一规范返回格式
    res.send({ data, status: 200, errormsg: '' })
  }

  async upload(req: any, res: Response, next: NextFunction) {
    res.send({ data: req.file })
  }
}

module.exports = new MImage()