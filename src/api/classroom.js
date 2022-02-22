/*
 * @Author: wei.chen
 * @Date: 2021-10-18 09:23:40
 * @LastEditors: wei.chen
 * @LastEditTime: 2021-10-20 14:11:57
 * @Descripttion: 
 */
/*
* 包含接口：批量删除数据(classroomBatchDelete),分页查询(classroomBoxlist),删除数据(classroomDeleteDelete),通过主键查询单条数据(classroomDetail),分页查询(classroomList),新增数据(classroomSavePost),修改状态(classroomStatusPut),修改数据(classroomUpdatePut),
*/
import request from '@/api/request';
import {mixinMenu} from "@/api/menuTop";
// 批量删除数据
export const classroomBatchDelete= data => {
  return request({
    url: `/admin/school/classroom/batch`,
    method: 'DELETE',
    data:mixinMenu(data),
  });
}

// 分页查询
export const classroomBoxlist= data => {
  return request({
    url: `/admin/school/classroom/boxlist`,
    method: 'GET',
    data:mixinMenu(data),
  });
}

// 删除数据
export const classroomDeleteDelete= data => {
  return request({
    url: `/admin/school/classroom`,
    method: 'DELETE',
    data:mixinMenu(data),
  });
}

// 通过主键查询单条数据
export const classroomDetail= data => {
  return request({
    url: `/admin/school/classroom/detail`,
    method: 'GET',
    data:mixinMenu(data),
  });
}

// 分页查询
export const classroomList= data => {
  return request({
    url: `/admin/school/classroom/list`,
    method: 'GET',
    data:mixinMenu(data),
  });
}

// 新增数据
export const classroomSavePost= data => {
  return request({
    url: `/admin/school/classroom`,
    method: 'POST',
    data:mixinMenu(data),
  });
}

// 修改状态
export const classroomStatusPut= data => {
  return request({
    url: `/admin/school/classroom/status`,
    method: 'PUT',
    data:mixinMenu(data),
  });
}

// 修改数据
export const classroomUpdatePut= data => {
  return request({
    url: `/admin/school/classroom`,
    method: 'PUT',
    data:mixinMenu(data),
  });
}
