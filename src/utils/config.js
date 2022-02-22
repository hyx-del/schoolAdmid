/*
 * @Author: jiu yin
 * @Date: 2021-09-02 09:26:12
 * @LastEditTime: 2021-10-29 11:29:07
 * @LastEditors: zx
 * @Description: 666
 * @FilePath: \school_admin\src\utils\config.js
 *  “jiu”
 */
// 在表格上方的表单配置
export const tabelFormConfig = {
  allRequired: false, // 是否全部必填
  inline: true, //行内
  colon: "",
  inputStyle: {
    width: "240px"
  },
  buttons: [
    {
      funType: "confirm",
      type: "primary",
      name: "查询",
      size: "small"
    },
    {
      funType: "add",
      type: "primary",
      name: "添加",
      size: "small"
    }
  ]
};
export const tabelFormConfig2 = {
  allRequired: false, // 是否全部必填
  inline: true, //行内
  colon: ":",
  inputStyle: {
    width: "240px"
  },
  buttons: [
    {
      funType: "confirm",
      type: "primary",
      name: "查询",
      size: "small"
    },
    {
      funType: "add",
      type: "primary",
      name: "添加",
      size: "small"
    }
  ]
};
//新加的表单配置
export const addFormConfig = {
  inline: false, //行内
  allRequired: true, // 是否全部必填
  colon: "：",
  inputStyle: {
    width: "360px"
  },
  buttons: [
    {
      funType: "cancel",
      name: "取消",
      size: "small"
    },
    {
      funType: "confirm",
      type: "primary",
      name: "确认",
      size: "small"
    }
  ]
};
//新加的表单配置
export const addFormBottom = {
  inline: false, //行内
  allRequired: true, // 是否全部必填
  colon: "：",
  inputStyle: {
    width: "360px"
  },
  buttons: [
    {
      funType: "cancel",
      type: null,
      name: "取消",
      size: "small"
    },
    {
      funType: "confirm",
      type: "primary",
      name: "确认",
      size: "small"
    }
  ],
  buttonStyle: {
    position: "absolute",
    bottom: "10px",
    marginBottom: "0",
    left: "24px"
  }
};
//新加的弹窗的表单配置
export const popConfig = {
  inline: false, //不是行内
  allRequired: true, // 是否全部必填
  colon: "：",
  inputStyle: {
    width: "300px"
  },
  buttons: [
    {
      funType: "cancel",
      type: null,
      name: "取消",
      size: "small"
    },
    {
      funType: "confirm",
      type: "primary",
      name: "保存",
      size: "small"
    }
  ]
};
