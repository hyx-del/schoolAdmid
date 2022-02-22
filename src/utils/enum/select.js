/*
 * @Author: zx
 * @Date: 2021-09-01 15:51:58
 * @LastEditors: 郑晶
 * @LastEditTime: 2021-11-01 10:02:36
 * @Descripttion:
 */
import store from "@/store";

const blue = "#2e8de6";
const red = "#f00";

// 数组转换成对象
const listToObj = (list, key = "value") => {
  let obj = {};
  list.forEach(item => {
    obj[item[key]] = {
      ...item
    };
  });
  return obj;
};
// 传入下面的list，返回结果，建议list很少时使用
export const getListObj = (list, value, key) => {
  let backArr = list.filter(item => item.value == value);
  if (backArr.length > 0) {
    return key ? backArr[0][key] : { value: "", label: "" };
  } else {
    return key ? "" : { value: "", label: "" };
  }
};
// 传入下面的list，返回结果，建议list很少时使用
export const getListHtml = (list, value = "", color = "#333") => {
  value += "";
  if (value == "" || value == null || value == undefined) return "";
  let midArr = value.split(",");
  if (midArr.length > 1) {
    let mid = midArr.map(item => getListObj(list, item, "label")).join(",");
    return `<span style="color:${getListObj(list, midArr[0], "color") ||
      color} ">${mid}</span>`;
  } else {
    return `<span style="color:${getListObj(list, value, "color") ||
      color} ">${getListObj(list, value, "label")||'-'}</span>`;
  }
};

// 是否存在某个状态
export const hasStatus = (list, arr) => {
  return list.some(v => arr.includes(v.value + ""));
};

// 学期类别
export const categoryList = [
  { value: "1", label: "常规任务" },
  { value: "2", label: "工作坊" },
  { value: "3", label: "名师培训" }
];
// 学期类别
export const categoryList2 = [
  { value: "1", label: "常规课程" },
  { value: "2", label: "工作坊" },
  { value: "3", label: "名师培训" }
];
export const categoryObj2 = listToObj(categoryList2);

// 报名方式
export const signUpList = [
  { value: "1", label: "全款" },
  { value: "2", label: "定金" }
];
export const signUpObj = listToObj(signUpList);

// 状态1
export const stateList = [
  { value: "10", label: "筹备中" },
  { value: "20", label: "运营" },
  { value: "-20", label: "暂停" }
];

// 课程状态
export const courseStateList = [
  { value: "1", label: "正常" },
  { value: "-1", label: "禁用" }
];

// 课程状态
export const examineList = [
  { value: "1", label: "考核" },
  { value: "0", label: "不考核" }
];

// 状态 上下线
export const onlineList = [
  { value: "1", label: "上线" },
  { value: "-1", label: "下线", color: red },
  { value: "0", label: "未发布", color: blue }
  // { value: "", label: "未上线", color: blue }
];
export const onlineObj = listToObj(onlineList);

// 状态
export const enableList = [
  { value: "1", label: "正常" },
  { value: "0", label: "禁用", color: red }
];
export const enableStatus = listToObj(enableList);

// 员工状态
export const staffEnableList = [
  { value: "1", label: "正常" },
  { value: "0", label: "禁用", color: red }
];
export const staffEnableStatus = listToObj(enableList);
// 员工状态
export const staffEnableList2 = [
  { value: "1", label: "正常" },
  { value: "-1", label: "禁用", color: red }
];

// 学员状态
export const studentStatusList = [
  {
    value: 10,
    label: "潜在学员"
  },
  {
    value: 20,
    label: "正式学员"
  },
  {
    value: 30,
    label: "毕业学员"
  }
];

export const studentStatus = listToObj(studentStatusList);

// 性别
export const genderList = [
  { value: "1", label: "男" },
  { value: "2", label: "女" }
];

export const showGender = listToObj(genderList);

// 是否提供住宿
export const ContainList = [
  { value: "0", label: "不提供" },
  { value: "1", label: "提供" }
];

export const Contain = listToObj(ContainList);

// 是否供餐:1供餐 -1不供餐
export const mealStatusList = [
  { value: "-1", label: "不提供" },
  { value: "1", label: "提供" }
];

export const mealStatus = listToObj(mealStatusList);

