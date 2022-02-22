// 只能在这个组件里使用的函数
import { backType, operation, parseTime } from "./utils";
import { checkChange, dataFormat, inheritObj, valArray } from "./config";

// 元素的初始化
export const itemStart = (state, value, el, code) => {
  // 从后台获取list的初始化
  value.back = value.fun ? true : false;

  if (value.back) {
    state.backList[code] = state.backList[code]
      ? state.backList[code]
      : value.list || [];
    value.firstRequest && getFunData(state, value, { ...value.query });
  } else {
    state.backList[code] = value.list || [];
  }
  // 结果是数组的处理
  if (
    (valArray.includes(el) && value.backType != "Array") ||
    (el == "select" && value.multiple)
  ) {
    state.arrayObj[code] = {};
    if (state.inFormObj[code] && typeof state.inFormObj[code] == "string") {
      state.inFormObj[code] = state.inFormObj[code]
        ? state.inFormObj[code].split(",")
        : [];
      state.inFormObj[code] = state.inFormObj[code].map(v => {
        if (Number(v)) v = Number(v);
        return v;
      });
    } else {
      state.inFormObj[code] = state.inFormObj[code]
        ? state.inFormObj[code]
        : [];
    }
  }
  // 初始化分割程序
  if (value.splitCode) {
    state.splitCodeObj[code] = {};
    let splitCodeArr = value.splitCode.split(",");
    let splitValueArr = [];
    if (typeof state.inFormObj[code] == "string") {
      splitValueArr = state.inFormObj[code].split(",");
    }
    if (typeof state.inFormObj[code] == "object") {
      splitValueArr = state.inFormObj[code];
    }
    splitValueArr.map(v => v !== "");
    state.inFormObj[code] = state.inFormObj[code] || [];
    let mid = [];
    splitCodeArr.forEach((v, i) => {
      state.inFormObj[v] = state.inFormObj[v] || splitValueArr[i] || "";
      if (state.inFormObj[v].length > 0) {
        mid[i] = parseTime(state.inFormObj[v], dataFormat[value.dateType]);
      }
    });
    state.inFormObj[code] = mid;
  }
  // 日期初始化
  if (el == "date") {
    value.startPlaceholder = value.startPlaceholder || "开始日期";
    value.endPlaceholder = value.endPlaceholder || "结束日期";
    value.rangeSeparator = value.rangeSeparator || "-";
    value.defaultValue = new Date();
    value.defaultTime =
      value.dateType == "datetimerange"
        ? value.defaultTime || ["00:00:00", "23:59:59"]
        : null;
    value.type = value.dateType;
    state.refDate[code] = {};
  }
  // 时间选择器初始化
  if (el == "timePicker") {
    state.refTime[code] = {};
    value.config = value.config || {};
    value.config.clearable = true;
    value.config.size = "small";
    value.config.rangeSeparator = "-";
  }
  // 时间选择初始化
  if (el == "timeSelect") {
    value.config = {};
    value.config.step = "00:15";
    value.config.start = "00:00";
    value.config.end = "23:59";
    value.config.clearable = true;
    value.config.size = "small";
  }
  // cascader 联级初始化
  if (el == "cascaderTags") {
    state.inFormObj[code + "_v"] = [];
    state.refCascader[code] = {};
    if (state.inFormObj[code].length > 0 && value.backType != "Array") {
      let time = setInterval(() => {
        if (state.backList[code].length > 0) {
          clearInterval(time);
          let arr = [];
          state.inFormObj[code] = state.inFormObj[code].map(v => Number(v));
          state.backList[code].forEach(val => {
            val.children.forEach(v => {
              if (state.inFormObj[code].includes(v.value)) {
                arr.push({
                  label: `${val.label},${v.label}`,
                  value: `${val.value},${v.value}`
                });
              }
            });
          });
          state.inFormObj[code] = arr;
        }
      }, 100);
    }
  }
  // select-tage初始化
  if (el == "searchTags") {
    if (state.inFormObj[code].length > 0 && value.backType != "Array") {
      let { postData = {} } = value;
      value.fun({ size: 1000, current: 1, ...postData }).then(res => {
        let mid = res.data.records.filter(v => {
          let search = state.inFormObj[code].filter(
            vv => vv == v[value.valueCode]
          );
          if (search.length > 0) {
            v.label = v[value.labelCode];
            v.value = v[value.valueCode];
            return v;
          }
        });
        state.inFormObj[code] = mid.length > 0 ? mid : state.inFormObj[code];
      });
    }
    state.backList[code] = [];
    state.refSeachObj[code] = {};
    state.inSearchVal[code] = "";
  }
  // 值变化检查值数组
  if (checkChange.includes(el)) {
    state.checkChangeObj[code] = {};
  }
  // area 初始化
  if (el == "area") {
    state.refArea[code] = {};
  }
  // 视频 初始化
  if (el == "video" || el == "mp3") {
    state.refVideo[code] = {};
  }
  // Checkbox 初始化
  if (el == "checkbox") {
  }
};

// 根据传入的列表改变表单
export const stateListChange = (list, state) => {
  if (state.inConfig.clearHideShow) {
    state.inHideList = [];
    state.inShowList = [];
  }
  let codeObj = {};
  let codeList = list.map(item => {
    codeObj[item.code] = item;
    return item.code;
  });
  codeList = codeList.filter(v => v);
  state.inItemList = state.inItemList.map(item => {
    if (codeList.includes(item.code)) {
      item = { ...item, ...codeObj[item.code] };
    }
    return item;
  });
};

