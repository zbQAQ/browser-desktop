const fs = require("fs")
const path = require("path")

const CONFIG_PATH = path.resolve(__dirname, "../../../var/server.config.json")
const STATIC_CONFIG_PATH = path.resolve(__dirname, "../../../var/static.config.json")
let config: Record<string, any>

module.exports = {
  init: () => {
    const configString = fs.readFileSync(CONFIG_PATH, 'utf8');
    console.debug("====Config Initialization successful====")
    config = JSON.parse(configString);//读取的值
  },
  getConfig: (key: string) => {
    return config[key]
  },
  // 获取static配置文件 
  getStaticConfig: () => {
    const configString = fs.readFileSync(STATIC_CONFIG_PATH, 'utf8');
    let config = JSON.parse(configString);
    delete config.distDir
    return config
  }
}