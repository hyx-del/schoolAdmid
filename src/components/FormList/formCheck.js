import { backType, compareTime } from "./utils";
import { checkType, checkTypeArr, inputArr } from "./config";
import { isCardID } from "./idCardCheck";

// 表单验证
export const formCheck = (value, inFormObj) => {
  let rules = {};
  let { code, el, required } = value;
  rules[code] = [];
  // 共用验证
  let comObj = {
    required,
    message: value.errTip || value.placeholder
  };
  // 常规检查
  // 输入框
  if (inputArr.includes(el)) {
    let one = {
      trigger: el == "textArea" ? ["blur"] : "blur",
      ...comObj
    };
    // 长度检查
    let check = (rule, val, callback) => {
      if (val == "" || val == undefined) callback();
      val += "";
      if (val.length < value.minlength) {
        callback(new Error(`请输入长度大于 ${value.minlength} 个字符`));
      }
      if (val.length > value.maxlength) {
        callback(new Error(`请输入长度小于 ${value.maxlength} 个字符`));
      }
      callback();
    };
    let min = {
      validator: check,
      trigger: el == "textArea" ? ["blur", "change"] : "blur"
    };
    rules[code].push(one);
    rules[code].push(min);
    // 有检查类型
    if (value.type && checkTypeArr.includes(value.type)) {
      let check = (rule, val, callback) => {
        if (val && !checkType[value.type].regular.test(val)) {
          callback(
            new Error(
              value.typeError ||
                checkType[value.type].error ||
                value.placeholder
            )
          );
        }
        callback();
      };
      let validator = { validator: check, trigger: "blur" };
      rules[code].push(validator);
    }
    // 检查函数
    // 身份证检查
    if (value.checkFun == "idcard") {
      let isCardIDCheck = (rule, val, callback) => {
        if (val == "" || val == undefined) callback();
        val += "";
        let checkVal = isCardID(val);
        if (!checkVal.valid) {
          callback(new Error(`身份证${checkVal.error}`));
        }
        callback();
      };
      let iDCheck = {
        validator: isCardIDCheck,
        trigger: "blur"
      };
      rules[code].push(iDCheck);
    }
  }
  // 自定义正则规则
  if (value.regular) {
    let check = (rule, val, callback) => {
      if (value && !value.regular.test(val) && required) {
        callback(new Error(value.regularError || value.placeholder));
      }
      callback();
    };
    rules[code].push({
      validator: check,
      trigger: value.trigger || "blur"
    });
  }
  if (value.minCode != undefined) {
    value.lessCode = value.minCode;
  }
  // 输入框最小值检查
  if (value.lessCode != undefined) {
    let check = (rule, val, callback) => {
      if (val == "" || val == undefined) callback();
      let { code, lessCode } = rule;
      val += "";
      if (isNaN(Number(val))) {
        callback(new Error(`请输入数字`));
      }
      if (Number(val) <= Number(lessCode)) {
        callback(new Error(`请输入大于 ${value.lessCode} 的数字`));
      }
      callback();
    };
    let validator = {
      validator: check,
      code,
      lessCode: value.lessCode,
      trigger: "blur"
    };
    rules[code].push(validator);
  }
  // 输入框最大值检查
  if (value.maxCode) {
    let check = (rule, val, callback) => {
      if (val == "" || val == undefined) callback();
      let { code, maxCode } = rule;
      val += "";
      if (isNaN(Number(val))) {
        callback(new Error(`请输入数字`));
      }
      if (Number(val) > Number(maxCode || 0)) {
        callback(new Error(`请输入小于 ${value.maxCode} 的数字`));
      }
      callback();
    };
    let validator = {
      validator: check,
      code,
      maxCode: value.maxCode,
      trigger: "blur"
    };
    rules[code].push(validator);
  }
  // slect 验证
  let changsArr = ["select", "searchTags", "cascaderTags", "area", "area2"];
  if (changsArr.includes(el)) {
    rules[code] = [{ trigger: ["blur", "change"], ...comObj }];
  }
  if (el == "searchTags") {
    rules[code] = [{ trigger: "change", ...comObj, type: "array" }];
  }
  // 单选规则 多选规则
  if (el == "radio" || el == "checkbox") {
    let check = (rule, val, callback) => {
      if (val == "" || (val == undefined && required)) {
        callback(new Error(value.error || value.placeholder));
      }
      callback();
    };
    rules[code].push({ validator: check, trigger: "change" });
  }
  // 自定义验证的方法
  if (value.validator) {
    rules[code].push({ validator: value.validator, trigger: "blur" });
  }
  // 日期处理
  if (el == "date") {
    // 默认处理
    if (required) {
      rules[code].push({ trigger: "change", ...comObj });
    }
    // 日期处理 ---添加验证
    if (value.dateType == "datetimerange" && required) {
      rules[code].push({ type: "array", trigger: "change", ...comObj });
    }
    if (
      value.options &&
      value.dateType == "datetimerange" &&
      value.options.length > 0
    ) {
      value.pickerOptions = state.getOptions(value.options);
    }
    if (value.maxTime || value.minTime) {
      let maxTime = new Date(value.maxTime || "2200-12-31 00:00:00").getTime();
      let minTime =
        new Date(value.minTime || 0).getTime() - 24 * 60 * 60 * 1000;
      let pickerOptions = {
        disabledDate(time) {
          return time.getTime() < minTime || time.getTime() > maxTime;
        }
      };
      value.pickerOptions = { ...value.pickerOptions, ...pickerOptions };
    }
    // 两个日期处理前后顺序开始日期处理
    if (value.starCode) {
      let check = (rule, val, callback) => {
        let starCode = rule.starCode;
        let starTime = inFormObj[starCode];
        if (!val || !inFormObj[starCode]) callback();
        if (!compareTime(starTime, val)) {
          callback(new Error(value.timeError || value.placeholder));
        }
        callback();
      };
      rules[code].push({
        validator: check,
        starCode: value.starCode,
        trigger: value.trigger || "blur"
      });
    }
    // 两个日期处理前后顺序结束日期处理
    if (value.endCode) {
      let check = (rule, val, callback) => {
        let endCode = rule.endCode;
        let endTime = inFormObj[endCode];
        if (!val || !inFormObj[endCode]) callback();
        if (!compareTime(val, endTime)) {
          callback(new Error(value.timeError || value.placeholder));
        }
        callback();
      };
      rules[code].push({
        validator: check,
        endCode: value.endCode,
        trigger: value.trigger || "blur"
      });
    }
  }
  // 时间选择初始化
  if ((el == "timeSelect" || el == "timePicker") && required) {
    rules[code].push({ trigger: ["change", "blur"], ...comObj });
  }

  if (el == "img") {
    let check = (rule, val, callback) => {
      let { code } = rule;
      if ((!val || inFormObj[code].length == 0) && required) {
        callback(new Error(`请上传`));
      }
      callback();
    };
    rules[code].push({
      ...comObj,
      el: el,
      code: code,
      validator: check,
      message: value.errTip || `请上传${value.label}`,
      trigger: ["change", "blur"]
    });
  }
  if (el == "video" || el == "mp3") {
    let check = (rule, val, callback) => {
      let { code, item } = rule;
      if (
        (backType(val, "Object") || backType(val, "Array")) &&
        val.size == 0 &&
        required
      ) {
        callback(new Error(`请上传`));
      } else if (((val && val.length == 0) || !val) && required) {
        callback(new Error(`请上传`));
      }
      if (val && val.len) {
        inFormObj[item.timeCode || code + "_time"] = val.len;
        inFormObj[item.nameCode || code + "_name"] = val.oldName;
      }
      callback();
    };
    rules[code].push({
      ...comObj,
      el: el,
      code: code,
      item: value,
      validator: check,
      message: `请上传${value.label}`,
      trigger: ["change", "blur"]
    });
  }
  if (el == "editer") {
    let check = (rule, val, callback) => {
      let { code } = rule;
      let v = inFormObj[code] || "";
      v = v
        .replace(/<p>/gi, "")
        .replace(/<\/p>/gi, "")
        .replace(/&nbsp;/gi, "")
        .replace(/<br\/>/gi, "");
      v = v.trim();
      if (v.length == 0 && required) callback(new Error(`请输入内容`));
      callback();
    };
    rules[code].push({
      ...comObj,
      code: code,
      validator: check,
      message: `请输入${value.label}`,
      trigger: "blur"
    });
  }
  return rules;
};
