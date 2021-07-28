import { Response } from "express";

class UniteResponse {

  success(res: Response, data: any) {
    res.send({ data: data, status: 200, errormsg: "" })
  }

  error(res: Response, errormsg: string) {
    console.log("UniteResponse errormsg: ", errormsg)
    res.send({ status: 500, errormsg, })
  }
}

module.exports = new UniteResponse()