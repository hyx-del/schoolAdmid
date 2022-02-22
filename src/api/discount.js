/*
 * @Author: 刘帝君
 * @Date: 2021-10-09 14:03:32
 * @LastEditors: 刘帝君
 * @LastEditTime: 2021-10-12 17:00:03
 * @Descripttion:优惠管理
 */
import request from "./request";

// 优惠券列表
export function couponManagementList(data) {
  return request({
    url: "/admin/school/discount/cash/list",
    method: "get",
    data
  });
}

// 优惠券新增
export function couponManagementAdd(data) {
  return request({
    url: "/admin/school/discount/cash",
    method: "POST",
    data
  });
}

// 优惠券编辑
export function couponManagementUpdata(data) {
  return request({
    url: "/admin/school/discount/cash",
    method: "PUT",
    data
  });
}

// 优惠券修改状态
export function couponManagementEnable(data) {
  return request({
    url: "/admin/school/discount/cash/enable",
    method: "put",
    data
  });
}

// 优惠券删除
export function couponManagementDelete(data) {
  return request({
    url: "/admin/school/discount/cash",
    method: "delete",
    data
  });
}

// 优惠券查询单条
export function couponManagementSingle(data) {
  return request({
    url: "/admin/school/discount/cash/detail",
    method: "get",
    data
  });
}

// =================== 折扣 ===================

// 折扣列表
export function discountManagementList(data) {
  return request({
    url: "/admin/school/discount/percent/list",
    method: "get",
    data
  });
}

// 折扣新增
export function discountManagementAdd(data) {
  return request({
    url: "/admin/school/discount/percent/add",
    method: "POST",
    data
  });
}

// 折扣编辑
export function discountManagementUpdata(data) {
  return request({
    url: "/admin/school/discount/percent/edit",
    method: "post",
    data
  });
}

// 折扣修改状态
export function discountManagementEnable(data) {
  return request({
    url: "/admin/school/discount/percent/enabled",
    method: "post",
    data
  });
}

// 折扣删除
export function discountManagementDelete(data) {
  return request({
    url: `/admin/school/discount/percent/delete?id=${data}`,
    method: "DELETE"
  });
}

// 折扣查询单条
export function discountManagementSingle(data) {
  return request({
    url: "/admin/school/discount/percent/info",
    method: "get",
    data
  });
}

// 根据派别获取全面课程
export const courseGetMainCourseByCategoryId = data => {
  return request({
    url: `/admin/school/main/course/getMainCourseByCategoryId`,
    method: "GET",
    data
  });
};
