/*
* 包含接口：通过主键查询单条数据(orderDetail),分页查询(orderList),付款(orderPaymentPost),退款(orderRefundPost),
*/
import request from '@/api/request';
import {mixinMenu} from "@/api/menuTop";
// 通过主键查询单条数据
export const orderDetail= data => {
  return request({
    url: `/admin/school/order/detail`,
    method: 'GET',
    data
  });
}

// 分页查询
export const orderList= data => {
  return request({
    url: `/admin/school/order/list`,
    method: 'GET',
    data
  });
}

// 付款
export const orderPaymentPost= data => {
  return request({
    url: `/admin/school/order/payment`,
    method: 'POST',
    data
  });
}

// 退款
export const orderRefundPost= data => {
  return request({
    url: `/admin/school/order/refund`,
    method: 'POST',
    data
  });
}
