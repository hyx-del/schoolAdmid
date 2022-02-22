/*
 * @Author: wei.chen
 * @Date: 2020-06-20 18:55:32
 * @LastEditors: 刘帝君
 * @LastEditTime: 2021-11-16 11:38:15
 * @Descripttion:
 */

const getters = {
  refreshApp: state => state.app.refreshApp,
  payChannel: state => state.app.payChannel,
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  upLoadToken: state => state.app.upLoadToken,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  phone: state => state.user.phone,
  name: state => state.user.name,
  // menuList: state => state.user.menuList,
  isHeadquarters: state => state.user.isHeadquarters,
  schoolList: state => state.user.schoolList,
  classList: state => state.user.classList,

  menuType: state => state.user.menuType,
  activeSchoolId: state => state.user.activeSchoolId,
  activeClassId: state => state.user.activeClassId,
  permButtons: state => state.user.permButtons,
  studentsPermissions: state => state.user.studentsPermissions,
  permMenu: state => state.user.permMenu,
  menuList: state => state.user.menuList,
  permButtonList: state => state.user.permButtonList
};
export default getters;
