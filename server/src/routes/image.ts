const router = require('express').Router()
const imageController = require("../controller/image")

router.post("/upload", require("../util/upload").single('file'), imageController.upload)
router.get("/list", imageController.list)

module.exports = router