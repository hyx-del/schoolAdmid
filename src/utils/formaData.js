/*
 * @Author: aa
 * @Date: 2021-08-20 09:41:42
 * @LastEditors: zx
 * @LastEditTime: 2021-11-16 17:19:29
 * @Descripttion:
 */

/**
 * 格式化
 * @param { Date } day
 * @param { String } fmt
 * @returns { String } time
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null;
  }
  const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
  let date;
  if (typeof time === "object") {
    date = time;
  } else {
    if (typeof time === "string") {
      if (/^[0-9]+$/.test(time)) {
        // support "1548221490638"
        time = parseInt(time);
      } else {
        time = time.replace(new RegExp(/-/gm), "/");
      }
    }

    if (typeof time === "number" && time.toString().length === 10) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === "a") {
      return ["日", "一", "二", "三", "四", "五", "六"][value];
    }
    return value.toString().padStart(2, "0");
  });
  return time_str;
}

export const format = (day = new Date(), fmt = "YYYY-MM-DD HH:mm:ss") => {
  let o = {
    "M+": day.getMonth() + 1, // 月份
    "D+": day.getDate(), // 日
    "H+": day.getHours(), // 小时
    "m+": day.getMinutes(), // 分
    "s+": day.getSeconds(), // 秒
    "q+": Math.floor((day.getMonth() + 3) / 3), // 季度
    S: day.getMilliseconds() // 毫秒
  };
  if (/(Y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (day.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  for (let k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
    }
  }
  return fmt;
};
