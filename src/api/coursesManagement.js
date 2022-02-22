/*
 * @Author: 刘帝君
 * @Date: 2021-10-09 15:37:06
 * @LastEditors: 刘帝君
 * @LastEditTime: 2021-11-02 11:12:40
 * @Descripttion: 全面课程
 */
import request from "./request";

// ==================== 全面课程 ====================
// 全面课程列表
export function comprehensiveCurriculumList(data) {
  return request({
    url: "/admin/school/main/course/list",
    method: "get",
    data
  });
}

// 全面课程改变状态
export function comprehensiveCurriculumStatus(data) {
  return request({
    url: "/admin/school/main/course/changeStatus",
    method: "post",
    data
  });
}

// 全面课程删除
export function comprehensiveCurriculumDelete(data) {
  return request({
    url: "/admin/school/main/course/delete",
    method: "delete",
    data
  });
}

// 全面课程新增
export function comprehensiveCurriculumAdd(data) {
  return request({
    url: "/admin/school/main/course/add",
    method: "post",
    data
  });
}

// 全面课程查询单条
export function comprehensiveCurriculumInfo(data) {
  return request({
    url: "/admin/school/main/course/info",
    method: "get",
    data
  });
}

// 全面课程编辑
export function comprehensiveCurriculumEdit(data) {
  return request({
    url: "/admin/school/main/course/edit",
    method: "post",
    data
  });
}

// ==================== 套餐订单 ====================

// 套餐订单列表
export function packageOrderList(data) {
  return request({
    url: "/admin/school/main/order/list",
    method: "get",
    data
  });
}

// 套餐订单详情
export function packageOrderDetails(data) {
  return request({
    url: "/admin/school/main/order/info",
    method: "get",
    data
  });
}

// ==================== 套餐报名 ====================

// 套餐报名列表
export function enrollLists(data) {
  return request({
    url: "/admin/school/student/main/course/list",
    method: "get",
    data
  });
}

// 套餐报名新增
export function enrollAdd(data) {
  return request({
    url: "/admin/school/student/main/course/register",
    method: "post",
    data
  });
}

// 套餐报名修改
export function refundModifythe(data) {
  return request({
    url: "/admin/school/student/main/course/update",
    method: "put",
    data
  });
}

// 套餐报名销售修改
export function modifyTheSales(data) {
  return request({
    url: "/admin/school/student/main/course/updateSalesmen",
    method: "put",
    data
  });
}

// 套餐报名取消报名
export function enrollCancel(data) {
  return request({
    url: "/admin/school/student/main/course/cancel",
    method: "post",
    data
  });
}

// 套餐报名激活
export function enrollActivation(data) {
  return request({
    url: "/admin/school/student/main/course/activate",
    method: "post",
    data
  });
}

// 套餐查看权益列表
export function signupInterests(data) {
  return request({
    url: "/admin/school/main/course/rights/list",
    method: "get",
    data
  });
}

// 套餐查看核销
export function cancelAfterVerification(data) {
  return request({
    url: "/admin/school/main/course/rights/chargeOff",
    method: "post",
    data
  });
}

// 套餐报名立即报名
export function cancelAfterRegister(data) {
  return request({
    url: "/admin/school/main/course/rights/register",
    method: "post",
    data
  });
}

// 套餐报名信息
export function toSignupInformation(data) {
  return request({
    url: "/admin/school/student/main/course/detail",
    method: "get",
    data
  });
}

// 套餐报名调整费用
export function adjustExpenses(data) {
  return request({
    url: "/admin/school/student/main/course/cost/adjust",
    method: "put",
    data
  });
}

// 套餐报名储值
export function storedValueApi(data) {
  return request({
    url: "/admin/school/student/main/course/transfer/balance",
    method: "put",
    data
  });
}

// 套餐报名付款
export function paymentApi(data) {
  return request({
    url: "/admin/school/main/order/payment",
    method: "post",
    data
  });
}

// 套餐报名退款
export function refundApi(data) {
  return request({
    url: "/admin/school/main/order/refund",
    method: "post",
    data
  });
}

// ====================== 费用调整记录 =======================

// 费用调整记录列表
export function adjustTheList(data) {
  return request({
    url: "/admin/school/main/course/coats/adjust/list",
    method: "get",
    data
  });
}

// ====================== 付款记录 =======================

// 付款记录列表
export function paymentList(data) {
  return request({
    url: "/admin/school/main/course/payment/list",
    method: "get",
    data
  });
}

// ====================== 销售记录 =======================

// 销售记录列表
export function salesRecordList(data) {
  return request({
    url: "/admin/school/main/course/register/staff/log/list",
    method: "get",
    data
  });
}

// ====================== 转套餐记录 =======================

// 销售记录列表
export function transferRecordList(data) {
  return request({
    url: "/admin/school/main/course/trans/list",
    method: "get",
    data
  });
}

// 全面课程补款项付款
export const orderPayPost = data => {
  return request({
    url: `/admin/school/main/order/pay`,
    method: "POST",
    data
  });
};