// 计算表达式
export const countFun = (state, check = false) => {
  let inFormObj = { ...state.inFormObj };
  for (let key in inFormObj) {
    let item = state.formListObj[key];
    if (item) {
      if (
        !item.show ||
        inFormObj[key] == undefined ||
        inFormObj[key] == "" ||
        (check && !state.inCheckItemObj[key])
      ) {
        inFormObj[key] = item.default;
      }
      if (item.countFun) {
        if (check && state.inCheckItemObj[key]) {
          inFormObj[key] = state.otherCount[key] || item.defalt || 1;
        } else {
          inFormObj[key] = item.defalt || 1;
        }
      }
    } else {
    }
  }
  let countList = check ? state.checkCountList : state.countList;
  countList.forEach(count => {
    let end = operation(inFormObj, count.countStr);
    state.inFormObj[count.endCode] = isNaN(end) ? "错误" : end;
  });
};
// 获取继承属性
export const getInherit = (item, el, obj = {}) => {
  let list =
    el && inheritObj[el]
      ? [...(inheritObj[el].list || []), "class", "style"]
      : ["class", "style"];
  let defaltObj = el && inheritObj[el] ? inheritObj[el].default || {} : {};
  let backObj = { ...defaltObj };
  backObj = { ...backObj, ...obj };
  if ((backType(item), "Object")) {
    list.forEach(key => {
      if (item[key]) {
        backObj[key] = item[key];
      }
    });
  }
  backObj.ref = item.code;
  return backObj;
};

// 获取label格式的数据 ,强刷新数据refresh
export const getFunData = (state, item, parObj = {}, refresh = false) => {
  let par = {
    ...{ size: 1000, current: 1, enable: 1 },
    ...item.postData,
    ...parObj
  };
  let { code } = item;
  let requsetStr = `${code}${JSON.stringify(par)}`;
  if (state.backListRequst[requsetStr] && !refresh) return;
  state.backListRequst[requsetStr] = true;
  item.fun &&
    item.fun(par).then(res => {
      let { funMode = "table" } = item;
      if (backType(funMode, "Function")) {
        state.backList[code] = funMode(res);
      } else {
        // 只有一层数据时
        if (funMode == "one") {
          state.backList[code] = keyC(item, res.data);
        } else if (funMode == "table") {
          // 用表格数据
          state.backList[code] = keyC(item, res.data.records);
        } else {
          state.backList[code] = keyC(item, eval(funMode));
        }
      }
      // 处理值和选中的对不上
      if (state.inFormObj[code] && state.inFormObj[code] != null) {
        let mid = [];
        let type = typeof state.inFormObj[code];
        if (type == "number") {
          mid = [state.inFormObj[code]];
        } else if (type == "string") {
          mid = state.inFormObj[code].split(",");
        } else {
          mid = state.inFormObj[code];
        }
        mid = mid.map(v => Number(v)+'');
        mid = [...new Set(mid)];
        let find=state.backList[code].filter(v=>mid.includes(v.value)).map(val=>val.value)
        state.inFormObj[code] = find.length>1?find:find.toString();
      }
    });
};

export const keyC = (item, mapList) => {
  if (!mapList) return [];
  if (item.labelCode == undefined && item.valueCode == undefined)
    return mapList.map(v => {
      v.value = v.value + "";
      return v;
    });
  if (item.labelCode == "label" && item.valueCode == "value") return mapList;
  return mapList.map(v => {
    if (v.label && v.value) return v;
    v.label = v[item.labelCode];
    v.value = v[item.valueCode] + "";
    return v;
  });
};

// 根据返回函数改变表单的元素的显示和值的改变
export const byBackFunChange = (state, item, fun, callback) => {
  if (fun) {
    let { code } = item;
    let valueChangeBack = fun(state.inFormObj[code], state.inFormObj);
    console.log('----------------',backType(valueChangeBack))
    if (backType(valueChangeBack, "Array")) {
      stateListChange(valueChangeBack, state);
      callback && callback();
    }
    if (backType(valueChangeBack, "Object")) {
      if (valueChangeBack.list && valueChangeBack.list.length > 0) {
        stateListChange(valueChangeBack.list, state);
        callback && callback();
      }
      if (valueChangeBack.formObj) {
        state.inFormObj = {
          ...state.inFormObj,
          ...valueChangeBack.formObj
        };
      }
    }
    if (backType(valueChangeBack, "Promise")) {
      valueChangeBack.then(res => {
        if (res.reset) {
          state.inReset({ name: "reset" }, res.reset);
        } else {
          if (res.formObj) {
            state.inFormObj = { ...res.formObj };
          }
          if (res.changeFormObj) {
            state.inFormObj = { ...state.inFormObj,...res.changeFormObj};
          }
          if (res.list && res.list.length > 0) {
            stateListChange(res.list, state);
            callback && callback();
          }
        }
      });
    }
  }
};
// 改变数据初始值
export const changeObj = (val,state) => {
  for (const key in val) {
    if (backType(val[key], "Number")) {
      val[key] = val[key] + "";
    }
    if (val[key]==null||val[key]=='null'||val[key]==undefined||val[key]=='Undefined') {
      val[key] =  "";
    }
  }

  let arrayObj = Object.keys(state.arrayObj);
  // 数组处理,字符串转数组
  arrayObj.forEach(key => {
    if (backType(val[key], "String")) {
      val[key] = val[key] ? val[key].split(",") : [];
    }
    if (backType(val[key], "Number")) {
      val[key] = [val[key] + ""];
    }
  });
  return val;
};
