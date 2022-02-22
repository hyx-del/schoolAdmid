/*
 * @Author: wei.chen
 * @Date: 2021-10-29 15:10:40
 * @LastEditors: 郑晶
 * @LastEditTime: 2021-11-12 13:43:34
 * @Descripttion: 按钮权限操作相关方法
 */

import store from "@/store";

/**
 * @name: isShowButtom
 * @description: 传递buttonCode 来判断当前用户是否有这个权限
 * @param {*} 按钮的编号
 * @return {*}  boolean
 */
export const isShowButtom = buttonCode => {
  // return true;
  if (!buttonCode) {
    return false;
  }
  if (
    store.getters.permButtonList.a.includes(buttonCode) ||
    store.getters.permButtonList.s.includes(buttonCode) ||
    store.getters.permButtonList.c.includes(buttonCode)
  ) {
    return true;
  } else {
    return false;
  }
};
