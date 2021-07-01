import express from 'express';
const imageRoute = require("./image")

module.exports = (app: express.Application) => {
  app.use("/image", imageRoute)
}