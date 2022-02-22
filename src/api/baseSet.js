/*
 * @Author: wei.chen
 * @Date: 2021-08-31 13:14:44
 * @LastEditTime: 2021-10-21 14:55:32
 * @LastEditors: 刘帝君
 * @Description:基础设置
 */

import request from "./request";

let _tempUrl = "/admin/school/dict/item";
// 1  reg_clique  注册派别
// 2  study_goal  学习目的
// 3  resource_type  资源类型
// 4  student_position  学员身份
// 5  consulting_course  咨询课程
// 6  communication  沟通方式
// 7  pay_type  支付方式

// ========================注册派别=reg_clique========================
// 列表查询注册派别
export function getRegCliqueListAPI(data) {
  return request({
    url: _tempUrl + "/list",
    method: "get",
    data: { ...data, type: "reg_clique" }
  });
}
// 添加注册派别
export function addRegCliqueAPI(data) {
  return request({
    url: _tempUrl,
    method: "post",
    data: { ...data, type: "reg_clique" }
  });
}
// 编辑注册派别
export function editRegCliqueAPI(data) {
  return request({
    url: _tempUrl,
    method: "put",
    data: { ...data, type: "reg_clique" }
  });
}
// ============================ 学习目的=study_goal========================
// 列表查询注册派别
export function getStudyGoalListAPI(data) {
  return request({
    url: _tempUrl + "/list",
    method: "get",
    data: { ...data, type: "study_goal" }
  });
}
// 添加注册派别
export function addStudyGoalAPI(data) {
  return request({
    url: _tempUrl,
    method: "post",
    data: { ...data, type: "study_goal" }
  });
}
// 编辑注册派别
export function editStudyGoalAPI(data) {
  return request({
    url: _tempUrl,
    method: "put",
    data: { ...data, type: "study_goal" }
  });
}
// ============================ 资源类型 =resource_type========================
// 列表查询注册派别
export function getResrouceTypeListAPI(data) {
  return request({
    url: _tempUrl + "/list",
    method: "get",
    data: { ...data, type: "resource_type" }
  });
}
// 添加注册派别
export function addResrouceTypeAPI(data) {
  return request({
    url: _tempUrl,
    method: "post",
    data: { ...data, type: "resource_type" }
  });
}
// 编辑注册派别
export function editResrouceTypeAPI(data) {
  return request({
    url: _tempUrl,
    method: "put",
    data: { ...data, type: "resource_type" }
  });
}
// ============================ 学员身份 =student_position========================
// 列表查询注册派别
export function getStudentPositionListAPI(data) {
  return request({
    url: _tempUrl + "/list",
    method: "get",
    data: { ...data, type: "student_position" }
  });
}
// 添加注册派别
export function addStudentPositionAPI(data) {
  return request({
    url: _tempUrl,
    method: "post",
    data: { ...data, type: "student_position" }
  });
}
// 编辑注册派别
export function editStudentPositionAPI(data) {
  return request({
    url: _tempUrl,
    method: "put",
    data: { ...data, type: "student_position" }
  });
}
// ============================ 咨询课程 =consulting_course========================
// 列表查询 咨询课程
export function getConsultingCourseListAPI(data) {
  return request({
    url: _tempUrl + "/list",
    method: "get",
    data: { ...data, type: "consulting_course" }
  });
}
// 添加 咨询课程
export function addConsultingCourseAPI(data) {
  return request({
    url: _tempUrl,
    method: "post",
    data: { ...data, type: "consulting_course" }
  });
}
// 编辑 咨询课程
export function editConsultingCourseAPI(data) {
  return request({
    url: _tempUrl,
    method: "put",
    data: { ...data, type: "consulting_course" }
  });
}
// ============================ 沟通方式 =communication========================
// 列表查询 沟通方式
export function getCommunicationListAPI(data) {
  return request({
    url: _tempUrl + "/list",
    method: "get",
    data: { ...data, type: "communication" }
  });
}
// 添加 沟通方式
export function addCommunicationAPI(data) {
  return request({
    url: _tempUrl,
    method: "post",
    data: { ...data, type: "communication" }
  });
}
// 编辑 沟通方式
export function editCommunicationAPI(data) {
  return request({
    url: _tempUrl,
    method: "put",
    data: { ...data, type: "communication" }
  });
}
// ============================ 支付方式 =pay_type========================
// 列表查询 支付方式
export function getPayTypeListAPI(data) {
  return request({
    url: _tempUrl + "/list",
    method: "get",
    data: { ...data, type: "pay_type" }
  });
}
// 添加 支付方式
export function addPayTypeAPI(data) {
  return request({
    url: _tempUrl,
    method: "post",
    data: { ...data, type: "pay_type" }
  });
}
// 编辑 支付方式
export function editPayTypeAPI(data) {
  return request({
    url: _tempUrl,
    method: "put",
    data: { ...data, type: "pay_type" }
  });
}

// 删除注册派别
export function deleteItemAPI(data) {
  return request({
    url: _tempUrl,
    method: "delete",
    data
  });
}
// 编辑状态注册派别
export function changeStateItemAPI(data) {
  return request({
    url: _tempUrl + "/status",
    method: "put",
    data
  });
}

// ============================ 课程派别 =========================
// 列表查询 课程派别
export function semesterFactionListAPI(data) {
  return request({
    url: "/admin/school/semester/category/list",
    method: "get",
    data
  });
}

// 学期课程派别下拉
export function semesterFactionListAPIs(data) {
  return request({
    url: "/admin/school/semester/category/list/dropdown",
    method: "get",
    data
  });
}

// 修改状态 课程派别
export function semesterFactionEnable(data) {
  return request({
    url: "/admin/school/semester/category/enable",
    method: "put",
    data
  });
}

// 新增课程派别
export function semesterFactionAdd(data) {
  return request({
    url: "/admin/school/semester/category",
    method: "post",
    data
  });
}

// 编辑课程派别
export function semesterFactionEditor(data) {
  return request({
    url: "/admin/school/semester/category",
    method: "put",
    data
  });
}

// 详情课程派别
export function semesterFactionDetails(data) {
  return request({
    url: "/admin/school/semester/category/detail",
    method: "get",
    data
  });
}

// 删除课程派别
export function semesterFactionDelete(data) {
  return request({
    url: "/admin/school/semester/category",
    method: "delete",
    data
  });
}
