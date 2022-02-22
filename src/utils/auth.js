/*
 * @Author: wei.chen
 * @Date: 2021-05-11 13:29:06
 * @LastEditors: zx
 * @LastEditTime: 2021-11-15 16:46:10
 * @Descripttion:   控制 API
 */

export function getToken() {
  return sessionStorage.getItem("school_Authorization");
}

export function setToken(token) {
  return sessionStorage.setItem("school_Authorization", token);
}

export function removeToken() {
  return sessionStorage.removeItem("school_Authorization");
}

// 获取外包token
export function getOtherToken() {
  return sessionStorage.getItem("OtherTokenKey") || "";
}
// 设置外包token

export function setOtherToken(token) {
  return sessionStorage.setItem("OtherTokenKey", token);
}
