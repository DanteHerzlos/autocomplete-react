//Core
const { merge } = require("webpack-merge")
const { DefinePlugin } = require("webpack")
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const Dotenv = require("dotenv-webpack")
const path = require("path")
require("dotenv").config()

//Modules
module.exports = () => {
  return merge(
    {
      entry: path.resolve("./src/index.ts"),
      output: {
        path: path.resolve("./dist"),
        filename: "js/bundle.[id].[contenthash].js",
        chunkFilename: "js/bundle.[id].[chunkhash].js",
        publicPath: "auto",
      },

      plugins: [
        new MiniCssExtractPlugin({
          filename: "css/bundle.[id].[contenthash].css",
          chunkFilename: "css/bundle.[id].[chunkhash].css",
        }),
        new Dotenv(),
        new DefinePlugin({
          NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        }),
        //! проверка типов при сборке
        // new ForkTsCheckerWebpackPlugin(),

        //! цепляет js файлы к .html
        new HtmlWebpackPlugin({ template: "./public/index.html" }),
      ],
      resolve: {
        //! загрузка alias из tsconfig.json
        plugins: [new TsconfigPathsPlugin()],
        extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
      },
      module: {
        rules: [
          //! TypeScript и JavaScript
          {
            test: /\.[jt]sx?$/,
            loader: "esbuild-loader",
            options: {
              loader: "tsx",
            },
            exclude: /node_modules/,
          },
          //! изображения
          {
            test: /\.(png|jpg|jpeg|svg)$/,
            type: "asset",
            generator: {
              filename: "images/[name].[hash].[ext]",
            },
          },
          //! загрузка шрифтов
          {
            test: /\.(woff|woff2|ttf)$/,
            type: "asset",
            generator: {
              filename: "fonts/[name].[ext]",
            },
          },
          //! загрузка стилей
          {
            test: /\.(css|s[ac]ss)$/i,
            use: [
              process.env.NODE_ENV === "production"
                ? MiniCssExtractPlugin.loader
                : "style-loader",
              {
                loader: "css-loader",
                options: {
                  modules: {
                    mode: "local",
                    localIdentName: process.env.NAME + "-[hash:base64:16]",
                  },
                },
              },
            ],
          },
        ],
      },
    },
  )
}
