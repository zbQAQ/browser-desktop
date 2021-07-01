import express from 'express';
const app: express.Application = express();
const config = require("./util/config")

config.init()

app.use(require('cors')())
app.use(express.json())

app.get("/", (req, res) => {
  res.send("hellooooooooooo~~~~~~~")
})

// 引入路由主文件
require("./routes")(app)

app.listen(8888, function () {
  console.log("app listening on port 8888!");
});
