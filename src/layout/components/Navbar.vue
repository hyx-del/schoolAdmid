<!--
 * @Author: aa
 * @Date: 2021-08-25 10:50:14
 * @LastEditors: 郑晶
 * @LastEditTime: 2021-11-18 13:46:15
 * @Descripttion:
-->
<template>
  <div class="navbar">
    <div class="logo">
      <img src="../../assets/logo.png" alt="" />
    </div>
    <div class="choice">
      <div
        :class="{ active: active == 1 }"
        @click="changeType(1)"
        v-if="isHeadquarters"
      >
        <span class="iconfont icon-icon-zongbu"></span>
        <span>总部</span>
      </div>
      <div
        :class="{ active: active == 2 }"
        @click="changeType(2)"
        v-if="schoolOptions.length"
      >
        <span class="iconfont icon-icon-xuexiao"></span>
        <span>学校</span>
        <el-select
          :disabled="active != 2"
          v-model="schoolId"
          placeholder="请选择"
          @change="changeSchool"
        >
          <el-option
            v-for="item in schoolOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </div>
      <div
        :class="{ active: active == 3 }"
        @click="changeType(3)"
        v-if="classOptions.length != 0"
      >
        <span class="iconfont icon-icon-banji"></span>
        <span>班级</span>
        <el-select
          v-model="classId"
          :disabled="active != 3"
          placeholder="请选择"
          @change="changeClass"
        >
          <el-option
            v-for="item in classOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="operation">
      <img class="portrait" src="../../assets/logo1.png" alt="" />
      <el-dropdown>
        <span class="el-dropdown-link">
          操作<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>{{ phone }}</el-dropdown-item>
            <el-dropdown-item @click="openChange">修改密码</el-dropdown-item>
            <el-dropdown-item @click="loginOut">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <popupForm
      v-model:show="dialogFormVisible"
      :formInitData="form"
      title="修改密码"
      :itemList="itemList"
      @confirm="confirm"
    />
  </div>
</template>

<script>
import { reactive, ref, toRefs, getCurrentInstance, watch } from "vue";
import { ElLoading, ElMessage } from "element-plus";
import store from "@/store";
import { useRouter, useRoute } from "vue-router";
import { constantRoutes } from "@/router/index";
import { headerClassListBySchollId } from "@/api/classManagement";
import { staffGetPermission } from "@/api/managerStaff";
import { log } from "@/utils";
import popupForm from "@/components/FormList/popupForm";
import { encryption } from "@/utils/util";
import { staffUpdatePasswordPost } from "@/api/user";

