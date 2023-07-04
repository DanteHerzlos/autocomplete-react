const { merge } = require("webpack-merge")
const { EsbuildPlugin } = require("esbuild-loader")
const getCommonConfig = require("./webpack.common")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer")
const CompressionPlugin = require("compression-webpack-plugin")

module.exports = () => {
  return merge(getCommonConfig(), {
    performance: {
      hints: false,
    },
    mode: "production",
    devtool: false,
    optimization: {
      nodeEnv: "production",
      minimize: true,
      // сжимают сss и js файлы
      minimizer: [new EsbuildPlugin({ css: true })],
      splitChunks: {
        // максимальный размер чанков
        maxSize: 250000,
      },
    },
    plugins: [
      //! добавляет сжатые версии билд файлов
      new CompressionPlugin(),

      //! удаляет все из директории указанная в output.path
      new CleanWebpackPlugin(),

      //! создает stat.json с анализом build сборки
      //! запуск npm run bundle-report
      // new BundleAnalyzerPlugin({
      //   analyzerMode: "disabled",
      //   openAnalyzer: false,
      //   generateStatsFile: true,
      // }),
    ],
  })
}
