const router = require('express').Router()
const todoController = require("../controller/todoList")
const { catchError } = require("../util/common")

router.get("/list", catchError(todoController.list))
router.post("/add", catchError(todoController.add))
router.post("/update", catchError(todoController.updateStatus))
router.get("/delete", catchError(todoController.delete))

export default router