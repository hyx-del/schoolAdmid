/*
 * @Author: aa
 * @Date: 2021-08-20 09:41:42
 * @LastEditors: aa
 * @LastEditTime: 2021-08-26 10:35:43
 * @Descripttion:
 */

import { isRef, isReactive } from "vue";

// d
export const log = obj => {
  if (isReactive(obj)) {
    console.log(JSON.parse(JSON.stringify(obj)));
  } else if (isRef(obj)) {
    console.log(obj.value);
  } else {
    console.log(obj);
  }
};
// 检测数组子集
export const array = (arr1, arr2) => {
  if (!(arr1 instanceof Array) || !(arr2 instanceof Array)) {
    return false;
  }
  let flag = false;
  let result = arr1.map(item => {
    return arr2.includes(item);
  });
  flag = result.some(item => item);
  return flag;
};
