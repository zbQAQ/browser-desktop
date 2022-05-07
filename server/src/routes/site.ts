import { Response } from "express";
const router = require('express').Router()
const { catchError } = require("../util/common")
const { getStaticConfig } = require("../util/config")
const fs = require("fs");

router.get("/", catchError(renderPage))

function renderPage(req: Request, res: Response) {
  const staticConfig = getStaticConfig()
  const index = fs.readFileSync(staticConfig.distDir + '/index.html');
  const html = index.toString()

  res.send(html)
}

export default router