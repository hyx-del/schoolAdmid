/*
 * @Author: wei.chen
 * @Date: 2020-06-11 11:46:00
 * @LastEditTime: 2021-06-30 15:59:45
 * @LastEditors: aa
 * @Description:系统用户管理
 */

import request from './request';

// 获取后台系统用户分页
export function getAdminAccountList(data) {
	return request({
		url: '/admin/account/list',
		method: 'get',
		data,
	});
}
// 获取系统用户不分页
export function getAllUser(data) {
	return request({
		url: '/adminApi/admins/all',
		method: 'get',
		data,
	});
}
// 创建系统用户 - ok
export function createOperator(data) {
	return request({
		url: '/admin/account/add',
		method: 'POST',
		data,
	});
}

// 编辑系统用户
export function editOperator(data) {
	return request({
		url: `/admin/account/edit`,
		method: 'post',
		data,
	});
}

// 删除系统用户
// export function delOperator(data) {
// 	return request({
// 		url: `/admin/admins/${data.id}`,
// 		method: 'delete',
// 		data,
// 	});
// }

// 禁用/启用系统用户
export function banOperator(data) {
	return request({
		url: `/admin/user/update/state`,
		method: 'post',
		data,
	});
}
// 禁用/启用系统用户(新)
export function accountChange(data) {
	return request({
		url: `/admin/account/state/change/${data.id}`,
		method: 'put',
		data,
	});
}

// 修改密码
export function changePassword(data) {
	return request({
		url: `/admin/account/updateCredentials`,
		method: 'post',
		data,
	});
}
// 获取角色列表
export function getRoleList(data) {
	return request({
		url: `/admin/account/role/list`,
		method: 'get',
		data,
	});
}
// 新增角色
export function addRole(data) {
	return request({
		url: `/admin/account/role/add`,
		method: 'post',
		data,
	});
}
// 编辑角色
export function editRole(data) {
	return request({
		url: `/admin/account/role/edit`,
		method: 'post',
		data,
	});
}
// 删除角色
export function deleteRole(data) {
	return request({
		url: `/admin/account/role/remove`,
		method: 'delete',
		data,
	});
}
// 获取角色下面的操作人
export function getRoleOperator(data) {
	return request({
		url: `/adminApi/role/${data.id}/operator`,
		method: 'get',
		data,
	});
}
// 获取某个角色的权限
export function getRolePermission(data) {
	return request({
		url: `/admin/account/role/info`,
		method: 'get',
		data,
	});
}
// 给某个角色设置权限
export function addRolePermission(data) {
	return request({
		url: `/admin/account/role/edit`,
		method: 'post',
		data,
	});
}
// 获取所有权限列表
export function getPermissionList(data) {
	return request({
		url: `/adminApi/role/permission`,
		method: 'get',
		data,
	});
}
// 获取所有版本列表
export function getVersionsList(data) {
	return request({
		url: `/admin/version/get/list`,
		method: 'get',
		data,
	});
}
// 新增版本
export function addVersions(data) {
	return request({
		url: `/admin/version/add`,
		method: 'post',
		data,
	});
}
// 编辑版本
export function editVersions(data) {
	return request({
		url: `/admin/version/${data.id}`,
		method: 'put',
		data,
	});
}
// 编辑版本
export function deleteVersions(data) {
	return request({
		url: `/admin/version/${data.id}`,
		method: 'delete',
		data,
	});
}
// 分销开关开始================begin=====================
export function getChecks(data) {
	return request({
		url: `/adminApi/checks`,
		method: 'get',
		data,
	});
}
export function postChecks(data) {
	return request({
		url: `/adminApi/checks`,
		method: 'post',
		data,
	});
}
export function putChecks(data) {
	return request({
		url: `/adminApi/checks/${data.id}`,
		method: 'put',
		data,
	});
}

export function deleteCheck(data) {
	return request({
		url: `/adminApi/checks/${data.id}`,
		method: 'delete',
		data,
	});
}

export function putChecksSwitch(data) {
	return request({
		url: `/adminApi/checks/${data.id}/openOrClose`,
		method: 'put',
		data,
	});
}

export function getLogList(data) {
	return request({
		url: `/adminApi/logs`,
		method: 'get',
		data,
	});
}

// 分销开关开始================end=======================

// 欢迎词================begin=====================
export function addWelcome(data) {
	return request({
		url: `/admin/welcome/add`,
		method: 'post',
		data,
	});
}
export function delWelcome(data) {
	return request({
		url: `/admin/welcome/delete/${data.id}`,
		method: 'delete',
		data,
	});
}

export function getWelcomeList(data) {
	return request({
		url: `/admin/welcome/get/list`,
		method: 'get',
		data,
	});
}

export function editWelcome(data) {
	return request({
		url: `/admin/welcome/update/${data.id}`,
		method: 'put',
		data,
	});
}

// 分销开关开始================end=======================
// 欢迎词================begin=====================
export function addSalesRoom(data) {
	return request({
		url: `/admin/salesroom/add`,
		method: 'post',
		data,
	});
}
export function delSalesRoom(data) {
	return request({
		url: `/admin/salesroom/${data.id}`,
		method: 'delete',
		data,
	});
}

export function getSalesRoomList(data) {
	return request({
		url: `/admin/salesroom/get/list`,
		method: 'get',
		data,
	});
}

///salesroom/get/city 获取城市列表
export function getSalesRoomCity(data) {
	return request({
		url: `/admin/salesroom/get/city`,
		method: 'get',
		data,
	});
}

export function getSalesRoomTree(data) {
	return request({
		url: `/admin/salesroom/get/tree`,
		method: 'DELETE',
		data,
	});
}

export function editSalesRoom(data) {
	return request({
		url: `/admin/salesroom/update/${data.id}`,
		method: 'put',
		data,
	});
}


export function salesroomState(data) {
	return request({
		url: `/admin/salesroom/state/change/${data.id}`,
		method: 'get',
		data,
	});
}

// 分销开关开始================end=======================

// 全部菜单
export function getMenuList(data) {
	return request({
		url: `/admin/account/menu/listTree`,
		method: 'get',
		data,
	});
}
// 角色详情
export function roleInfo(data) {
	return request({
		url: `/admin/account/role/info`,
		method: 'get',
		data,
	});
}
