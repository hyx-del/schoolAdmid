// 学期报名
// Student Semester Controller
/*
 * 包含接口：新增报名数据(schoolRegistrationPost),取消报名(registrationCancelDelete),报到(registrationCheckinPost),调整费用(costAdjustPut),延期报名(registrationDelayPost),通过主键查询单条数据(registrationDetail),分页查询(registrationList),更变销售(registrationSalemanPut),转学(registrationTransferPut),
 */
import request from "@/api/request";
import { mixinMenu } from "@/api/menuTop";

// 新增报名数据
export const schoolRegistrationPost = data => {
  return request({
    url: `/admin/school/registration`,
    method: "POST",
    data
  });
};

// 取消报名
export const registrationCancelDelete = data => {
  return request({
    url: `/admin/school/registration/cancel`,
    method: "DELETE",
    data
  });
};

// 报到
export const registrationCheckinPost = data => {
  return request({
    url: `/admin/school/registration/checkin`,
    method: "POST",
    data
  });
};

// 调整费用
export const costAdjustPut = data => {
  return request({
    url: `/admin/school/registration/cost/adjust`,
    method: "PUT",
    data
  });
};

// 延期报名
export const registrationDelayPost = data => {
  return request({
    url: `/admin/school/registration/delay`,
    method: "POST",
    data
  });
};

// 通过主键查询单条数据
export const registrationDetail = data => {
  return request({
    url: `/admin/school/registration/detail`,
    method: "GET",
    data
  });
};

// 分页查询学期
export const registrationList = data => {
  return request({
    url: `/admin/school/registration/list`,
    method: "GET",
    data: mixinMenu(data)
  });
};
// 分页查询 带学校id
export const registrationListSchool = data => {
  return request({
    url: `/admin/school/registration/list`,
    method: "GET",
    data: mixinMenu(data)
  });
};
// 费用调整记录分页查询
export const getStudentAdjustListAPI = data => {
  return request({
    url: `/admin/school/registration/coats/adjust/list`,
    method: "GET",
    data
  });
};

// 付款记录分页查询
export const getStudentPaymentListAPI = data => {
  return request({
    url: `/admin/school/order/payment/list`,
    method: "GET",
    data
  });
};

// 付款记录分页查询
export const getOrderListAPI = data => {
  return request({
    url: `/admin/school/order/list`,
    method: "GET",
    data: mixinMenu(data)
  });
};

// 付款记录分页查询
export const ordinaryOrderDetailAPI = data => {
  return request({
    url: `/admin/school/order/detail`,
    method: "GET",
    data
  });
};

// 转学审批分页查询
export const getTransferSchoolListAPI = data => {
  return request({
    url: `/admin/school/transfer/school/list`,
    method: "GET",
    data: mixinMenu(data)
  });
};

// 销售修改记录分页查询
export const getSalesmanChangeListAPI = data => {
  return request({
    url: `/admin/school/student/semester/salesman/change/list`,
    method: "GET",
    data
  });
};

//转学记录查询
export const getTransferStudentListAPI = data => {
  return request({
    url: `/admin/school/transfer/school/studentList`,
    method: "GET",
    data: mixinMenu(data)
  });
};

// 更变销售
export const registrationSalemanPut = data => {
  return request({
    url: `/admin/school/registration/saleman`,
    method: "PUT",
    data
  });
};

// 转学
export const transferSchoolPut = data => {
  return request({
    url: `/admin/school/registration/transfer/school`,
    method: "PUT",
    data
  });
};
// 转套餐
export const transferMainCoursePut = data => {
  return request({
    url: `/admin/school/registration/transfer/mainCourse`,
    method: "PUT",
    data
  });
};

// 转学
export const registrationTransferPut = data => {
  return request({
    url: `/admin/school/registration/transfer`,
    method: "PUT",
    data
  });
};

// 修改报名信息
export const schoolRegistrationPut = data => {
  return request({
    url: `/admin/school/registration`,
    method: "PUT",
    data
  });
};

// 手机号查信息
export const findMobile = data => {
  return request({
    url: `/admin/school/student/find/mobile`,
    method: "GET",
    data
  });
};

// 学期下拉
export const semesterOptions = data => {
  return request({
    url: `/admin/school/semester/options`,
    method: "GET",
    data: mixinMenu(data)
  });
};

// 转储值
export const transferBalancePut = data => {
  return request({
    url: `/admin/school/registration/transfer/balance`,
    method: "PUT",
    data
  });
};
