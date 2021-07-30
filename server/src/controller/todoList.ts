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
  createTime: number
  updateTime: number
}

class TodoList {
  constructor() {}

  list(req: Request, res: Response, next: NextFunction) {
    let data = JSON.parse(fs.readFileSync(PATH, "utf8"));

    // 根据状态排序 已完成的在列表最后面
    const completed = data.filter((t: IData) => t.status === 1)
    const unCompleted = data.filter((t: IData) => t.status === 0)
    
    for(let i = 0; i < unCompleted.length; i++) {
      for(let j = 1; j < unCompleted.length; j++) {
        if(Number(unCompleted[j].createTime) > Number(unCompleted[j - 1].createTime)) {
          let temp = unCompleted[j]
          unCompleted[j] = unCompleted[j - 1]
          unCompleted[j - 1] = temp
        }
      }
    }

    uResponse.success(res, unCompleted.concat( completed.sort((a: IData, b: IData) => b.createTime - a.createTime) ))
  }

  add(req: Request, res: Response, next: NextFunction) {
    const { content } = req.body
    if(!content) {
      uResponse.error(res, 'payload missing content')
      return
    }
    const data = JSON.parse(fs.readFileSync(PATH, "utf8"));
    data.push({ id: createHexRandom(16), status: 0, title: content, createTime: Date.now(), updateTime: Date.now() })
    fs.writeFileSync(PATH, JSON.stringify(data, null, 2), { encoding: 'utf8' })
    uResponse.success(res, 'ok')
  }

  updateStatus(req: Request, res: Response, next: NextFunction) {
    const { id, status } = req.body
    if(!id) {
      uResponse.error(res, 'payload missing id')
      return
    }
    // 特殊todo 第一条提示不让更改
    if(id === "1") {
      uResponse.error(res, 'first tips cant be update')
      return
    }
    let data = JSON.parse(fs.readFileSync(PATH, "utf8"));
    data = data.map((v: IData) => {
      if(v.id === id) {
        v.status = status
        v.updateTime = Date.now()
      }
      return v
    })
    fs.writeFileSync(PATH, JSON.stringify(data, null, 2), { encoding: 'utf8' })
    uResponse.success(res, 'ok')
  }

  delete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.query
    if(!id) {
      uResponse.error(res, 'payload missing id')
      return
    }
    // 特殊todo 第一条提示不让更改
    if(id === "1") {
      uResponse.error(res, 'first tips cant be delete')
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
