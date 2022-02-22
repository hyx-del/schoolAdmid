/*
 * @Author: admin
 * @Date: 2021-08-26 15:26:36
 * @LastEditors: zx
 * @LastEditTime: 2021-11-16 13:30:23
 * @Descripttion:
 */
// 过滤路由
import dynamicRouters from "../router/router";
function getRouterList() {
  let _tempRouter = [];
  return dynamicRouters;
}
export default getRouterList;
