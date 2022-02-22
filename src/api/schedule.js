/*
 * @Author: wei.chen
 * @Date: 2021-10-14 21:04:24
 * @LastEditors: wei.chen
 * @LastEditTime: 2021-10-21 20:56:36
 * @Descripttion:
 */
/*
* 包含接口：修改数据(schoolCourseplanPut),删除数据(courseplanDeleteDelete),通过主键查询单条数据(courseplanDetail),普通列表分页查询(courseplanList),单个课程审核 单个审核可能有修改(courseplanReviewPut),批量审核课程(courseplanReviewbatchPut),新增数据(courseplanSavePost),日期表单模式(courseplanTable),
*/
import request from '@/api/request';
import {mixinMenu} from "@/api/menuTop";
// 修改数据
export const schoolCourseplanPut= data => {
  return request({
    url: `/admin/school/course-plan`,
    method: 'PUT',
    data:mixinMenu(data),
  });
}

// 删除数据
export const courseplanDeleteDelete= data => {
  return request({
    url: `/admin/school/course-plan`,
    method: 'DELETE',
    data:mixinMenu(data),
  });
}
// 取消课程
export const coursePlanCancelPut= data => {
  return request({
    url: `/admin/school/course-plan/cancel`,
    method: 'PUT',
    data
  });
}


// 通过主键查询单条数据
export const courseplanDetail= data => {
  return request({
    url: `/admin/school/course-plan/detail`,
    method: 'GET',
    data:mixinMenu(data),
  });
}

// 普通列表分页查询
export const courseplanList= data => {
  return request({
    url: `/admin/school/course-plan/list`,
    method: 'GET',
    data:mixinMenu(data),
  });
}

// 单个课程审核 单个审核可能有修改
export const courseplanReviewPut= data => {
  return request({
    url: `/admin/school/course-plan/review`,
    method: 'PUT',
    data:mixinMenu(data),
  });
}

// 批量审核课程
export const courseplanReviewbatchPut= data => {
  return request({
    url: `/admin/school/course-plan/review-batch`,
    method: 'PUT',
    data:mixinMenu(data),
  });
}

// 新增数据
export const courseplanSavePost= data => {
  return request({
    url: `/admin/school/course-plan`,
    method: 'POST',
    data:mixinMenu(data),
  });
}

// 日期表单模式
export const courseplanTable= data => {
  return request({
    url: `/admin/school/course-plan/table`,
    method: 'GET',
    data:mixinMenu(data),
  });
}
