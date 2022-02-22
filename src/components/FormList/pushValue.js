// 赋值解析初始值
import { backType, farmatDate } from "@/components/FormList/utils";
let dethArr = ["Array", "ArrayString", "ArrayStringNumber"];
export const pushValue = (state, value, el, code) => {
  // otherCodeArr,时间和日期的区间赋值
  if (value.otherCodeArr && !state.inFormObj[code]) {
    let midArr = [];
    let now = farmatDate();
    if (el == "timePicker") {
      value.otherCodeArr.map(v => {
        midArr.push(
          state.inFormObj[v] ? `${now.date} ${state.inFormObj[v] || ""}` : ""
        );
      });
    }
    if (el == "date") {
      value.otherCodeArr.map(v => {
        midArr.push(state.inFormObj[v]);
      });
    }
    midArr = midArr.filter(v => v);
    state.inFormObj[code] = midArr.length > 0 ? midArr : state.inFormObj[code];
  }
  if (el == "area" || el == "area2") {
    let arr = value.areaCode
      ? value.areaCode.split(",")
      : ["province", "provinceId", "city", "cityId", "county", "countyId"];
    let midArr = [];
    if (el == "area") {
      midArr = [
        state.inFormObj[arr[1]],
        state.inFormObj[arr[3]],
        state.inFormObj[arr[5]]
      ];
    }
    if (el == "area2") {
      midArr = [state.inFormObj[arr[1]], state.inFormObj[arr[3]]];
    }
    midArr = midArr.map(v => Number(v)).filter(v1 => v1);
    state.inFormObj[code] = midArr.length > 0 ? midArr : state.inFormObj[code];
  }
  // defaltValueSort 取值序列
  if (
    value.defaltValueSort &&
    (!state.inFormObj[code] || state.inFormObj[code].length == 0)
  ) {
    let spliteArr = backType(value.defaltValueSort, "String")
      ? value.defaltValueSort.split(",")
      : value.defaltValueSort;
    spliteArr.some(v => {
      if (state.inFormObj[v]) {
        state.inFormObj[code] = state.inFormObj[v];
        return true;
      }
    });
  }
  // backType
  if (dethArr.includes(value.backType)) {
    if (state.inFormObj[code] && state.inFormObj[code][0]) {
      try {
        state.inFormObj[code] = state.inFormObj[code]
          .map(v => v.replace(/\[|\]|\,/gi, "") + "")
          .map(v => v.replace(/\"{1,}/gi, ""))
          .filter(v => v);
      } catch (err) {
        state.inFormObj[code] = [];
      }
    }
    if (backType(state.inFormObj[code], "String")) {
      try {
        state.inFormObj[code] = eval(state.inFormObj[code]);
      } catch (err) {
        console.log(err);
      }
    }
  }
  // 沒有值的時候
  if (
    state.inFormObj[code] == undefined ||
    (state.inFormObj[code] && state.inFormObj[code].length == 0)
  ) {
    // defalt 没有特别的外部赋值的
    if (value.defalt) {
      state.inFormObj[code] = state.inFormObj[code] || value.defalt;
    }
  }
  if (value.setValue) {
    state.inFormObj[code] = value.setValue(
      state.inFormObj,
      state.inFormObj[code]
    );
  }
};
