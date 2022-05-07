const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const devConfig = require("./config/webpack.dev");
const prodConfig = require("./config/webpack.prod");
const InlineSourceHtmlPlugin = require("./config/InlineSourceHtmlPlugin.js");
const { merge } = require("webpack-merge");
const varConfig = require('../var/static.config.json');
const fs = require('fs')

const CONFIG_PATH = path.resolve(__dirname, "../var/static.config.json")

const isDev = process.env.NODE_ENV === "development"

const mergeConfig = isDev ? devConfig : prodConfig;

function getStaticConfig() {
  const config = JSON.stringify(fs.readFileSync(CONFIG_PATH, 'utf8'))
  delete config.distDir
  return config
}

const config = {
  entry: "./src/index.tsx",
  output: {
    path: varConfig.distDir,
    filename: "index.js",
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
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"],
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|gif|jpeg)/,
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
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
    new HtmlWebpackPlugin({
      minify: {
        removeComments: !isDev,
        collapseWhitespace: !isDev,
        minifyJS: !isDev,
        minifyCSS: !isDev,
      },
      config: getStaticConfig(),
      title: "browser-desktop",
      template: path.resolve(__dirname, "template.html"),
      inject: 'body',
      inlineSource: '.(js|css)'
    }),
    new InlineSourceHtmlPlugin(HtmlWebpackPlugin, ["index.js", "main.css"]),
  ],
};

module.exports = merge(config, mergeConfig);
