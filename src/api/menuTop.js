/*
 * @Author: wei.chen
 * @Date: 2021-10-13 13:56:42
 * @LastEditors: 刘帝君
 * @LastEditTime: 2021-10-21 09:42:43
 * @Descripttion:
 */
import store from "@/store";
// 角色所属
export const menuType = {
  1: {
    name: "总部",
    type: "TEACHING",
    scope:'TEACHING_ADMIN'
  },
  2: {
    name: "学校",
    type: "TEACHING_SCHOOL",
    scope:'TEACHING_ADMIN_SCHOOL'
  },
  3: {
    name: "班级",
    type: "TEACHING_CLASS",
    scope:'TEACHING_ADMIN_CLASS'
  }
};
// 混入顶部的菜单参数
export const mixinMenu = (data, hasType = false) => {
  let parmat = {};
  let menuCut = store.getters.menuType;
  if (menuCut == 2) {
    parmat.schoolId = store.getters.activeSchoolId;
  }
  if (menuCut == 3) {
    parmat.schoolId = store.getters.activeSchoolId;
    parmat.classId = store.getters.activeClassId;
  }
  if (hasType) {
    parmat.type = menuType[menuCut].type;
  }
  return { ...data, ...parmat };
};
