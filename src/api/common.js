/*
 * @Author: wei.chen
 * @Date: 2020-06-11 11:46:00
 * @LastEditTime: 2021-11-05 16:40:47
 * @LastEditors: zx
 * @Description:瑜伽模块
 */

import request from "./request";

// 获取阿里oss 上传token
export function getAliOSSToken(data) {
  return request({
    url: "/admin/school/open/file/oss/sts",
    method: "post",
    data
  });
}
// 当前用户 否有总部的权限和  对应哪些学校列表的权限

export function getPermissionOfSchoolQue(data) {
  return request({
    url: "/admin/school/staff/getSchool",
    method: "get",
    data
  });
}
// 获取外包token
export function getPhpAdminToken(data) {
  return request({
    url: "/admin/school/staff/getPhpAdminToken",
    method: "post",
    data
  });
}
