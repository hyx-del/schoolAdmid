/*
 * @Author: admin
 * @Date: 2021-08-19 17:49:17
 * @LastEditors: zx
 * @LastEditTime: 2021-11-16 13:16:57
 * @Descripttion: vue 打包等配置文件
 */
// console.log(process.env.VUE_APP_title)
const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  lintOnSave: false, // 取消 eslint 验证
  devServer: {
    port: 9010, // 端口
    proxy: {
      "/admin": {
        // 以/ajax开头的请求
        // target: "http://api.dev.jiayu.gold", //  dev环境
        target: "http://api.test.jiayu.gold", //  test环境
        // target: "http://192.168.110.172:8080", //吴伟
        // target: "http://192.168.110.48:8080", //刘中超
        // target: "http://192.168.110.21:8080", //谢毅伦
        // target: "http://192.168.110.17:8080/", //代金池
        // target: 'http://192.168.110.112:8080/', // 蔡壮
        changeOrigin: true
      }
    }
  },
  configureWebpack: {
    name: "name",
    externals: {
      wangeditor: "wangeditor"
    },
    resolve: {
      alias: {
        "@": resolve("src")
      }
    }
  }
};
