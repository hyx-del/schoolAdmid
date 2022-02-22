/*
 * @Author: wei.chen
 * @Date: 2020-06-11 11:46:00
 * @LastEditTime: 2021-10-19 17:21:49
 * @LastEditors: wei.chen
 * @Description:教练模块
 */

import request from "./request";
import { mixinMenu } from "@/api/menuTop";

// 新增数据
export const schoolSemesterPost = data => {
  return request({
    url: `/admin/school/semester`,
    method: "POST",
    data: mixinMenu(data)
  });
};

// 修改数据
export const schoolSemesterPut = data => {
  return request({
    url: `/admin/school/semester`,
    method: "PUT",
    data
  });
};
// 修改数据 已使用的套餐
export const semesterForUsedPut = data => {
  return request({
    url: `/admin/school/semester/for-used`,
    method: "PUT",
    data
  });
};

// 删除数据
export const schoolSemesterDelete = data => {
  return request({
    url: `/admin/school/semester`,
    method: "DELETE",
    data
  });
};

// 通过主键查询单条数据
export const semesterDetail = data => {
  return request({
    url: `/admin/school/semester/detail`,
    method: "GET",
    data
  });
};

// 分页查询
export const semesterList = data => {
  return request({
    url: `/admin/school/semester/list`,
    method: "GET",
    data
  });
};

// 带学校id 分页查询
export const semesterListBySchoolId = data => {
  return request({
    url: `/admin/school/semester/list`,
    method: "GET",
    data: mixinMenu(data)
  });
};

// 修改状态
export const semesterStatusPut = data => {
  return request({
    url: `/admin/school/semester/status`,
    method: "PUT",
    data
  });
};
