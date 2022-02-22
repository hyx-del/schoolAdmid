/*
 * @Author: wei.chen
 * @Date: 2020-06-11 11:46:00
 * @LastEditTime: 2021-11-16 13:28:59
 * @LastEditors: zx
 * @Description:
 */

/**
 * @name:
 * @description: 是否是正常的互联网地址
 * @param {*} path
 * @return {*}
 */

export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path);
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ["admin", "editor"];
  return valid_map.indexOf(str.trim()) >= 0;
}

/**
 * @name:
 * @description: 手机号码校验
 * 进行严谨的规则匹配
 * /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/
 * 非强校验
 * @param {type}
 * @return:
 */
export function isPhone(val) {
  const phoneReg = /^[1]([3-9])[0-9]{9}$/;
  return phoneReg.test(val);
}

/**
 * @name:
 * @description: 判断是否为数字且最多两位小数
 * @param {*} str
 * @return {*}
 */

export function isNum(str) {
  const reg = /^\d+(\.\d{1,2})?$/;
  return reg.test(str);
}

// 验证正整数

/**
 * @name  isIP
 * @description 判断是否为IP
 * @param ip
 * @returns {boolean}
 */
export function isIP(ip) {
  const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
  return reg.test(ip);
}

/**
 * @name: 是否是正常的身份证号码
 * @description: 判断是否是身份证号(第二代)
 * @param {*} str
 * @return {*}
 */

export function isIdCard(str) {
  const reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
  return reg.test(str);
}

/**
 * @name: 邮箱判断
 * @description: 判断是否是邮箱
 * @param {*} str
 * @return {*}
 */

export function isEmail(str) {
  const reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  return reg.test(str);
}

/**
 * @name: 判断是否为空
 * @description: 判断是否为空
 * @param {*} str
 * @return {*}
 */
export function isBlank(str) {
  return (
    str == null ||
    false ||
    str === "" ||
    str.trim() === "" ||
    str.toLocaleLowerCase().trim() === "null"
  );
}
