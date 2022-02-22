/*
 * @Author: aa
 * @Date: 2021-08-20 10:15:08
 * @LastEditors: 郑晶
 * @LastEditTime: 2021-11-30 13:17:02
 * @Descripttion:
 */
import { login, logout, getUserInfo, getMenuInfo } from "@/api/user";
import { getTopHeaderSchoolList } from "@/api/school";
import { headerClassListBySchollId } from "@/api/classManagement";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { staffGetPermission } from "@/api/managerStaff";
import store from "@/store";
// import { resetRouter } from "@/router";
// import getRouterList from "@/router/router";

const getDefaultState = () => {
  return {
    token: "",
    threesSideToken: "", // 第三方token
    name: "",
    avatar: "",
    phone: null,
    menuType: 1, // 默认1: 总部  ,  2 表示学校   3 表示班级
    menuList: [],
    studentsPermissions: [], //学员管理按钮权限
    permMenu: {
      // 用户在切换学校或者切换班级的时候，就切换这里的s,c 对应的菜单由这里来生成
      a: [], // 用户在总部拥有的菜单code
      s: [], // 用户在学校拥有的菜单code
      c: [] // 用户在班级拥有的菜单code
    },
    permButtonList: {
      // 用户在切换学校或者切换班级的时候，就切换这里的s,c 对应的按钮由这里来生成
      a: [], // 用户在总部拥有的按钮code
      s: [], // 用户在学校拥有的按钮code
      c: [] // 用户在班级拥有的按钮code
    },
    permButtons: [], // 当前用户总部 ,激活的学校 ,激活的班级 按钮权限列表
    isHeadquarters: true,
    schoolList: [], // 拥有的学校列表
    classList: [], // 拥有的班级列表
    activeSchoolId: null, // 选中的学校id
    activeClassId: null // 选中的班级id
  };
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: state => {
    Object.assign(state, getDefaultState());
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_PHONE: (state, avatar) => {
    state.phone = avatar;
  },

  SET_headquarters: (state, status) => {
    state.isHeadquarters = status;
  },
  SET_menuType: (state, menuType) => {
    state.menuType = menuType;
  },
  SET_activeSchoolId: (state, activeSchoolId) => {
    state.activeSchoolId = activeSchoolId;
  },
  SET_activeClassId: (state, activeClassId) => {
    state.activeClassId = activeClassId;
  },

  setMenuList: (state, menuList) => {
    state.menuList = menuList;
  },
  setSchoolList: (state, schoolList) => {
    state.schoolList = [...schoolList];
  },
  setClassList: (state, classList) => {
    state.classList.splice(0, state.classList.length);
    state.classList = [...classList];
  },
  setStuPermissions: (state, stuList) => {
    state.studentsPermissions = [...stuList];
  },
  // 权限菜单
  setPermMenu: (state, permMenu) => {
    // debugger;
    state.permMenu = { ...state.permMenu, ...permMenu };
  },
  // 权限按钮
  setPermButtonList: (state, permButtonList) => {
    state.permButtonList = { ...state.permButtonList, ...permButtonList };
  }
};

const actions = {
  // user login
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo)
        .then(response => {
          const data = response;
          // TODO 获取第三方的token
          console.log(data, "data");
          if (data) {
            // TODO 获取用户基本信息

            commit("SET_TOKEN", data.access_token);
            commit("SET_PHONE", data.user_info.mobile);
            setToken(data.access_token);
            sessionStorage.setItem("school_Authorization", data.access_token);
            sessionStorage.setItem("userids", data.user_info.id);

            resolve();
          } else {
            reject(response);
          }
        })
        .catch(error => {
          // debugger
          console.log("error", error);
          reject(error);
        });
    });
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getUserInfo(state.token)
        .then(response => {
          const { data } = response;

          if (!data) {
            reject("校验失败，请重新登录");
          }
          const { name, avatar } = data.admin;
          commit("SET_NAME", name);
          commit("SET_AVATAR", avatar);
          resolve(data);
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // 默认获取学校的权限 or 班级的权限
  setSchoolOrClassPermission({ commit }, pid, type = "TEACHING_SCHOOL") {
    // debugger;
    let _par = {
      type: type
    };
    if (type == "TEACHING_SCHOOL") {
      _par.schoolId = pid;
    } else if (type == "TEACHING_CLASS") {
      _par.classId = pid;
    }
    staffGetPermission(_par)
      .then(({ code, data }) => {
        if (code === 200 && data) {
          if (type == "TEACHING_SCHOOL") {
            // 设置路由权限
            commit("setPermMenu", {
              s: data.menus.map(e => e.code)
            });
            // 设置按钮权限
            commit("setPermButtonList", {
              s: data.buttons.map(e => e.code)
            });
          } else if (type == "TEACHING_CLASS") {
            // 设置路由权限
            commit("setPermMenu", {
              c: data.menus.map(e => e.code)
            });
            // 设置按钮权限
            commit("setPermButtonList", {
              c: data.buttons.map(e => e.code)
            });
          }
        }
      })
      .catch(err => {});
  },
  // 获取顶部，默认用户所有的学校权限列表
  getUserHaveSchoolList(context) {
    getTopHeaderSchoolList({ size: 1000, current: 1, enable: 1 }).then(res => {
      if (res.code == 200) {
        context.commit("setSchoolList", res.data);
        if (res.data.length) {
          let _activeSchoolId = state.activeSchoolId
            ? state.activeSchoolId
            : res.data[0].id;

          // 根据学校id 去获取这个用户下面所有 对应这个学校下面的所有班级列表
          headerClassListBySchollId({
            schoolId: _activeSchoolId
          }).then(res2 => {
            if (res2.code == 200) {
              if (res2.data.length) {
                // 然后将班级 塞入到
                context.commit("setClassList", res2.data);
                //  默认显示第一个班级
                context.commit("SET_activeClassId", res2.data[0].id);
              }
            }
          });
        }
      }
    });
  },

  // 刷新顶部班级的列表信息
  getUserHaveClassList(context, schoolId) {
    console.log(schoolId, "学校id");
    // 根据激活的学校id 去获取这个用户下面所有 对应这个学校下面的所有班级列表
    headerClassListBySchollId({
      schoolId: schoolId
    }).then(res2 => {
      if (res2.code == 200) {
        if (res2.data.length) {
          let _activeClassId = state.activeClassId
            ? state.activeSchoolId
            : res2.data[0].id;
          // 然后将班级 塞入到
          // debugger;
          context.commit("setClassList", res2.data);
          //  默认显示第一个班级
          context.commit("SET_activeClassId", _activeClassId);

          actions.setSchoolOrClassPermission(
            context,
            _activeClassId,
            "TEACHING_CLASS"
          );
        }
      }
    });
  },

  // 获取顶部 默认第一所学校下面的所有的班级列表

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      // logout(state.token)
      // 	.then(() => {
      removeToken(); // must remove  token  first
      //   resetRouter();
      commit("RESET_STATE");
      commit("SET_TOKEN", null);
      removeToken();
      // 清楚所有  sessionStorage 里面的数据
      sessionStorage.clear();
      resolve();
      // })
      // .catch(error => {
      // 	reject(error)
      // })
    });
  },
  getMenuInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getMenuInfo()
        .then(res => {
          if (res.code === 200) {
            // 设置菜单权限
            const _tempArray = [];
            res.data.roles[0].menus.forEach(item => {
              _tempArray.push(item.code);
            });
            sessionStorage.setItem("role_router", JSON.stringify(_tempArray));
            resolve();
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken(); // must remove  token  first
      commit("RESET_STATE");
      resolve();
    });
  },
  // 获取总部权限code 并设置到 vuex 里面
  setHeadquarters({ commit }, hasTeaching) {
    commit("SET_headquarters", hasTeaching);
    if (hasTeaching) {
      // 有总部权限，请求相应code
      staffGetPermission({ type: "TEACHING" }).then(({ code, data }) => {
        if (code === 200 && data) {
          commit("setPermMenu", { a: data.menus.map(e => e.code) });
          commit("setPermButtonList", { a: data.buttons.map(e => e.code) });
        }
      });
    } else {
      commit("SET_menuType", 2);
    }
  },
  // 设置顶部学校列表，并获取第一个学校下面 有权限的班级列表
  setAllSchoolList({ commit }, schoolList) {
    return new Promise(resolve => {
      commit("setSchoolList", schoolList);
      if (schoolList.length) {
        commit("SET_activeSchoolId", schoolList[0].id);
        // 默认激活班级的全安心班级的权限
        actions.setSchoolOrClassPermission(
          { commit },
          schoolList[0].id,
          "TEACHING_SCHOOL"
        );
        // 根据学校id 去获取这个用户下面所有 对应这个学校下面的所有班级列表
        headerClassListBySchollId({
          schoolId: schoolList[0].id
        }).then(res2 => {
          if (res2.code == 200) {
            if (res2.data.length) {
              // 然后将班级 塞入到
              commit("setClassList", res2.data);
              //  默认显示第一个班级
              commit("SET_activeClassId", res2.data[0].id);
              // 默认激活班级的全安心班级的权限
              actions.setSchoolOrClassPermission(
                { commit },
                res2.data[0].id,
                "TEACHING_CLASS"
              );
            }
          }
        });
      }
      resolve();
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
