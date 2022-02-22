/*
 * @Author: 郑晶
 * @Date: 2021-09-01 14:05:23
 * @LastEditors: 刘帝君
 * @LastEditTime: 2021-11-23 10:44:30
 * @Descripttion:
 */
import request from "./request";
import { mixinMenu } from "@/api/menuTop";

// ====================================课程管理========================================
// 课程列表
export function courseList(data) {
  return request({
    url: "/admin/school/course/list",
    method: "get",
    data
  });
}
// 课程列表---带上学校和班级
export function courseListClass(data) {
  return request({
    url: "/admin/school/course/list",
    method: "get",
    data: mixinMenu(data)
  });
}

// 下拉框查询
export const courseBoxlist = data => {
  return request({
    url: `/admin/school/course/boxlist`,
    method: "GET",
    data: mixinMenu(data)
  });
};

// 修改课程状态
export function updateCourseStatus(data) {
  return request({
    url: "/admin/school/course/status",
    method: "put",
    data
  });
}
// 删除课程
export function deleteCourse(data) {
  return request({
    url: "/admin/school/course",
    method: "delete",
    data
  });
}
// 添加课程
export function addCourse(data) {
  return request({
    url: "/admin/school/course",
    method: "post",
    data
  });
}
// 课程详情
export function courseDetail(data) {
  return request({
    url: "/admin/school/course/detail",
    method: "get",
    data
  });
}
// 修改课程
export function updateCourseDetail(data) {
  return request({
    url: "/admin/school/course",
    method: "put",
    data
  });
}

// ====================================学员管理========================================

// 学员列表
export function studentList(data) {
  return request({
    url: "/admin/school/student/list",
    method: "get",
    data: mixinMenu(data)
  });
}

// 添加学员
export function addStudent(data) {
  return request({
    url: "/admin/school/student",
    method: "POST",
    data: mixinMenu(data)
  });
}
// 学员详情
export function studentDetail(data) {
  return request({
    url: "/admin/school/student/detail",
    method: "get",
    data
  });
}
// 学员编辑保存
export function studentEdit(data) {
  return request({
    url: "/admin/school/student",
    method: "put",
    data
  });
}

// 来源渠道（外包）
export function getSourceList() {
  return request({
    // url: "hall/member/internal/source/list",
    url: "/hall/member/index/source/list",
    method: "POST",
    hasToken: false,
    data: {
      action: "query",
      fields: ["id", "name"],
      orderBy: "default_source asc",
      params: []
    },
    type: "other"
  });
}

// 查询摸个宿舍下面的所有学员
export function getStudentListBybydormidAPI(data) {
  return request({
    url: "/admin/school/student/listbydormid",
    method: "get",
    data
  });
}
// 根据学校id 查询没有分寝室的学员
export function getStudentListNoDormBySchoolIdAPI(data) {
  return request({
    url: "/admin/school/student/listdivideddormstudent",
    method: "get",
    data
  });
}

// 学员销售修改记录列表
export function salesModificationList(data) {
  return request({
    url: "/admin/school/student/salesman/change/list",
    method: "get",
    data
  });
}

// 学员跟进记录列表
export function studentFollowUpList(data) {
  return request({
    url: "/admin/school/student/follow/list",
    method: "get",
    data
  });
}
// 学员跟进记录添加
export function addStudentFollow(data) {
  return request({
    url: "/admin/school/student/follow",
    method: "POST",
    data
  });
}

// 学员线索记录列表
export function studentClueList(data) {
  return request({
    url: "/admin/school/student/introduce/list",
    method: "get",
    data
  });
}

//  顶部获取 当前用户所有关联的学校
export function getTopHeaderSchoolList(data) {
  return request({
    url: "/admin/school/school/list/select",
    method: "get",
    data
  });
}
// 学员储值明细记录
export function getBalanceLogList(data) {
  return request({
    url: "/admin/school/student/balance/log/list",
    method: "get",
    data
  });
}
// 储值余额调整
export function updateStudentBalance(data) {
  return request({
    url: "/admin/school/student/balance",
    method: "put",
    data
  });
}
// 储值余额转出
export function studentBalanceTransfer(data) {
  return request({
    url: "/admin/school/student/balance/transfer",
    method: "post",
    data
  });
}
// 学员管理报名记录
export function registrationRecord(data) {
  return request({
    url: "/admin/school/registration/list-registration-record",
    method: "get",
    data
  });
}
// 总部跟进资源池
export function allStudentPoolList(data) {
  return request({
    url: "/admin/school/student/pool/list",
    method: "get",
    data
  });
}
// 毕业
export function studentGraduation(data) {
  return request({
    url: "/admin/school/student/graduation",
    method: "put",
    data: mixinMenu(data)
  });
}