// 报名方式:10定金 20全款
export const registerModeList = [
  { value: "10", label: "定金" },
  { value: "20", label: "全款" }
];
// 报名方式:10 实付 20转结
export const payModeList = [
  { value: "10", label: "实付" },
  { value: "20", label: "转结" }
];
// 支付方式: 1线上支付，2线下支付
export const payOnlineList = [
  { value: "1", label: "线上支付" },
  { value: "2", label: "线下支付" },
];

// 支付方式2: 1 线下支付，2 线上支付
export const payOnlineList2 = [
  { value: "10", label: "单一支付" },
  { value: "20", label: "组合支付" }
];

// 费用类型
export const costType = [
  { value: "10", label: "定金" },
  { value: "20", label: "学费" },
  { value: "30", label: "住宿费" },
  { value: "40", label: "押金" },
  { value: "50", label: "餐费" }
];
export const costTypeObj = listToObj(costType);

export const registerMode = listToObj(registerModeList);

// // 岗位状态
export const jobsStateList = [
  { value: "0", label: "岗位状态" },
  { value: "1", label: "正式员工" }
];

export const jobsState = listToObj(jobsStateList);

// // 员工岗位状态
export const staffStateList = [
  { value: "1", label: "试用期" },
  { value: "2", label: "正式员工" }
];

export const staffState = listToObj(staffStateList);

// 注册等级 0 无 、10普通、20高级
export const degreesList = [
  {
    value: 0,
    label: "无"
  },
  {
    value: 10,
    label: "普通"
  },
  {
    value: 20,
    label: "高级"
  }
];

export const degrees = listToObj(degreesList);
//  练习基础
export const practiceBaseList = [
  {
    value: "1",
    label: "从事瑜伽行业"
  },
  {
    value: "2",
    label: "自我提升、精进"
  },
  {
    value: "3",
    label: "休闲度假、放松解压"
  },
  {
    value: "4",
    label: "其他"
  }
];
export const practiceBase = listToObj(practiceBaseList);
//  学习意向
export const studyIntentionList = [
  {
    value: "1",
    label: "很强"
  },
  {
    value: "2",
    label: "中等"
  },
  {
    value: "3",
    label: "一般"
  },
  {
    value: "4",
    label: "弱"
  },
  {
    value: "5",
    label: "暂无"
  }
];
export const studyIntention = listToObj(studyIntentionList);

// 职能
export const funList = [
  {
    value: "8",
    label: "教练"
  },
  {
    value: "32",
    label: "销售"
  }
];
export const funObj = listToObj(funList);

// 报到状态 报到状态 10未报到 20已报到 30延期 40已结业 50 取消 60 转校审核[取消] 70 转校审核完
export const reportStatusList = [
  {
    value: "10",
    label: "未报到"
  },
  {
    value: "20",
    label: "已报到"
  },
  {
    value: "30",
    label: "延期"
  },
  {
    value: "40",
    label: "已结业"
  },
  {
    value: "50",
    label: "取消"
  },
  // {
  //   value: "60",
  //   label: "转校审核[取消] "
  // },
  {
    value: "70",
    label: "转校成功"
  }
];
// 下单类型
export const orderChannel = [
  { value: 10, label: "后台" },
  { value: 20, label: "APP" },
  { value: 30, label: "公众号" },
  { value: 40, label: "小程序" },
];

// 下单类型
export const orderType = [
  { value: 10, label: "支付" },
  { value: -10, label: "退款",color:red }
];

export const orderStatus = [
  { value: 0, label: "待付款" },
  { value: 10, label: "已完成" },
  { value: -10, label: "已取消" ,color:red},
  { value: 8, label: "支付中" }
];

export const payChannel = () => store.getters.payChannel;

export const reportStatus = listToObj(funList);

// 状态:10,20未审核,30已取消
export const auditList = [
  {
    value: "10",
    label: "已审核"
  },
  {
    value: "20",
    label: "未审核",
    color: red
  },
  {
    value: "30",
    label: "已取消"
  }
];
export const auditStatus = listToObj(funList);

// 排课方式
export const arrangingList = [
  {
    value: "1",
    label: "单日"
  },
  {
    value: "2",
    label: "周期"
  }
];
export const arrangingStatus = listToObj(arrangingList);

export const weekList = [
  {
    value: "1",
    label: "星期一"
  },
  {
    value: "2",
    label: "星期二"
  },
  {
    value: "3",
    label: "星期三"
  },
  {
    value: "4",
    label: "星期四"
  },
  {
    value: "5",
    label: "星期五"
  },
  {
    value: "6",
    label: "星期六"
  },
  {
    value: "7",
    label: "星期日"
  }
];
