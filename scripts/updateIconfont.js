const inquirer = require("inquirer")
const path = require("path")
const fs = require('fs');

const templateFilePath = path.resolve(__dirname, "../static/template.html")

const opitons = [
  {
    name: "cssLink",
    message: "1. Please input iconfont css link",
    type: "input"
  },
  {
    name: "jsLink",
    message: "2. Please input iconfont js link",
    type: "input"
  },
]

const cssReg = /(?<=<!-- iconfont css start --><link rel="stylesheet" href=")(.*)(?=" \/><!-- iconfont css end -->)/g
const jsReg = /(?<=<!-- iconfont js start --><script src=")(.*)(?="><\/script><!-- iconfont js end -->)/g

inquirer.prompt(opitons)
  .then(input => {
    fs.readFile(templateFilePath, function(err, data) {
      if(err) {
        console.log(err);
        return false;
      }
      let templateString = data.toString()

      if(input.cssLink) {
        templateString = templateString.replace(cssReg, input.cssLink)
        console.log('\n templateString: iconfont cssLink replace successul')
      }
      
      if(input.jsLink) {
        templateString = templateString.replace(jsReg, input.jsLink)
        console.log('\n templateString: iconfont jsLink replace successul')
      }

      if(templateString !== data.toString()) {
        // 当内容有修改时才 写入文件
        fs.writeFile(templateFilePath, templateString, function(err) {
          if(err) {
            return console.log(err);
          }
          console.log("\n The template.html write successul and save!!!");
        });
      } else {
        console.log("\n Nothing changes")
      }
    });

  })
  .catch(errr => {
    console.log("err", err);
  })