import { Request, Response, NextFunction } from "express";
const path = require("path")
const fs = require("fs");
const PATH = path.resolve(__dirname, "../model/todoList.json")
const { createHexRandom } = require("../util/common")

interface IData {
  id: string
  status: number
  content: string
}

class TodoList {
  constructor() {}

  list(req: Request, res: Response, next: NextFunction) {
    try {
      const data = fs.readFileSync(PATH, "utf8");
      res.send({ data: JSON.parse(data), status: 200, errormsg: "" });
    } catch (e) {
      console.log("下载文件错误", e);
    }
  }

  add(req: Request, res: Response, next: NextFunction) {
    try {
      const { content } = req.body
      if(!content) {
        res.send({ data: null, status: 500, errormsg: "payload missing content" });
        return
      }
      const data = JSON.parse(fs.readFileSync(PATH, "utf8"));
      data.push({ id: createHexRandom(16), status: 0, title: content })
      fs.writeFileSync(PATH, JSON.stringify(data, null, 2), { encoding: 'utf8' })
      res.send({ data: "ok", status: 200, errormsg: "" });
    } catch (e) {
      console.log("下载文件错误", e);
    }
  }

  updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
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
      res.send({ data: "ok", status: 200, errormsg: "" });
    } catch (e) {
      console.log("下载文件错误", e);
    }
  }

  delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.query
      if(!id) {
        res.send({ data: null, status: 500, errormsg: "payload missing id" });
        return
      }
      const data = JSON.parse(fs.readFileSync(PATH, "utf8"));
      const indx = data.findIndex((v: IData) => v.id === id)
      data.splice(indx, 1)
      fs.writeFileSync(PATH, JSON.stringify(data, null, 2), { encoding: 'utf8' })
      res.send({ data: "ok", status: 200, errormsg: "" });
    } catch (e) {
      console.log("下载文件错误", e);
    }
  }

}

module.exports = new TodoList();
