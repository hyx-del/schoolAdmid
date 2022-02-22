import {
  categoryList2,
  ContainList,
  mealStatusList,
  payOnlineList,
  registerModeList
} from "@/utils/enum/select";
import {
  templatedetail,
  templateList,
  templateListSchool
} from "@/api/headquarters";
import { semesterFactionListAPI } from "@/api/baseSet";
import { staffGetSaleStaffList } from "@/api/managerStaff";

export const itemList = [
  {
    el: "select",
    code: "selectTemp1",
    showType: 1,
    label: "从总部选择模板",
    valueBack: "select_label", // label的返回值
    back: true, // 从后台返回结果
    labelCode: "name", // 指定的label名
    valueCode: "id", // 指定的value名
    fun: templateList,
    required: false
  },
  {
    el: "select",
    code: "selectTemp2",
    showType: 1,
    label: "从学校选择模板",
    valueBack: "select_label", // label的返回值
    back: true, // 从后台返回结果
    labelCode: "name", // 指定的label名
    valueCode: "id", // 指定的value名
    fun: templateListSchool,
    required: false
  },
  {
    code: "name",
    label: "学期名称",
    maxlength: 255
  },
  {
    el: "select",
    code: "category",
    label: "类别",
    list: [...categoryList2],
    seriesCode: "semesterCategoryId",
    seriesFun: val => ( { category: val }),
    tips:'先选《类别》才能选《学期派别》'
  },
  {
    label: "学期派别",
    code: "semesterCategoryName",
    show: false,
    disabled: true,
    required: false
  },
  {
    el: "select",
    code: "semesterCategoryId",
    detailCode: "semesterCategoryName",
    label: "学期派别",
    valueBack: "semesterCategoryIdLabel", // label的返回值
    back: true, // 从后台返回结果
    labelCode: "name", // 指定的label名
    valueCode: "id", // 指定的value名
    fun: semesterFactionListAPI,
    firstRequest: false //第一次不请求
  },
  {
    el: "img",
    code: "picture",
    label: "封面图",
    ratio: "750*375"
  },
  {
    el: "img",
    code: "posterPicture",
    label: "海报分享图",
    ratio: "500*500"
  },
  {
    el: "img",
    code: "wxPicture",
    label: "微信分享图",
    ratio: "500*400"
  },
  {
    code: "contact",
    label: "联系电话",
    type: "landline",
    maxlength: 12,
  },
  {
    el: "line",
    code: "line",
    label: "line",
    showType: 2
  },
  {
    code: "wechat",
    label: "微信号",
    maxlength: 20,
    required: false
  },
  {
    el: "select",
    code: "salesmanIds",
    detailCode: "salesmanNames",
    label: "负责人",
    valueBack: "semesterCategoryIdLabel", // label的返回值
    back: true, // 从后台返回结果
    funMode: "one",
    labelCode: "name", // 指定的label名
    valueCode: "id", // 指定的value名
    fun: staffGetSaleStaffList,
    multiple: true,
    required: false
  },
  {
    el: "area2",
    code: "area",
    detailCode: "mergerName",
    label: "地址"
  },
  {
    el: "textArea",
    code: "address",
    label: "培训地址详情"
  },
  {
    el: "date",
    code: "datess",
    otherCodeArr: ["startDate", "endDate"],
    label: "培训时间",
    dateType: "daterange",
    dataFormat: "{y}-{m}-{d} {h}:{i}:{s}"
  },
  {
    el: "date",
    code: "register",
    otherCodeArr: ["registerStartAt", "registerEndAt"],
    label: "报名时间",
    dateType: "daterange",
    dataFormat: "{y}-{m}-{d} {h}:{i}:{s}"
  },
  {
    code: "number",
    label: "报名名额",
    type: "number"
  },
  {
    code: "registrationFee",
    label: "报名费",
    type: "numberPoint",
    suffix: "元"
  },
  {
    code: "tuition",
    label: "学费",
    type: "numberPoint",
    disabled: true,
    suffix: "元",
    tips: "学费=报名费-住宿费-餐费-定金"
  },
  {
    el: "radio",
    code: "isContainQuarterage",
    label: "是否提供住宿",
    list: ContainList,
    defalt: "1",
    valueChange: val => [
      {
        code: "quarterage",
        show: val == 1
      }
    ]
  },
  {
    code: "quarterage",
    label: "住宿费",
    type: "numberPoint",
    suffix: "元",
    default: 0
  },
  {
    el: "radio",
    code: "mealStatus",
    label: "是否供餐",
    list: mealStatusList,
    defalt: "1",
    valueChange: val => [
      {
        code: "mealMoney",
        show: val == 1
      }
    ]
  },
  {
    code: "mealMoney",
    label: "餐费",
    type: "numberPoint",
    suffix: "元",
    default: 0
  },
  {
    el: "radio",
    code: "registerMode",
    label: "报名方式",
    list: registerModeList,
    defalt: "10",
    valueChange: val => [
      {
        code: "payOnline",
        show: val == 10
      },
      {
        code: "earnest",
        show: val == 10
      }
    ]
  },
  {
    el: "radio",
    code: "payOnline",
    label: "尾款支付方式",
    list: payOnlineList,
    defalt: "1"
  },
  {
    code: "earnest",
    label: "定金",
    type: "numberPoint",
    suffix: "元",
    default: 0
  },
  {
    code: "deposit",
    label: "押金",
    type: "numberPoint",
    suffix: "元",
    required: false
  },
  {
    code: "weight",
    label: "权重",
    type: "number"
  },
  {
    el: "line",
    code: "line",
    label: "line",
    showType: 2
  },
  {
    el: "editer",
    code: "introduction",
    label: "学期介绍",
    defalt: "未填写"
  }
];
