/*
 * 包含接口：新增员工(staffAddStaffPost),绑定会员(staffBindingMemberPost),获取用户具有的班级信息(staffGetClass),获取用户权限信息(staffGetPermission),获取销售列表(staffGetSaleStaffList),获取用户具有的学校信息(staffGetSchool),登录员工基本信息(staffGetStaffBaseInfo),员工详情(staffGetStaffInfo),员工列表(staffGetStaffList),员工移除(staffRemoveStaffDelete),员工转正(staffStaffConversionPost),员工修改(staffUpdateStaffPost),
 */
import request from "@/api/request";
import { mixinMenu } from "@/api/menuTop";
// 新增员工
export const staffAddStaffPost = data => {
  return request({
    url: `/admin/school/staff/addStaff`,
    method: "POST",
    data: mixinMenu(data, true)
  });
};

// 绑定会员
export const staffBindingMemberPost = data => {
  return request({
    url: `/admin/school/staff/bindingMember`,
    method: "POST",
    data: mixinMenu(data, true)
  });
};

// 获取用户具有的班级信息
export const staffGetClass = data => {
  return request({
    url: `/admin/school/staff/getClass`,
    method: "GET",
    data: mixinMenu(data, true)
  });
};

// 获取用户权限信息
export const staffGetPermission = data => {
  return request({
    url: `/admin/school/staff/getPermission`,
    method: "GET",
    data: data
  });
};

// 获取销售列表
export const staffGetSaleStaffList = data => {
  return request({
    url: `/admin/school/staff/getSaleStaffList`,
    method: "GET",
    data: mixinMenu(data, true)
  });
};

// 获取用户具有的学校信息
export const staffGetSchool = data => {
  return request({
    url: `/admin/school/staff/getSchool`,
    method: "GET",
    data: mixinMenu(data, true)
  });
};

// 登录员工基本信息
export const staffGetStaffBaseInfo = data => {
  return request({
    url: `/admin/school/staff/getStaffBaseInfo`,
    method: "GET",
    data: mixinMenu(data, true)
  });
};

// 员工详情
export const staffGetStaffInfo = data => {
  return request({
    url: `/admin/school/staff/getStaffInfo`,
    method: "GET",
    data: mixinMenu(data, true)
  });
};

// 员工列表
export const staffGetStaffList = data => {
  return request({
    url: `/admin/school/staff/getStaffList`,
    method: "GET",
    data: mixinMenu(data, true)
  });
};
// 所有员工
export const staffAllStaffList = data => {
  return request({
    url: `/admin/school/staff/allStaffList`,
    method: "GET",
    data
  });
};

// 员工移除
export const staffRemoveStaffDelete = data => {
  return request({
    url: `/admin/school/staff/removeStaff`,
    method: "DELETE",
    data: mixinMenu(data, true)
  });
};
// 员工启用/禁用
export const staffEnabledStaffPost = data => {
  return request({
    url: `/admin/school/staff/enabledStaff`,
    method: "POST",
    data
  });
};

// 员工转正
export const staffStaffConversionPost = data => {
  return request({
    url: `/admin/school/staff/staffConversion`,
    method: "POST",
    data: mixinMenu(data, true)
  });
};

// 员工修改
export const staffUpdateStaffPost = data => {
  return request({
    url: `/admin/school/staff/updateStaff`,
    method: "POST",
    data: mixinMenu(data)
  });
};
// 根据手机号获取员工信息
export const staffFindMemberByMobile = data => {
  return request({
    url: `/admin/school/staff/findMemberByMobile`,
    method: "GET",
    data
  });
};
// 员工详情(根据手机号查找)//用于新增员工
export const staffGetStaffInfoByMobile = data => {
  return request({
    url: `/admin/school/staff/getStaffInfoByMobile`,
    method: "GET",
    data: mixinMenu(data, true)
  });
};