export default {
  name: "Navbar",
  components: {
    popupForm
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const router = useRouter();
    // 请求权限的类型 (角色所属 TEACHING (总部) TEACHING_SCHOOL(学校) TEACHING_CLASS(班级))
    const type = ["TEACHING", "TEACHING_SCHOOL", "TEACHING_CLASS"];
    const state = reactive({
      openChange: () => {
        state.dialogFormVisible = true;
      },
      dialogFormVisible: false,
      form: {},
      itemList: [
        {
          code: "newPassword",
          label: "新密码",
          showPassword: true
        },
        {
          code: "newPassword2",
          label: "确认密码",
          showPassword: true
        }
      ],
      ruleForm: {
        username: "",
        password: ""
      },
      confirm: value => {
        console.log(value);
        if (value.newPassword != value.newPassword2) {
          ElMessage.error("两次密码不一致");
          return;
        }
        const data = encryption({
          data: value,
          key: "4d3247ec362343b5acd489c327af7ada",
          iv: "acd489c327af7ade",
          param: ["newPassword"]
        });
        staffUpdatePasswordPost(data).then(res => {
          ElMessage.success("修改成功！");
          state.dialogFormVisible = false;
          router.push({ path: "/login" });
        });
      },
      phone: store.getters.phone,
      schoolOptions: store.getters.schoolList,
      classOptions: store.getters.classList || [],
      isHeadquarters: store.getters.isHeadquarters,
      schoolId: store.getters.activeSchoolId,
      classId: store.getters.activeClassId,
      active: store.getters.menuType,
      // 切换学校
      changeSchool: val => {
        if (state.active == 2) {
          staffGetPermission({ type: "TEACHING_SCHOOL", schoolId: val }).then(
            ({ code, data }) => {
              if (code === 200 && data) {
                const loading = ElLoading.service({
                  lock: true,
                  text: "loading",
                  spinner: "el-icon-loading",
                  background: "rgba(0, 0, 0, 0.1)"
                });
                // 设置路由权限
                store.commit("user/setPermMenu", {
                  s: data.menus.map(e => e.code)
                });
                // 设置按钮权限
                store.commit("user/setPermButtonList", {
                  s: data.buttons.map(e => e.code)
                });

                store.commit("app/setRefreshApp");
                // 设置选中的学校id
                store.commit("user/SET_activeSchoolId", val);
                // 修改班级列表的信息`
                // 根据学校id 去获取这个用户下面所有 对应这个学校下面的所有班级列表
                headerClassListBySchollId({ schoolId: val, size: 100 })
                  .then(res2 => {
                    if (res2.code == 200) {
                      console.log("app/setRefreshApp");
                      if (res2.data.length) {
                        let _data = [];
                        res2.data.forEach((item, index) => {
                          _data.push({ id: item.id, name: item.name });
                        });
                        // 然后将班级 塞入到
                        state.classOptions.splice(0, state.classOptions.length);
                        state.classOptions = _data;
                        state.classId = _data[0].id;
                        //  默认显示第一个班级
                        store.commit("user/SET_activeClassId", _data[0].id);
                        store.commit("user/setClassList", [..._data]);
                      } else {
                        // debugger
                        state.classOptions.splice(0, state.classOptions.length);

                        state.classId = "";
                        //  默认显示第一个班级
                        store.commit("user/SET_activeClassId", "");
                        store.commit("user/setClassList", []);
                      }
                      loading.close();
                    }
                  })
                  .catch(err => {
                    loading.close();
                  });
              }
            }
          );
        } else {
          const loading = ElLoading.service({
            lock: true,
            text: "loading",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.1)"
          });
          store.commit("app/setRefreshApp");
          // 设置选中的学校id
          store.commit("user/SET_activeSchoolId", val);
          // 修改班级列表的信息`
          // 根据学校id 去获取这个用户下面所有 对应这个学校下面的所有班级列表
          headerClassListBySchollId({ schoolId: val, size: 100 })
            .then(res2 => {
              if (res2.code == 200) {
                console.log("app/setRefreshApp");
                if (res2.data.length) {
                  let _data = [];
                  res2.data.forEach((item, index) => {
                    _data.push({ id: item.id, name: item.name });
                  });
                  // 然后将班级 塞入到
                  state.classOptions.splice(0, state.classOptions.length);
                  state.classOptions = _data;
                  state.classId = _data[0].id;
                  //  默认显示第一个班级
                  store.commit("user/SET_activeClassId", _data[0].id);
                  store.commit("user/setClassList", [..._data]);
                } else {
                  // debugger
                  state.classOptions.splice(0, state.classOptions.length);

                  state.classId = "";
                  //  默认显示第一个班级
                  store.commit("user/SET_activeClassId", "");
                  store.commit("user/setClassList", []);
                }
                loading.close();
              }
            })
            .catch(err => {
              loading.close();
            });
        }
      },
      // 切换班级
      changeClass: val => {
        if (state.active == 3) {
          staffGetPermission({ type: "TEACHING_CLASS", classId: val }).then(
            ({ code, data }) => {
              if (code === 200 && data) {
                console.log("============1");
                // 设置路由权限
                store.commit("user/setPermMenu", {
                  c: data.menus.map(e => e.code)
                });
                // 设置按钮权限
                store.commit("user/setPermButtonList", {
                  c: data.buttons.map(e => e.code)
                });

                store.commit("app/setRefreshApp");
                // 设置选中的班级id
                store.commit("user/SET_activeClassId", val);
              }
            }
          );
        } else {
          store.commit("app/setRefreshApp");
          // 设置选中的班级id
          store.commit("user/SET_activeClassId", val);
        }
      },
      // 切换总部，学校，班级
      changeType: val => {
        state.active = val;
        store.commit("app/setRefreshApp");
        store.commit("user/SET_menuType", val);
      },
      // 退出登录
      loginOut: val => {
        // 删除用户本地的token 然后跳转到登录界面,路由重新处理
        store.dispatch("user/logout").then(() => {
          //  跳转到login界面
          // proxy.$router.options.routes = [constantRoutes];
          router.push({ path: "/login" });
          location.reload();
        });
      }
    });

    watch(
      () => store.getters.menuType,
      newV => {
        state.active = newV;
      },
      { immediate: true, deep: true }
    );

    watch(
      () => store.getters.schoolList,
      (newV, oldV) => {
        // console.log(newV, "这是顶部学校newV");
        state.schoolOptions = newV;
      },
      { immediate: true, deep: true }
    );

    watch(
      () => store.getters.classList,
      (newV, oldV) => {
        // console.log(newV, "这是顶部班级");
        state.classOptions = newV;
      },
      { immediate: true, deep: true }
    );
    // 选中学校
    // watch(
    //   () => store.getters.activeSchoolId,
    //   newV => {
    //     state.active == 2 &&
    //       newV &&
    //       staffGetPermission({ type: "TEACHING_SCHOOL", schoolId: newV }).then(
    //         ({ code, data }) => {
    //           if (code === 200 && data) {
    //             // 设置按钮权限
    //             store.commit("user/setPermButtonList", {
    //               s: data.buttons.map(e => e.code)
    //             });
    //             // 设置路由权限
    //             store.commit("user/setPermMenu", {
    //               s: data.menus.map(e => e.code)
    //             });
    //           }
    //         }
    //       );
    //   },
    //   { immediate: true, deep: true }
    // );
    //选中班级
    // watch(
    //   () => store.getters.activeClassId,
    //   newV => {
    //     state.active == 3 &&
    //       newV &&
    //       staffGetPermission({
    //         type: "TEACHING_CLASS",
    //         schoolId: state.schoolId,
    //         classId: newV
    //       }).then(({ code, data }) => {
    //         if (code === 200 && data) {
    //           // 设置按钮权限
    //           store.commit("user/setPermButtonList", {
    //             c: data.buttons.map(e => e.code)
    //           });
    //           // 设置路由权限
    //           store.commit("user/setPermMenu", {
    //             c: data.menus.map(e => e.code)
    //           });
    //         }
    //       });
    //   },
    //   { immediate: true, deep: true }
    // );
    return {
      ...toRefs(state)
    };
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  width: 100%;
  height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .logo {
    width: 208px;
    height: 100%;
    background: #2e8de6;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .choice {
    flex: 1;
    display: flex;
    padding: 0 40px;
    > div {
      height: 48px;
      display: flex;
      align-items: center;
      background: #f5f5f5;
      font-size: 14px;
      color: #262626;
      padding: 0 20px;
      margin-right: 16px;
      cursor: pointer;
      > span {
        margin-right: 8px;
      }
      &.active {
        background: #e4f2ff;
        color: #2e8de6;
      }
    }
  }
  .operation {
    padding-right: 24px;
    display: flex;
    align-items: center;
    .portrait {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      margin-right: 8px;
    }
  }
}
</style>
