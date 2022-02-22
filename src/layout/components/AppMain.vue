<!--
 * @Author: aa
 * @Date: 2021-08-25 10:50:52
 * @LastEditors: zx
 * @LastEditTime: 2021-11-19 14:17:55
 * @Descripttion:面包屑
-->
<template>
  <div class="main">
    <el-breadcrumb class="breadcrumbList" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item v-for="(item, index) in routeList" :key="index">
        {{item}}
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="main_layout_content" v-if="show">
      <router-view v-slot="{ Component }" :key="route.path">
        <transition name="fade-transform" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script>
import { computed, reactive, provide, ref, toRefs, nextTick, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import store from "@/store";
export default {
  setup() {
    const route = useRoute();
    // 更新标题
    const updateLastTitle = val => {
      state.title = val;
      state.setTitlePath = val;
      const activeRouters = useRoute();
      const len = activeRouters.matched.length - 1;
      state.setTitlePath = activeRouters.matched[len].path;
    };
    //组件内改变标题
    // const updateLastTitle= inject('updateLastTitle')
    // updateLastTitle(456)
    provide("updateLastTitle", updateLastTitle);
    const state = reactive({
      refreshApp: store.getters.refreshApp,
      show: true,
      title: "",
      setTitlePath:''
    });
    provide("lastTitle", state.title);
    const routeList = computed(() => {
      const activeRouters = useRoute();
      let len = activeRouters.matched.length - 1;
      let path = activeRouters.matched[len].path;
      let nameArr=activeRouters.matched.map(v=>v.meta.title)
      if (state.title &&state.setTitlePath== path) {
        nameArr[len] =  state.title;
      } else if (route.query.id &&path.includes("add")) {
        nameArr[len] = "编辑";
      }else{
        updateLastTitle('')
      }
      return nameArr
    });
    const topMenu = computed(() => {
      const _menu = store.getters.menuType;
      let menuName = "";
      switch (_menu) {
        case 1:
          menuName = "总部";
          break;
        case 2:
          menuName = "学校";
          break;
        case 3:
          menuName = "班级";
          break;
        default:
          break;
      }
      return menuName;
    });
    watch(
      () => store.getters.refreshApp,
      (val, oldVal) => {
        if (val !== oldVal) {
          //写入操作
          state.show = false;
          setTimeout(() => {
            state.show = true;
          }, 100);
        }
      }
    );
    return {
      ...toRefs(state),
      route,
      routeList,
      topMenu
    };
  }
};
</script>

<style lang="scss" scoped>
$pd: 20px;
.main {
  display: flex;
  box-sizing: border-box;
  flex-flow: wrap;
  width: 100%;
  height: 100%;
  padding: 0 $pd $pd $pd;
  background: #f5f5f5;
  .breadcrumbList {
    flex-shrink: 0;
    padding: 6px 0 12px 0;
  }
  .main_layout_content {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: calc(100% - #{$pd * 1.5});
    background-color: #fff;
    border-radius: 5px;
    overflow-y: auto;
    padding: $pd;
    //padding-bottom: 0;
  }
}
</style>
