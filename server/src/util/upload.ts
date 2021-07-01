const { getConfig } = require("../util/config")
const { createHexRandom } = require("../util/common")

// FormData 上传模块
const multer = require('multer')
const MAO = require('multer-aliyun-oss');
const upload = multer({
  storage: MAO({
    filename: function (req: any, file: any, cb: any) {
      cb(null, "/images/" + createHexRandom(32) + file.originalname.substr(file.originalname.lastIndexOf('.')))
    },
    config: getConfig('oss')
  })
})

module.exports = upload