import express from 'express';
import imageRoute from "./image" 
import todoRoute from "./todoList" 
import site from "./site" 

module.exports = (app: express.Application) => {
  app.use("/", site)
  app.use("/image", imageRoute)
  app.use("/todo", todoRoute)
}