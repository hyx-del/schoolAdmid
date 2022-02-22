// 处理表单的返回结果
import { backType, parseTime } from "./utils";
import { dataFormat } from "./config";

export const dealForm = state => {
  let arrayObj = Object.keys(state.arrayObj);
  let backObj = JSON.parse(JSON.stringify(state.inFormObj));
  // 数组处理
  arrayObj.forEach(key => {
    let item = state.formListObj[key];
    if (backType(backObj[key], "Array") && item.backType != "Array") {
      backObj[key] = backObj[key].join(",");
    }
  });
  // searchTags 的值的处理
  let refSeachObj = Object.keys(state.refSeachObj);
  refSeachObj.forEach(key => {
    let item = state.formListObj[key];
    if (item.backType != "Array") {
      backObj[key] = state.inFormObj[key].map(val => val.value).join(",");
    }
  });
  // refVideo 视频值的处理
  let refVideo = Object.keys(state.refVideo);
  refVideo.forEach(key => {
    if (typeof backObj[key] == "object") {
      let item = state.formListObj[key];
      try {
        backObj[key] = state.inFormObj[key].url || "";
        backObj[item.timeCode || key + "_time"] =
          state.inFormObj[key].len || "";
        backObj[item.nameCode || key + "_name"] =
          state.inFormObj[key].oldName || "";
      } catch (err) {
        backObj[key] = "";
        backObj[item.timeCode || key + "_time"] = "";
        backObj[item.nameCode || key + "_name"] = "";
      }
    }
  });
  // 日期的处理
  let refDate = Object.keys(state.refDate);
  let timeArr = ["datetimerange", "daterange", "monthrange", "dates"];
  refDate.forEach(key => {
    let item = state.formListObj[key];
    // 多日期兼容
    if (
      timeArr.includes(item.dateType) &&
      typeof state.inFormObj[key] == "object" &&
      state.inFormObj[key] != null
    ) {
      let midArr = state.inFormObj[key].map(v =>
        parseTime(v, item.dataFormat || dataFormat[item.dateType])
      );

      backObj[key] = midArr.join(",");
      // 如果有日期接收组
      let otherCodeArr = item.otherCodeArr;
      if (otherCodeArr) {
        backObj[otherCodeArr[0]] = midArr[0];
        backObj[otherCodeArr[1]] = midArr[1];
      }
    } else {
      backObj[key] = parseTime(
        state.inFormObj[key],
        item.dataFormat || dataFormat[item.dateType]
      );
    }
  });

  // 日期分割字符串处理
  let splitCodeObj = Object.keys(state.splitCodeObj);
  splitCodeObj.forEach(code => {
    let item = state.formListObj[code];
    let value =
      typeof state.inFormObj[code] == "object" && state.inFormObj[code] != null
        ? state.inFormObj[code]
        : state.inFormObj[code]
        ? state.inFormObj[code].split(",")
        : [];
    value = value.filter(v => v != "");
    let splitCode = item.splitCode.split(",");
    if (item.el == "date") {
      splitCode.forEach((key, i) => {
        backObj[key] = value[i]
          ? parseTime(value[i], item.dataFormat || dataFormat[item.dateType])
          : "";
      });
    }
  });
  // 时间处理
  let refTime = Object.keys(state.refTime);
  refTime.forEach(key => {
    let item = state.formListObj[key];
    // 选择区间时间
    if (
      typeof state.inFormObj[key] == "object" &&
      state.inFormObj[key] != null
    ) {
      let midArr = state.inFormObj[key].map(v => parseTime(v, "{h}:{i}:{s}"));
      let otherCodeArr = state.formListObj[key].otherCodeArr;
      if (otherCodeArr) {
        backObj[otherCodeArr[0]] = midArr[0];
        backObj[otherCodeArr[1]] = midArr[1];
      }
    } else {
      backObj[key] = parseTime(state.inFormObj[key], "{h}:{i}:{s}");
    }
  });
  let refCascader = Object.keys(state.refCascader);
  refCascader.forEach(code => {
    let item = state.formListObj[code];
    if (item.cascaderValue == "end") {
      backObj[code] = state.inFormObj[code]
        .map(v => v.value.split(",")[v.value.split(",").length - 1])
        .join(",");
      backObj[item.firstCode || "firstCode"] = state.inFormObj[code]
        .map(v => v.value.split(",")[0])
        .join(",");
    } else {
      backObj[code] = state.inFormObj[code].map(v => v.value).join("||");
    }
  });
  // 对于 结果的最终处理
  for (let code in state.inFormObj) {
    let item = state.formListObj[code];
    if (!item) continue;
    let { el } = item;
    if (item.backType == "Array" && backType(backObj[code], "String")) {
      backObj[code] = backObj[code].split(",");
    }

    // 默认值处理
    if (
      (item.defalt || item.defalt == 0 || item.defalt == false) &&
      (!state.inFormObj[code] || state.inFormObj[code].length == 0)
    ) {
      backObj[code] = item.defalt;
    }
    // 对结果属性的处理
    if (
      item.backType == "ArrayString" ||
      item.backType == "ArrayStringNumber"
    ) {
      if (backType(backObj[code], "String")) {
        try {
          let mid = JSON.parse(backType(backObj[code]));
          if (!backType(mid, "Array")) {
            let turn = backObj[code].split(",");
            if (item.backType == "ArrayStringNumber") {
              turn = turn.map(i => Number(i)).filter(v => v);
            }
            backObj[code] = JSON.stringify(turn);
          }
        } catch (err) {
          let turn = backObj[code].split(",");
          if (item.backType == "ArrayStringNumber") {
            turn = turn.map(i => Number(i)).filter(v => v);
          }
          backObj[code] = JSON.stringify(turn);
        }
      }
      if (backType(backObj[code], "Array")) {
        let turn = backObj[code];
        if (item.backType == "ArrayStringNumber") {
          turn = turn.map(i => Number(i)).filter(v => v);
        }
        backObj[code] = JSON.stringify(turn);
      }
    }
    if (item.backType == "Number") {
      if (backType(state.inFormObj[code], "String")) {
        backObj[code] = parseFloat(
          state.inFormObj[code].replace(/[^\.0-9]/gi, "") || 0
        );
      }
      if (backType(state.inFormObj[code], ["Null", "Undefined"])) {
        backObj[code] = 0;
      }
    }
    // 对时间不处理
    let timeArr = ["date", "timePicker", "timeSelect"];
    if (item.backType == "String" && !timeArr.includes(el)) {
      if (backType(state.inFormObj[code], ["Null", "Undefined"])) {
        backObj[code] = "";
      } else {
        backObj[code] = state.inFormObj[code] + "";
      }
    }
    // 自定义处理结果
    if (item.getValue) {
      backObj = {
        ...backObj,
        ...item.getValue(state.inFormObj, state.inFormObj[code])
      };
    }
  }
  return backObj;
};
