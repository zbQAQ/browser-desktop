import express from 'express';
import imageRoute from "./image" 
import todoRoute from "./todoList" 

module.exports = (app: express.Application) => {
  app.use("/image", imageRoute)
  app.use("/todo", todoRoute)
}