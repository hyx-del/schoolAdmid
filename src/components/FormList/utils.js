// 外部可用的函数
// 按钮配置
import { isShowButtom } from "@/utils/permissionsButton";

// 根据后台返回权限显示按钮
export const showButtom = perCode => {
  if (!perCode) {
    return true;
  } else {
    return isShowButtom(perCode);
  }
};

// 时间处理
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
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
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

// 比较两个时间star<end,返回 true
export function compareTime(star, end) {
  var starTime = new Date(star).getTime();
  var endTime = new Date(end).getTime();
  return starTime < endTime;
}
// 属性返回值有 Undefined Null
export function backType(cc, string) {
  var typeName = Object.prototype.toString.call(cc);
  if (typeName == "[object Object]") {
    typeName = "[object " + cc.constructor.name;
  }
  typeName = typeName.replace("]", "").slice(8);
  if (typeof string == "string") {
    return typeName == string;
  } else if (string) {
    return string.some(key => key == typeName);
  }
  return typeName;
}

// 输入时间或时间戳返回当前日期，年月日或者周几
export const farmatDate = (time, seperator1 = "-") => {
  var now = time ? new Date(time) : new Date();
  var year = now.getFullYear();
  var week = now.getDay();
  var month = now.getMonth() + 1;
  var strDate = now.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  let date = year + seperator1 + month + seperator1 + strDate;
  var dateStr = `${year}年${month}月${strDate}日`;
  let weekStr = "周" + "日一二三四五六".charAt(week);
  return {
    year,
    yearMonth: `${month}月${strDate}日`,
    month,
    day: strDate,
    week: weekStr,
    date,
    dateStr,
    monthWeek: `${month}月${strDate}日${weekStr}`
  };
};
// 获取当前周
export const getFormatDateWeek = time => {
  let nowTime = time ? new Date(time).getTime() : new Date().getTime();
  let week = new Date().getDay();
  let start = week ? week - 1 : 6;
  let startDay = nowTime - start * 24 * 60 * 60 * 1000;
  let arr = [];
  for (let i = 0; i < 7; i++) {
    arr.push(farmatDate(startDay + i * 24 * 60 * 60 * 1000));
  }
  return arr;
};

// 获取文字长度
export const getlabelWidth = label => {
  let rex = /[\u4e00-\u9fa5]+/gi;
  let long = 0;
  if (rex.test(label)) {
    let zhStr = label.match(rex).join("");
    long = zhStr.length + label.length;
  } else {
    long = label.length;
  }
  long = Math.ceil(long / 2);
  return long;
};

// 取两数组之间的差值,arrA小数组，arrB大数组，a相当于b的差值
export const differenceArray = (arrA, arrB) => {
  let setA = new Set([...arrA]);
  let setB = new Set([...arrB]);
  let diff = Array.from(new Set(arrB.filter(x => !setA.has(x))));
  return diff || [];
};

// 取两数组之间的差值,arrA小数组，arrB大数组，a相当于b的差值
export const differenceArray2 = (arrA, arrB) => {
  let setA = new Set([...arrA]);
  let setB = new Set([...arrB]);
  let diff = Array.from(new Set(arrB.filter(x => !setA.has(x))));
  return diff || [];
};

// 运算
export const operation = (obj, str = "a*b", fix = 100) => {
  let numFix = 1000000000;
  let opStr = str.match(/[a-z]{1,}[0-9]{0,}/gi);
  let sss = str.replace(/[a-z]{1,}[0-9]{0,}/gi, "|||");
  let end = 0;
  opStr.forEach(v => {
    sss = sss.replace("|||", `obj.${v}`);
  });
  opStr.forEach(key => {
    if (obj[key] == undefined || obj[key] == null) {
      obj[key] = 0;
    } else {
      obj[key] = parseInt(obj[key] * numFix) / numFix;
    }
  });
  try {
    let str = sss.split("=")[0];
    end = eval(str);
  } catch (err) {
    console.log(err);
  }
  return Math.round(end * fix) / fix;
};
