const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const devConfig = require("./config/webpack.dev");
const prodConfig = require("./config/webpack.prod");
const { merge } = require("webpack-merge");

const mergeConfig =
  process.env.NODE_ENV === "development" ? devConfig : prodConfig;

const config = {
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "../var/static"),
    filename: "index.js"
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", "json"],
    alias: {
      "@": path.resolve(__dirname, "src"),
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|gif)/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 50000 /*图片小于limit值时，将图片打印成base64放在js文件中;大于时直接打包到dist文件中*/,
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    // 这里面的template是模板的位置，title是模板渲染的变量 htmlWebpackPlugin.options.title
    new HtmlWebpackPlugin({
      title: "browser-desktop",
      template: path.resolve(__dirname, "template.html"),
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
  ],
};

module.exports = merge(config, mergeConfig);
