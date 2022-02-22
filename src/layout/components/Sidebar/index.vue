<!--
 * @Author: aa
 * @Date: 2021-08-25 10:53:37
 * @LastEditors: 郑晶
 * @LastEditTime: 2021-11-18 11:19:52
 * @Descripttion: 
-->
<template>
  <div class="menu">
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        class="el-menu-vertical-demo"
        router
        @select="handleSelect"
        @open="handleOpen"
        @close="handleClose"
      >
        <sidebar-item
          v-for="route in menuList"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        ></sidebar-item>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import {
  reactive,
  toRefs,
  getCurrentInstance,
  computed,
  watch,
  watchEffect
} from "vue";
import { useRouter, useRoute } from "vue-router";
import store from "@/store";
import { array, log } from "@/utils";
import { isExternal } from "@/utils/validate";
import sidebarItem from "./sidebarItem";
import router, { allRouters } from "@/router";
export default {
  name: "Sider",
  components: {
    sidebarItem
  },
  setup() {
    const route = useRoute();
    const { proxy } = getCurrentInstance();
    const state = reactive({
      menu: proxy.$router.options.routes,
      userRouter: store.getters.menuList,
      isHeadquarters: store.getters.isHeadquarters,
      permMenu: store.getters.permMenu
    });
    let menuList = computed(() => {
      let _tempRouter = [];
      // 周一再放开
      allRouters.forEach(value => {
        // 过滤掉登录、404等路由
        if (value.meta) {
          // 过滤掉没有权限的路由
          if (store.getters.menuType == 1) {
            value.meta.code.map(code => {
              if (store.getters.permMenu.a.indexOf(code) !== -1) {
                // 总部
                value.children = value.children.filter(item => {
                  let isOk = false;
                  item.meta &&
                    item.meta.code &&
                    item.meta.code.map(e => {
                      if (store.getters.permMenu.a.indexOf(e) !== -1) {
                        isOk = true;
                      }
                    });
                  return isOk;
                });
                if (
                  value.meta.code.join(",").indexOf("a") !== -1 &&
                  value.children &&
                  value.children.length
                ) {
                  _tempRouter.push(value);
                }
              }
            });
          }
          if (store.getters.menuType == 2) {
            value.meta.code.map(code => {
              if (store.getters.permMenu.s.indexOf(code) !== -1) {
                // 学校
                // value.children = value.children.filter(e => e.meta.code);
                value.children = value.children.filter(item => {
                  let isOk = false;
                  item.meta &&
                    item.meta.code &&
                    item.meta.code.map(e => {
                      if (store.getters.permMenu.s.indexOf(e) !== -1) {
                        isOk = true;
                      }
                    });
                  return isOk;
                });
                if (
                  value.meta.code.join(",").indexOf("s") !== -1 &&
                  value.children &&
                  value.children.length
                ) {
                  _tempRouter.push(value);
                }
              }
            });
          }
          if (store.getters.menuType == 3) {
            // 循环外层
            value.meta.code.map(code => {
              if (store.getters.permMenu.c.indexOf(code) !== -1) {
                // 班级
                // value.children.map(item => {
                //   if(item.meta && item.meta.code){
                // store.getters.permMenu.c.indexOf(item.meta.code) !== -1
                //   }
                // });
                value.children = value.children.filter(item => {
                  let isOk = false;
                  item.meta &&
                    item.meta.code &&
                    item.meta.code.map(e => {
                      if (store.getters.permMenu.c.indexOf(e) !== -1) {
                        isOk = true;
                      }
                    });
                  return isOk;
                });
                if (
                  value.meta.code.join(",").indexOf("c") !== -1 &&
                  value.children &&
                  value.children.length
                ) {
                  _tempRouter.push(value);
                }
              }
            });
          }
        }
      });
      // if (_tempRouter[0]) {
      //   const { path, children } = _tempRouter[0];
      //   const str = `${path}/${children ? children[0].path : ""}`;
      //   useRouter().push(str);
      // } else {
      //   useRouter().push("/dashboard");
      // }
      // debugger;
      // console.log("===============2=======");
      // console.log("store.getters.menuType", store.getters.menuType);
      // console.log("state.permMenu", state.permMenu);
      // console.log("_tempRouter", _tempRouter);
      return _tempRouter;
    });
    const activeMenu = computed(() => {
      // if (route.query.menu) {
      //   return route.path;
      // } else {
      const activeRouters = useRoute();
      return activeRouters.matched[0].path;
      // }
    });
    const handleOpen = val => {
      console.log(val, "点击");
    };
    const handleSelect = val => {
      console.log(val, "这是handleSelect");
    };
    const handleClose = () => {};
    watch(
      () => store.getters.menuType,
      () => {
        if (menuList.value[0]) {
          const { path, children } = menuList.value[0];
          const str = `${path}/${children ? children[0].path : ""}`;
          router.push(str);
        } else {
          router.push("/dashboard");
        }
      }
    );
    // 选中学校变化
    watch(
      () => store.getters.activeSchoolId,
      () => {
        if (menuList.value[0]) {
          const { path, children } = menuList.value[0];
          const str = `${path}/${children ? children[0].path : ""}`;
          router.push(str);
        } else {
          router.push("/dashboard");
        }
      },
      { immediate: true, deep: true }
    );
    // 选中班级变化
    watch(
      () => store.getters.activeClassId,
      () => {
        if (menuList.value[0]) {
          const { path, children } = menuList.value[0];
          const str = `${path}/${children ? children[0].path : ""}`;
          router.push(str);
        } else {
          router.push("/dashboard");
        }
      },
      { immediate: true, deep: true }
    );
    return {
      ...toRefs(state),
      handleOpen,
      handleClose,
      menuList,
      activeMenu,
      handleSelect
    };
  }
};
</script>

<style lang="scss" scoped>
.menu {
  width: 208px;
  height: 100%;
  .el-menu-vertical-demo {
    height: 100%;
  }
}
</style>
