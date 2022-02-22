/*
 * @Author: 刘帝君
 * @Date: 2021-10-08 15:08:54
 * @LastEditors: 郑晶
 * @LastEditTime: 2021-10-21 15:04:42
 * @Descripttion: 班级管理
 */
import request from "./request";
import store from "@/store";
import { mixinMenu } from "@/api/menuTop";

// 班级列表
export function classManagementList(data) {
  return request({
    url: "/admin/school/school/class/list",
    method: "get",
    data
  });
}

// 班级删除
export function deleteItemAPI(data) {
  return request({
    url: "/admin/school/school/class",
    method: "delete",
    data
  });
}

// 班级状态
export function changeStateItemAPI(data) {
  return request({
    url: "/admin/school/school/class/status",
    method: "put",
    data
  });
}

// 新增班级
export function addStudentPositionAPI(data) {
  return request({
    url: "/admin/school/school/class",
    method: "POST",
    data
  });
}

// 修改班级
export function studentPositionEdit(data) {
  return request({
    url: "/admin/school/school/class",
    method: "PUT",
    data
  });
}

//  顶部菜单的班级列表，根据学校id 查询班级

export function headerClassListBySchollId(data) {
  return request({
    url: "/admin/school/school/class/boxlist",
    method: "get",
    data
  });
}

// ================== 学员分班 ====================
// 分班详情
export function divisionDetails(data) {
  return request({
    url: "/admin/school/student/listbyschoolclassId",
    method: "get",
    data
  });
}

// 分班详情删除
export function divisionDelete(data) {
  return request({
    url: "/admin/school/school/class/divided-class",
    method: "DELETE",
    data
  });
}

// 分班添加查询
export function divisionAddList(data) {
  return request({
    url: "/admin/school/student/listdividedclassstudent",
    method: "get",
    data: mixinMenu(data)
  });
}

// 分班添加
export function divisionAdd(data) {
  return request({
    url: "/admin/school/school/class/divided-class",
    method: "post",
    data
  });
}

//教室管理模块=========================begin==============
export function saveClassRoomAPI(data) {
  return request({
    url: "/admin/school/classroom",
    method: "post",
    data
  });
}

export function getClassRoomListAPI(data) {
  return request({
    url: "/admin/school/classroom/list",
    method: "get",
    data
  });
}
export function delClassRoomAPI(data) {
  return request({
    url: "/admin/school/classroom",
    method: "delete",
    data
  });
}
export function editClassRoomStatusAPI(data) {
  return request({
    url: "/admin/school/classroom/status",
    method: "put",
    data
  });
}
// 编辑教室
export function editClassroom(data) {
  return request({
    url: "/admin/school/classroom",
    method: "put",
    data
  });
}

// ==========宿舍管理模块=================begin==============
export function saveDormAPI(data) {
  return request({
    url: "/admin/school/dorm",
    method: "post",
    data
  });
}

export function getDormListAPI(data) {
  return request({
    url: "/admin/school/dorm/list",
    method: "get",
    data
  });
}
export function delDormAPI(data) {
  return request({
    url: "/admin/school/dorm",
    method: "delete",
    data
  });
}
export function editDormStatusAPI(data) {
  return request({
    url: "/admin/school/dorm/status",
    method: "post",
    data
  });
}
// 学院分配宿舍
export function addStudentToDormAPI(data) {
  return request({
    url: "/admin/school/dorm/divided-dorm",
    method: "post",
    data
  });
}
//
// 学院分配宿舍
export function removeStudentFromDormAPI(data) {
  return request({
    url: "/admin/school/dorm/divided-dorm",
    method: "delete",
    data
  });
}

//
// 学院分配宿舍
export function getDormDetailById(data) {
  return request({
    url: "/admin/school/dorm/detail",
    method: "get",
    data
  });
}
// ==========宿舍管理模块=================end==============
// 修改宿舍
export function editSchoolDorm(data) {
  return request({
    url: "/admin/school/dorm",
    method: "put",
    data
  });
}
