// 为webstorm 提供 jest 别名
const resolve = dir => require('path').join(__dirname, dir)

module.exports = {
  resolve: {
    alias: {
      '@': resolve('./lib'),
    }
  }
}
