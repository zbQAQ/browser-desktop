import express from 'express';
const app: express.Application = express();

app.get("/", (req, res) => {
  res.send("hellooooooooooo~~~~~~~")
})

app.listen(8888, function () {
  console.log("Example app listening on port 8888!");
});
