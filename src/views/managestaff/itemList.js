import { funList, genderList, staffStateList } from "@/utils/enum/select";
import { roleList } from "@/api/role";
import { staffGetStaffInfoByMobile } from "@/api/managerStaff";
export const disabledArr = [
  {
    code: "name",
    required: true
  },
  {
    code: "nameEn",
    required: false
  },
  {
    code: "mobile",
    required: true
  },
  {
    code: "password",
    required: true
  },
  // {
  //   code: "avatar",
  //   required: false
  // },
  // {
  //   code: "displayPhotos",
  //   required: false
  // },
  {
    code: "gender",
    required: false
  },
  {
    code: "staffType",
    required: false
  },
  {
    code: "conversionDate",
    required: false
  },
  {
    code: "type",
    required: false
  },
  {
    code: "conversionDate",
    required: false
  },
  {
    code: "conversionDate",
    required: false
  },
  {
    code: "functions",
    required: false
  },
  {
    code: "entryTime",
    required: true
  },
  {
    code: "address",
    required: true
  },
  {
    code: "profile",
    required: false
  },
  {
    code: "description",
    required: false
  }
];
let getInfo = async (val, obj) => {
  let formObj = await staffGetStaffInfoByMobile({ mobile: val });
  let list = [];
  if (formObj.data) {
    let strArr = ["functions", "gender", "type"];
    strArr.forEach(key => {
      formObj.data[key] = formObj.data[key] + "";
    });
    list = disabledArr.map(item => ({
      disabled: true,
      code: item.code,
      required: false
    }));
    let { functions = "" } = formObj.data;
    formObj.data.functions = functions == 0 ? "" : functions;
  }
  return {
    formObj: formObj.data || { mobile: val },
    reset: formObj.data ? false : { mobile: val },
    list
  };
};

export const itemList = [
  {
    label: "手机号",
    code: "mobile",
    maxlength: 11,
    type: "phone",
    valueChange: getInfo,
    append: "查找",
    appendClick: getInfo,
    afterSlot: "cancelMobile"
  },
  {
    label: "密码",
    code: "password",
    minlength: 6,
    maxlength: 18,
    type: "password2",
    showPassword: true,
    placeholder: "请输入6到18位的数字或字母或,.*#@!~",
    showType: 1
  },
  {
    label: "员工名称",
    code: "name",
    maxlength: 32
    // type: "zh"
  },
  {
    label: "员工英文名",
    code: "nameEn",
    maxlength: 32,
    required: false
    // type: "en"
  },

  {
    el: "img",
    label: "头像",
    code: "avatar",
    ratio: "200/200",
    required: false
  },
  {
    el: "img",
    label: "图片展示",
    code: "displayPhotos",
    backType: "ArrayString",
    limit: 9,
    required: false
  },
  {
    el: "radio",
    label: "性别",
    code: "gender",
    list: genderList,
    required: false,
    defalt: "1"
  },
  {
    el: "radio",
    label: "岗位状态",
    code: "staffType",
    list: staffStateList,
    required: false,
    defaltValueSort: "type",
    defalt: "1",
    showType: 1,
    valueChange: val => [
      {
        code: "conversionDate",
        show: val == 2
      }
    ]
  },
  {
    label: "岗位状态",
    code: "type",
    list: staffStateList,
    showType: 2,
    valueChange: val => [
      {
        code: "conversionDate",
        show: val == 2
      }
    ]
  },
  {
    el: "date",
    label: "转正时间",
    code: "conversionDate",
    maxDate: new Date(),
    dateType: "date",
    show: false
  },
  {
    el: "slot",
    label: "密码",
    code: "resetPassword",
    show: false,
    slotName: "resetPassword",
    showType: 1
  },
  {
    el: "select",
    label: "角色",
    code: "roleIds",
    // funMode: res=>res.data.records.map(v=>({label:v.roleName,value:v.id})),
    funMode: "res.data.records",
    otherBack: "select_label", // label的返回值
    back: true, // 从后台返回结果
    labelCode: "roleName", // 指定的label名
    valueCode: "id", // 指定的value名
    multiple: true,
    fun: roleList,
    query: { type: "TEACHING", size: 1000 },
    backType: "Array",
    showType: 1
  },
  {
    label: "角色",
    code: "roleNames",
    showType: 2
  },
  {
    el: "select",
    label: "职能",
    code: "functions",
    list: funList,
    required: false
  },
  {
    el: "date",
    label: "入职日期",
    code: "entryTime",
    dateType: "date",
    maxDate: new Date()
  },
  {
    el: "textArea",
    label: "住址",
    code: "address",
    maxlength: 255
  },
  {
    el: "textArea",
    label: "个人简介",
    code: "profile",
    maxlength: 255,
    required: false
  },
  {
    el: "editer",
    label: "详细介绍",
    code: "description",
    required: false
  }
];
