const router = require('express').Router()
const imageController = require("../controller/image")
const { catchError } = require("../util/common")

router.post("/upload", require("../util/upload").single('file'), imageController.upload)
router.get("/list/thumbnail", catchError(imageController.thumbnailList))

export default router