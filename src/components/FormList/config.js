// 表单的配置

// 富文本配置
export const wangEditorConfig = {
  showLinkImg: false,
  height: 1500,
  showLinkVideo: false,
  showFullScreen: false,
  uploadImgShowBase64: false,
  menus: [
    "head", // 标题
    "bold", // 粗体
    "fontSize", // 字号
    "fontName", // 字体
    "italic", // 斜体
    "underline", // 下划线
    "strikeThrough", // 删除线
    "foreColor", // 文字颜色
    "backColor", // 背景颜色
    "link", // 插入链接
    // "list", // 列表
    "justify", // 对齐方式
    "quote", // 引用
    "emoticon", // 表情
    "image", // 插入图片
    "table", // 表格
    "code", // 插入代码
    "undo", // 撤销
    "redo" // 重复
  ]
};
// 默认按钮
export const defaultButtons = [
  {
    funType: "confirm",
    type: "primary",
    name: "确认",
    size: "small"
  },
  {
    funType: "cancle",
    type: "primary",
    name: "取消",
    size: "small"
  },
  {
    funType: "reset",
    type: "primary",
    name: "重置",
    size: "small"
  }
];
// 输入框的数组
export const inputArr = ["input", "textArea"];
// 输入框的数组
export const updateArr = ["img", "video", "mp3"];
// 返回值是数组的数组
export const valArray = [
  "area",
  "area2",
  "searchTags",
  "checkbox",
  // "select",
  "img",
  "cascaderTags"
];
// 需要监听值变化的组
export const checkChange = ["img", "video", "mp3", "textArea", "area"];
// 默认配置
export const inConfig = {
  // 默认混入到item上的属性
  defalt: {
    el: "input",
    size: "small",
    show: true,
    clearable: true,
    dateType: "datetime",
    backType: "String",
    placeholder: "",
    row: 3,
    minlength: 1,
    firstRequest: true //后台加载数据时第一次是否请求
  },
  twowayBinding: false, // 是否双向绑定
  watchList: [],
  buttonsArea: "",
  buttonStyle: {},
  enter: true,
  allRequired: true, // 是否全部必填
  allDisabled: false, // 是否全部必填
  labelShow: true,
  inline: false, //行内
  hasLoading: false, //行内
  itemStyle: {
    marginBottom: "22px"
  },
  rightStyle: {
    // width:'600px'
  },
  inputStyle: {
    width: "360px"
  },
  valueStyle: {
    width: "360px"
  },
  radioStyle: {
    marginLeft: "0",
    marginRight: "30px",
    marginBottom: "10px"
  },
  checkboxStyle: {
    marginLeft: "0",
    marginRight: "10px"
  },
  editerStyle: {
    width: "1000px"
  },
  size: "small",
  colon: "：", // 冒号
  mainStyle: {}
};
// 时间格式处理
export const dataFormat = {
  year: "{y}",
  month: "{m}",
  date: "{y}-{m}-{d}",
  dates: "{y}-{m}-{d}",
  week: "{y}-{m}-{d}",
  datetime: "{y}-{m}-{d} {h}:{i}:{s}",
  daterange: "{y}-{m}-{d}",
  monthrange: "{y}-{m}-{d}",
  datetimerange: "{y}-{m}-{d} {h}:{i}:{s}"
};

