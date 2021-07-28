import { Request, Response, NextFunction } from "express";
const path = require("path")
const fs = require("fs");
const PATH = path.resolve(__dirname, "../model/todoList.json")
const { createHexRandom } = require("../util/common")
const uResponse = require("../util/response")

interface IData {
  id: string
  status: number
  content: string
}

class TodoList {
  constructor() {}

  list(req: Request, res: Response, next: NextFunction) {
    const data = fs.readFileSync(PATH, "utf8");
    uResponse.success(res, JSON.parse(data))
  }

  add(req: Request, res: Response, next: NextFunction) {
    const { content } = req.body
    if(!content) {
      res.send({ data: null, status: 500, errormsg: "payload missing content" });
      return
    }
    const data = JSON.parse(fs.readFileSync(PATH, "utf8"));
    data.push({ id: createHexRandom(16), status: 0, title: content })
    fs.writeFileSync(PATH, JSON.stringify(data, null, 2), { encoding: 'utf8' })
    uResponse.success(res, 'ok')
  }

  updateStatus(req: Request, res: Response, next: NextFunction) {
    const { id, status } = req.body
    if(!id) {
      res.send({ data: null, status: 500, errormsg: "payload missing id" });
      return
    }
    let data = JSON.parse(fs.readFileSync(PATH, "utf8"));
    data = data.map((v: IData) => {
      if(v.id === id) {
        v.status = status
      }
      return v
    })
    fs.writeFileSync(PATH, JSON.stringify(data, null, 2), { encoding: 'utf8' })
    uResponse.success(res, 'ok')
  }

  delete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.query
    if(!id) {
      res.send({ data: null, status: 500, errormsg: "payload missing id" });
      return
    }
    const data = JSON.parse(fs.readFileSync(PATH, "utf8"));
    const indx = data.findIndex((v: IData) => v.id === id)
    data.splice(indx, 1)
    fs.writeFileSync(PATH, JSON.stringify(data, null, 2), { encoding: 'utf8' })
    uResponse.success(res, 'ok')
  }

}

module.exports = new TodoList();
