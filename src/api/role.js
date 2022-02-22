/*
 * 包含接口：新增权限(permissionAddPost),编辑权限(permissionEditPost),查询权限列表(permissionList),查询权限树(permissionListTree),删除权限(permissionRemoveDelete),新增角色(roleAddPost),角色删除(roleDeleteDelete),编辑角色(roleEditPost),角色列表(roleList),角色详情(roleRoleInfo),查询角色权限树(roleRoleListTree),
 */
import request from "@/api/request";
import { mixinMenu } from "@/api/menuTop";
// 新增权限
export const permissionAddPost = data => {
  return request({
    url: `/admin/school/staff/permission/add`,
    method: "POST",
    data: mixinMenu(data, true)
  });
};

// 编辑权限
export const permissionEditPost = data => {
  return request({
    url: `/admin/school/staff/permission/edit`,
    method: "POST",
    data: mixinMenu(data, true)
  });
};

// 查询权限列表
export const permissionList = data => {
  return request({
    url: `/admin/school/staff/permission/list`,
    method: "GET",
    data: mixinMenu(data, true)
  });
};

// 查询权限树 这个接口不能传type
export const permissionListTree = data => {
  return request({
    url: `/admin/school/staff/permission/listTree`,
    method: "GET",
    data: mixinMenu(data)
  });
};

// 删除权限
export const permissionRemoveDelete = data => {
  return request({
    url: `/admin/school/staff/permission/remove`,
    method: "DELETE",
    data: mixinMenu(data, true)
  });
};

// 新增角色
export const roleAddPost = data => {
  return request({
    url: `/admin/school/staff/role/add`,
    method: "POST",
    data: mixinMenu(data, true)
  });
};

// 角色删除
export const roleDeleteDelete = data => {
  return request({
    url: `/admin/school/staff/role/delete`,
    method: "DELETE",
    data
  });
};

// 编辑角色
export const roleEditPost = data => {
  return request({
    url: `/admin/school/staff/role/edit`,
    method: "POST",
    data: mixinMenu(data, true)
  });
};

// 角色列表
export const roleList = data => {
  return request({
    url: `/admin/school/staff/role/list`,
    method: "GET",
    data: mixinMenu(data, true)
  });
};

// 角色详情
export const roleRoleInfo = data => {
  return request({
    url: `/admin/school/staff/role/roleInfo`,
    method: "GET",
    data: mixinMenu(data, true)
  });
};
// 多个角色详情
export const roleRoleInfos = data => {
  return request({
    url: `/admin/school/staff/role/rolesInfo`,
    method: "GET",
    data: mixinMenu(data, true)
  });
};

// 查询角色权限树
export const roleRoleListTree = data => {
  return request({
    url: `/admin/school/staff/role/roleListTree`,
    method: "GET",
    data: mixinMenu(data, true)
  });
};

// 角色详情列表
export const roleRolesInfo = data => {
  return request({
    url: `/admin/school/staff/role/rolesInfo`,
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

// 手机号查询
export const userinfoByMobile = data => {
  return request({
    url: `/admin/school/student/find/mobile`,
    method: "get",
    data
  });
};

// 重置密码
export const staffResetPasswordPost = data => {
  return request({
    url: `/admin/school/staff/resetPassword`,
    method: "POST",
    data
  });
};
