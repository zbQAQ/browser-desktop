const fs = require("fs")
const path = require("path")

const CONFIG_PATH = path.resolve(__dirname, "../../../var/server.config.json")
let config: Record<string, any>

module.exports = {
  init: () => {
    const configString = fs.readFileSync(CONFIG_PATH,'utf8');
    console.debug("====Config Initialization successful====")
    config = JSON.parse(configString);//读取的值
  },
  getConfig: (key: string) => {
    return config[key]
  }
}