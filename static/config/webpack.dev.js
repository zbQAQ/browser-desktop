const path = require("path");
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');

module.exports = {
  mode: "development",
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, "../../var/static"),
    historyApiFallback: true,
    host: "localhost",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", "jsx"],
    alias: {
      "@": path.resolve(__dirname, "../src")
    }
  },
  plugins: [
    new ErrorOverlayPlugin()
  ],
};
