const { merge } = require("webpack-merge")
const getCommonConfig = require("./webpack.common")
const PORT = process.env.PORT

module.exports = () => {
  return merge(getCommonConfig(), {
    mode: "development",
    devtool: "eval-cheap-source-map",
    devServer: {
      host: "localhost",
      port: PORT,
      historyApiFallback: true,
      allowedHosts: "all",
    },
  })
}
