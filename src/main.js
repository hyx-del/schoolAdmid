/*
 * @Author: admin
 * @Date: 2021-08-19 17:40:16
 * @LastEditors: zx
 * @LastEditTime: 2021-11-16 13:18:33
 * @Descripttion:
 */
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementPlus from "element-plus";
import "element-plus/lib/theme-chalk/index.css";
import locale from "element-plus/lib/locale/lang/zh-cn";
import "./styles/index.scss";
// import "@/permission";

createApp(App)
  .use(store)
  .use(router)
  .use(ElementPlus, { locale })
  .mount("#app");
