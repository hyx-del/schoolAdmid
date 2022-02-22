/*
 * @Author: aa
 * @Date: 2021-08-30 13:16:13
 * @LastEditors: wei.chen
 * @LastEditTime: 2021-10-22 14:17:40
 * @Descripttion:
 */

import request from "./request";
import {mixinMenu} from "@/api/menuTop";

// 学校列表
export function schoolList(data) {
  return request({
    url: "/admin/school/school/list",
    method: "get",
    data
  });
}
// 新增学校
export function addschool(data) {
  return request({
    url: "/admin/school/school",
    method: "post",
    data
  });
}
// 修改学校
export function editschool(data) {
  return request({
    url: "/admin/school/school",
    method: "put",
    data
  });
}
//通过主键查询单条数据
export function schooldetail(data) {
  return request({
    url: "/admin/school/school/detail",
    method: "get",
    data
  });
}
// 修改状态
export function changestatus(data) {
  return request({
    url: "/admin/school/school/status",
    method: "put",
    data
  });
}
// ====================================学期模板管理========================================

// 获取列表
export function templateList(data) {
  return request({
    url: "/admin/school/semester/template/list",
    method: "get",
    data
  });
}
// 获取列表 从学校
export function templateListSchool(data) {
  return request({
    url: "/admin/school/semester/template/list",
    method: "get",
    data:mixinMenu(data)
  });
}
// 新增模板
export function addtemplate(data) {
  return request({
    url: "/admin/school/semester/template",
    method: "post",
    data
  });
}
//通过主键查询单条数据
export function templatedetail(data) {
  return request({
    url: "/admin/school/semester/template/detail",
    method: "get",
    data
  });
}
// 修改模板
export function edittemplate(data) {
  return request({
    url: "/admin/school/semester/template",
    method: "put",
    data
  });
}
// 修改模板
export function deltemplate(data) {
  return request({
    url: `/admin/school/semester/template?id=${data.id}`,
    method: "delete",
    data
  });
}
// 学期报名导出
export function registrationExport(data) {
  return request({
    url: `/admin/school/registration/export`,
    method: "get",
    data
  });
}