export const checkArr = {
  // img
};
// 检查类型是数字对于结果的替换
export const numberArr = ["number", "numberPoint", "numberPoint2"];
// 输入款检查类型
export const checkType = {
  // ^\x00-\xff
  doubleBit: {
    name: "双字节匹配",
    regular: /[\u4e00-\u9fa5]+/gi,
    error: ""
  },
  number: {
    name: "数字检查",
    regular: /^[0-9]*$/,
    correctRegular: /[^0-9]{1,}/gi, //纠正正则
    error: "请输入正整数"
  },
  numberPoint: {
    name: "无限制小数点的数字检查",
    regular: /^([0-9]{1,})*([\.][0-9]{1,})?$/,
    correctRegular: /[^0-9.]{1,}/gi, //纠正正则
    error: "请输入数字"
  },
  numberPoint2: {
    name: "最多两个小数点的数字检查",
    regular: /^([0-9]{1,})*([\.][0-9]{1,2})?$/,
    correctRegular: /[^0-9.]{1,}/gi, //纠正正则
    error: "请输入最多两个小数点的数字"
  },
  numberPoint3: {
    name: "最多两个小数点的数字检查",
    regular: /^([0-9]{1,})*([\.][0-9]{1,2})?$/,
    error: "请输入最多两个小数点的数字"
  },
  phone: {
    name: "手机号检查",
    regular: /^[1]([3-9])[0-9]{9}$/,
    correctRegular: /[^0-9]{1,}/gi,
    error: "请输入正确的手机号"
  },
  phones: {
    name: "电话号检查",
    regular: /^[1]([3-9])[0-9]{9}$/,
    correctRegular: /[^0-9]{1,}/gi,
    error: "请输入正确的电话号码"
  },
  landline: {
    name: "手机号检查",
    regular: /(^[1]([3-9])[0-9]{9}$)|(^(0[0-9]{2,3}[\-]{0,})([2-9][0-9]{4,7})+([\-]{0,}[0-9]{1,4})?$)|(^(400)([\-]{0,})(\d{3})([\-]{0,})(\d{4}$))/,
    correctRegular: /[^0-9\-]{1,}/gi,
    error: "请输入正确的手机号或者电话号码"
  },
  email: {
    name: "邮箱验证",
    regular: /^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/,
    error: "请输入正确的邮箱"
  },
  zh: {
    name: "中文检查",
    regular: /^[\u4e00-\u9fa5]+$/,
    correctRegular: /[^\u4e00-\u9fa5]{1,}/gi,
    error: "请输入中文"
  },
  password: {
    name: "密码数字加特殊字符",
    regular: /^(?![0-9]+$)(?![a-zA-Z\.!@#$%^&*()_+|{}?><\-\]\\[\/'"\:\;\,\<\>]+$)[0-9A-Za-z\.!@#$%^&*()_+|{}?><\-\]\\[\/'"\:\;\,\<\>]{6,20}$/,
    error: "请输入密码数字加特殊字符"
  },
  password2: {
    name: "密码数字加特殊字符",
    regular: /^[a-zA-Z0-9,.*#@!~]{6,18}$/,
    correctRegular: /[^a-zA-Z0-9,.*#@!~]{1,}/gi,
    error: "请输入6到18位的数字或字母或,.*#@!~"
  },
  letter: {
    name: "字母检查",
    regular: /^[A-Za-z]+$/,
    correctRegular: /[^A-Za-z\.]{1,}/gi,
    error: "请输入英文字母"
  },
  en: {
    name: "字母检查",
    regular: /^[A-Za-z]+$/,
    correctRegular: /[^A-Za-z\.]{1,}/gi,
    error: "请输入英文字母"
  },
  letterNum: {
    name: "数字加字母检查",
    regular: /^[A-Za-z0-9]{4,40}$/,
    correctRegular: /[^A-Za-z0-9]{1,}/gi,
    error: "请输入英文字母加数字"
  },
  goodsCode: {
    name: "数字加字母检查",
    regular: /^[A-Za-z0-9]{3,40}$/,
    error: "请输入长度不少于三位的英文字母加数字"
  },
  identity: {
    name: "身份证",
    regular: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/,
    correctRegular: /[^0-9Xx]{1,}/gi,
    error: "请输入正确身份证号"
  }
};
export const checkTypeArr = Object.keys(checkType);

export const inheritList = [
  "input",
  "inputNumber",
  "textArea",
  "radio",
  "rate",
  "select",
  "option",
  "slider",
  "switch"
];
// highInherit
export const highInherit = {
  // radio: "radioGroup",
  // checkbox: "checkbox",
  // checkBox: "checkbox"
};
export const highInherit2 = {
  select: "selects",
  radio: "radios",
  checkbox: "checkboxs",
  checkBox: "checkboxs",
  area: "provinces",
  area2: "provinces2",
  date: "dates"
};
//
export const highList = [
  "radio",
  "checkbox",
  "checkBox",
  "date",
  "select",
  "area",
  "area2"
];
let hightInhert = ["list", "item"];

// 可以继承的属性
export const inheritObj = {
  provinces: {
    el: "provinces",
    name: "省市区下拉选择",
    default: {},
    list: [...hightInhert]
  },
  province2: {
    el: "province2",
    name: "省市下拉选择",
    default: {},
    list: [...hightInhert]
  },
  dates: {
    el: "dates",
    name: "日期",
    default: {},
    list: [...hightInhert]
  },
  checkboxs: {
    el: "checkboxs",
    name: "多选框",
    list: [...hightInhert]
  },
  radios: {
    el: "radios",
    name: "单选",
    list: [...hightInhert]
  },
  selects: {
    el: "selects",
    name: "下拉",
    list: [...hightInhert]
  },
  input: {
    el: "el-input",
    name: "输入框",
    default: {},
    list: [
      "type",
      "modelValue",
      "maxlength",
      "minlength",
      "showWordLimit",
      "placeholder",
      "clearable",
      "showPassword",
      "disabled",
      "size",
      "prefixIcon",
      "suffixIcon",
      "rows",
      "autosize",
      "autocomplete",
      "name",
      "readonly",
      "max",
      "min",
      "step",
      "resize",
      "autofocus",
      "form",
      "label",
      "tabindex",
      "validateEvent",
      "inputStyle"
    ]
  },
  inputNumber: {
    el: "el-input-number",
    name: "输入框",
    default: {},
    list: [
      "min",
      "max",
      "step",
      "precision",
      "size",
      "disabled",
      "controls",
      "name",
      "label",
      "placeholder",
      "controlsPosition",
      "stepStrictly"
    ]
  },
  textArea: {
    el: "el-input",
    name: "输入框",
    default: {
      showWordLimit: true
    },
    list: [
      "type",
      "modelValue",
      "maxlength",
      "minlength",
      "showWordLimit",
      "placeholder",
      "clearable",
      "showPassword",
      "disabled",
      "size",
      "prefixIcon",
      "suffixIcon",
      "rows",
      "autosize",
      "autocomplete",
      "name",
      "readonly",
      "max",
      "min",
      "step",
      "resize",
      "autofocus",
      "form",
      "label",
      "tabindex",
      "validateEvent",
      "inputStyle"
    ]
  },
  radio: {
    el: "el-radio",
    name: "单选",
    default: {},
    list: ["label", "disabled", "border", "size", "name"]
  },
  radioGroup: {
    el: "el-radio-group",
    name: "单选组",
    default: {},
    list: ["disabled", "textColor", "fill"]
  },
  rate: {
    el: "el-rate",
    name: "评分",
    default: {},
    list: [
      "max",
      "disabled",
      "allowHalf",
      "lowThreshold",
      "highThreshold",
      "colors",
      "voidColor",
      "disabledVoidColor",
      "icons",
      "voidIcon",
      "disabledVoidIcon",
      "showText",
      "showScore",
      "textColor",
      "texts",
      "scoreTemplate"
    ]
  },
  select: {
    el: "el-select",
    name: "下拉选择",
    default: {},
    list: [
      "multiple",
      "disabled",
      "valueKey",
      "size",
      "clearable",
      "collapseTags",
      "multipleLimit",
      "name",
      "autocomplete",
      "placeholder",
      "filterable",
      "allowCreate",
      "filterMethod",
      "remote",
      "remoteMethod",
      "loading",
      "loadingText",
      "noMatchText",
      "noDataText",
      "popperClass",
      "reserveKeyword",
      "defaultFirstOption",
      "popperAppendToBody",
      "automaticDropdown",
      "clearIcon",
      "fitInputWidth"
    ]
  },
  option: {
    el: "el-option",
    name: "Option 属性",
    list: ["value", "label", "disabled"]
  },
  slider: {
    el: "el-slider",
    name: "滑块",
    default: {},
    list: [
      "min",
      "max",
      "disabled",
      "step",
      "range",
      "vertical",
      "height",
      "label",
      "debounce",
      "marks",
      "tooltipClass",
      "inputSize",
      "showStops",
      "showTooltip",
      "formatTooltip",
      "showInput",
      "showInputControls"
    ]
  },
  switch: {
    el: "el-switch",
    name: "开关",
    list: [
      "disabled",
      "loading",
      "width",
      "string",
      "inlinePrompt",
      "activeIcon",
      "inactiveIcon",
      "activeText",
      "inactiveText",
      "activeValue",
      "inactiveValue",
      "activeColor",
      "inactiveColor",
      "borderColor",
      "validateEvent",
      "beforeChange"
    ]
  },
  timePicker: {
    el: "el-time-picker",
    name: "时间选择器",
    list: [
      "readonly",
      "disabled",
      "editable",
      "clearable",
      "size",
      "placeholder",
      "align",
      "format",
      "name",
      "startPlaceholder",
      "endPlaceholder",
      "isRange",
      "arrowControl",
      "popperClass",
      "rangeSeparator",
      "defaultValue",
      "prefixIcon",
      "clearIcon",
      "disabledHours",
      "disabledMinutes",
      "disabledSeconds"
    ]
  },
  timeSelect: {
    el: "el-time-select",
    name: " 时间选择",
    list: [
      "disabled",
      "editable",
      "clearable",
      "size",
      "placeholder",
      "name",
      "start",
      "end",
      "step",
      "prefixIcon",
      "clearIcon",
      "minTime",
      "maxTime"
    ]
  },
  area: {
    el: "el-cascader",
    name: "省市区下拉选择",
    default: {
      class: "formListArea",
      options: schoolAreaData
    },
    list: [
      "options",
      "props",
      "size",
      "placeholder",
      "disabled",
      "clearable",
      "separator",
      "filterable",
      "debounce",
      "collapseTags",
      "beforeFilter",
      "popperClass",
      "filterMethod",
      "showAllLevels",
      "popperAppendToBody"
    ]
  },

  area2: {
    el: "el-cascader",
    name: "省市下拉选择",
    default: {
      class: "formListArea",
      options: schoolAreaData2
    },
    // "options",
    list: [
      "options",
      "props",
      "size",
      "placeholder",
      "disabled",
      "clearable",
      "separator",
      "filterable",
      "debounce",
      "collapseTags",
      "beforeFilter",
      "popperClass",
      "filterMethod",
      "showAllLevels",
      "popperAppendToBody"
    ]
  },
  cascader: {
    el: "el-cascader",
    name: "级联选择器",
    list: [
      "options",
      "props",
      "size",
      "placeholder",
      "disabled",
      "clearable",
      "separator",
      "filterable",
      "debounce",
      "collapseTags",
      "beforeFilter",
      "popperClass",
      "filterMethod",
      "showAllLevels",
      "popperAppendToBody"
    ]
  },
  elCheckbox: {
    el: "el-checkbox",
    name: "多选框",
    list: [
      "label",
      "disabled",
      "border",
      "size",
      "name",
      "checked",
      "indeterminate",
      "trueLabel",
      "falseLabel"
    ]
  },

  checkbox: {
    el: "checkboxs",
    name: "多选框",
    list: [
      "label",
      "disabled",
      "border",
      "size",
      "name",
      "checked",
      "indeterminate",
      "trueLabel",
      "falseLabel"
    ]
  },
  checkBox: {
    el: "checkboxs",
    name: "多选框",
    list: [
      "label",
      "disabled",
      "border",
      "size",
      "name",
      "checked",
      "indeterminate",
      "trueLabel",
      "falseLabel"
    ]
  },

  checkboxGroup: {
    el: "el-checkbox-group",
    name: "多选框",
    list: ["disabled", "border", "size", "min", "max", "textColor", "fill"]
  },
  colorPicker: {
    el: "el-color-picker",
    name: "颜色选择器",
    list: [
      "disabled",
      "size",
      "predefine",
      "showAlpha",
      "colorFormat",
      "popperClass"
    ]
  },
  datePicker: {
    el: "el-date-picker",
    name: "日期选择器",
    list: [
      "readonly",
      "disabled",
      "size",
      "editable",
      "clearable",
      "placeholder",
      "type",
      "format",
      "name",
      "disabledDate",
      "shortcuts",
      "startPlaceholder",
      "endPlaceholder",
      "popperClass",
      "rangeSeparator",
      "defaultValue",
      "defaultTime",
      "valueFormat",
      "unlinkPanels",
      "prefixIcon",
      "clearIcon",
      "validateEvent"
    ]
  },
  date: {
    el: "el-date-picker",
    name: "日期选择器",
    list: [
      "readonly",
      "disabled",
      "size",
      "editable",
      "clearable",
      "placeholder",
      "type",
      "format",
      "name",
      "disabledDate",
      "shortcuts",
      "startPlaceholder",
      "endPlaceholder",
      "popperClass",
      "rangeSeparator",
      "defaultValue",
      "defaultTime",
      "valueFormat",
      "unlinkPanels",
      "prefixIcon",
      "clearIcon",
      "validateEvent"
    ]
  },
  dateTimePicker: {
    el: "el-date-picker",
    name: "日期时间选择器",
    list: [
      "readonly",
      "disabled",
      "editable",
      "clearable",
      "size",
      "placeholder",
      "type",
      "format",
      "name",
      "shortcuts",
      "disabledDate",
      "cellClassName",
      "startPlaceholder",
      "endPlaceholder",
      "popperClass",
      "rangeSeparator",
      "defaultValue",
      "defaultTime",
      "unlinkPanels",
      "prefixIcon",
      "clearIcon",
      "timeArrowControl"
    ]
  },
  img: {
    el: "UploadImgDrag",
    name: "图片上传",
    list: [
      "defaultUrl",
      "disabled",
      "size",
      "limit",
      "ratio",
      "isGif",
      "ImgType",
      "tips",
      "maxImgSize",
      "width",
      "code"
    ]
  },
  cropperImg: {
    el: "uploadCropperImg",
    name: "图片上传",
    list: [
      "defaultUrl",
      "disabled",
      "size",
      "limit",
      "ratio",
      "isGif",
      "ImgType",
      "tips",
      "maxImgSize",
      "width",
      "code"
    ]
  },
  editer: {
    el: "editer",
    name: "编辑器",
    default: {
      style: {
        width: "1000px"
      }
    },
    list: ["code", "show", "disabled", "style"]
  },
  button: {
    el: "el-button",
    name: "按钮",
    list: [
      "size",
      "type",
      "plain",
      "round",
      "circle",
      "loading",
      "disabled",
      "icon",
      "autofocus",
      "ativeType",
      "autoInsertSpace"
    ]
  },
  span: {
    el: "span",
    name: "aaaa",
    list: []
  },
  slot: {
    name: "aaaa",
    list: []
  },
  aaaaa: {
    name: "aaaa",
    list: []
  }
};
