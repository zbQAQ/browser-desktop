const router = require('express').Router()
const todoController = require("../controller/todoList")

router.get("/list", todoController.list)
router.post("/add", todoController.add)
router.post("/update", todoController.updateStatus)
router.get("/delete", todoController.delete)

export default router