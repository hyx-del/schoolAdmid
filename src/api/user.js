/*
 * @Author: aa
 * @Date: 2021-08-23 10:31:43
 * @LastEditors: wei.chen
 * @LastEditTime: 2021-09-03 09:45:59
 * @Descripttion:
 */

import request from "./request";

// 登录
export function login(data) {
  return request({
    url: "/admin/sso/oauth/token",
    method: "POST",
    data,
    ContentType: "form"
  });
}

// 获取用户基本信息
export function getUserInfo(data) {
  return request({
    url: "/admin/oauth/token",
    method: "POST",
    data,
    ContentType: "form"
  });
}

// 获取用户菜单列表
export function getMenuInfo(data) {
  return request({
    url: "/admin/oauth/token",
    method: "POST",
    data,
    ContentType: "form"
  });
}
// 员工修改密码
export const staffUpdatePasswordPost= data => {
  return request({
    url: `/admin/school/staff/updatePassword`,
    method: 'POST',
    data
  });
}

