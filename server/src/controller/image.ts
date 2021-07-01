import { Request, Response, NextFunction } from 'express'
const { getConfig } = require("../util/config")
const OSS = require('ali-oss');

const client = new OSS({...getConfig("oss")})

class MImage {
  constructor(){}

  async list(req: Request, res: Response, next: NextFunction) {
    const list = await client.listV2({
      prefix: 'images/'
    })

    res.send({ data: list })
  }

  async upload(req: any, res: Response, next: NextFunction) {
    res.send({ data: req.file })
  }
}

module.exports = new MImage()