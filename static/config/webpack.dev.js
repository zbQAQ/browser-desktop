const path = require("path");
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');

module.exports = {
  mode: "development",
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, "../../var/static"),
    host: "localhost",
  },
  plugins: [
    new ErrorOverlayPlugin()
  ],
};
