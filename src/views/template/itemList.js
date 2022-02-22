/*
 * @Author: zx
 * @Date: 2021-11-18 15:02:08
 * @LastEditors: zx
 * @LastEditTime: 2021-11-19 14:18:23
 * @Descripttion:
 */
// 新加编辑和详情共用数据
export const itemList = [
  {
    label: "手机号",
    code: "mobile",
    maxlength: 11,
    type: "phone",
    append: "查找",
    appendClick: (val, obj) => {
      console.log(val, obj);
    }
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
    colon:' ',
    maxlength: 32
  },
  {
    el: "radio",
    label: "radio",
    code: "radio",
    valueChange:(val)=>[{
      code:'hide',
      show:val==1,
    }],
    list: [
      {
        value: "1",
        label: "测试1"
      },
      {
        value: "12",
        label: "测试2"
      }
    ]
  },
  {
    code:'hide',
    label: '隐藏',
    show:false,
  }
];
