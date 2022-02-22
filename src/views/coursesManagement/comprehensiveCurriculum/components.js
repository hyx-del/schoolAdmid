/*
 * @Author: 刘帝君
 * @Date: 2021-10-22 17:18:41
 * @LastEditors: 刘帝君
 * @LastEditTime: 2021-10-22 17:29:48
 * @Descripttion:
 */

//处理减法出现的浮点数
/**
 * arg1-arg2
 * @param {number} arg1
 * @param {number} arg2
 * @returns
 */
export function accSubtr(arg1, arg2) {
  var r1, r2, m, n;
  try {
    r1 = arg1.toString().split(".")[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split(".")[1].length;
  } catch (e) {
    r2 = 0;
  }
  m = Math.pow(10, Math.max(r1, r2));
  //动态控制精度长度
  n = r1 >= r2 ? r1 : r2;
  return ((arg1 * m - arg2 * m) / m).toFixed(n);
}
