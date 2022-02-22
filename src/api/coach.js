/*
 * @Author: wei.chen
 * @Date: 2021-09-02 15:04:47
 * @LastEditTime: 2021-10-15 18:02:22
 * @LastEditors: zx
 * @Description:教练模块
 */

import request from "./request";

// 创建  教练等级===========
// export function addCoachLevel(data) {
// 	return request({
// 		url: '/admin/coach-level/add',
// 		method: 'POST',
// 		data,
// 	});
// }
// 获取分类列表
export function getCoachLevelListAPI(data) {
  return request({
    url: `/admin/school/coach/list`,
    method: "get",
    data
  });
}

// 获取单个
export function getCoachDetailAPI(data) {
  return request({
    url: `/admin/school/coach/detail`,
    method: "GET",
    data
  });
}

// 删除
// export function delCoachLevel(data) {
// 	return request({
// 		url: `/admin/coach-level/delete/${data.id}`,
// 		method: 'delete',
// 		data,
// 	});
// }
// 编辑
// export function editCoachLevel(data) {
// 	return request({
// 		url: `/admin/coach-level/update/${data.id}`,
// 		method: 'put',
// 		data,
// 	});
// }
//  ==========教练等级end =============

// 获取单个
export function getCoach(data) {
  return request({
    url: `/admin/coaches/${data.id}`,
    method: "GET"
  });
}

// 教练下拉框查询
export const coachBoxlist = data => {
  return request({
    url: `/admin/school/coach/boxlist`,
    method: "GET",
    data
  });
};

// 通过主键查询单条数据
export const coachDetail = data => {
  return request({
    url: `/admin/school/coach/detail`,
    method: "GET",
    data
  });
};

// 分页查询
export const coachList = data => {
  return request({
    url: `/admin/school/coach/list`,
    method: "GET",
    data
  });
};
