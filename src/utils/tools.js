/*
 * @Author: 郑晶
 * @Date: 2021-09-02 09:42:30
 * @LastEditors: 郑晶
 * @LastEditTime: 2021-09-02 10:12:24
 * @Descripttion:
 */
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter, useRoute } from "vue-router";
import { schoolSemesterDelete } from "@/api/semester";
import { toRefs, ref, reactive, computed ,} from "vue";

let router;
//
export const messageBox = (row, api, table, tips, callBack) => {
  ElMessageBox.confirm((tips && tips.title) || "确认删除吗?", "确认提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      api({ id: row.id, ...tips.params }).then(({ code, msg }) => {
        if (code == 200) {
          ElMessage({
            type: "success",
            message: (tips && tips.success) || "操作成功!"
          });
          table && table.value.update();
          callBack && callBack();
        } else {
          ElMessage({
            type: "success",
            message: msg || "操作失败"
          });
        }
      });
    })
    .catch(() => {});
};
export const deleteItem = (
  row,
  api,
  table,
  tips = { title: "", success: "" },
  callBack
) => {
  if (!tips) {
    tips = {
      title: "确认删除吗?",
      success: "删除成功!"
    };
  }
  if (tips) {
    tips.title = tips.title || "确认删除吗?";
    tips.success = tips.success || "删除成功!";
  }
  messageBox(row, api, table, tips, callBack);
};

// table操作根据状态显示和操作
export const tableStatues = (list, api, table, other = { key: "status" }) => {
  router = useRouter();
  let { key, edit, del } = other;
  let arr = [];
  arr = list.map(item => {
    return {
      perCode: item.perCode,
      name: val => (val.status != item.value ? item.label : ""),
      method: row => {
        let tips = {
          title: `确定把状态改为${item.label}?`,
          success: "操作成功",
          params: {
            id: row.id,
            [key]: item.value
          }
        };
        messageBox(row, api, table, tips);
      }
    };
  });
  edit &&
    arr.unshift({
      name: "编辑",
      perCode: edit.perCode,
      method: val => {
        router.push({ path: edit.path, query: { id: val.id } });
      }
    });
  del &&
    arr.push({
      perCode: del.perCode,
      name: "删除",
      method: val => {
        deleteItem(val, del.fun, table);
      }
    });
  return arr;
};

// 取两数组之间的差值,arrA小数组，arrB大数组，a相当于b的差值
export const differenceArray = (arrA, arrB) => {
  let setA = new Set([...arrA]);
  let setB = new Set([...arrB]);
  let diff = Array.from(new Set(arrB.filter(x => !setA.has(x))));
  return diff || [];
};

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

// 跳转
export const jumps = (path, query) => {
  console.log("path,query", path, query);
  // const router=useRouter();
  console.log("router", router, useRouter);
  return router.push({ path });
};

// 运算
export const operation = (obj, str = "a*b", fix = 2) => {
  let fixNum = 10000;
  let opStr = str.match(/[a-z]{1,}[0-9]{0,}/gi);
  let sss = str.replace(/[a-z]{1,}[0-9]{0,}/gi, "aaa");
  let end = 0;
  opStr.forEach(v => {
    sss = sss.replace("aaa", `obj.${v}`);
  });
  opStr.forEach(key => {
    if (obj[key] == undefined || obj[key] == null) {
      obj[key] = 0;
    } else {
      obj[key] = parseInt(obj[key] * fixNum) / fixNum;
    }
  });
  try {
    let str = sss.split("=")[0];
    end = eval(str);
  } catch (err) {
    console.log(err);
  }
  return (parseInt(end * fixNum) / fixNum).toFixed(fix) * 1;
};

// 检查日期是否有效
const isDateValid = (...val) => !Number.isNaN(new Date(...val).valueOf());
// 计算两个日期之间的间隔
const dayDif = (date1, date2) =>
  Math.ceil(Math.abs(date1.getTime() - date2.getTime()) / 86400000);

// 查找日期位于一年中的第几天
const dayOfYear = date =>
  Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);


// 对象转url字符串
export const objToUrl = (obj) => {
  let str=''
  for (let key in obj) {
    str+=`&${key}=${obj[key]}`
    console.log(key, obj[key])
  }
  str=str.replace('&','?')
  return str
};
