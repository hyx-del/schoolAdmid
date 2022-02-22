/*
 * @Author: aa
 * @Date: 2021-08-20 13:40:48
 * @LastEditors: zx
 * @LastEditTime: 2021-11-18 15:48:28
 * @Descripttion:
 */
import { createRouter, createWebHistory } from "vue-router";
import Layout from "@/layout";
import getRouterList from "@/utils/router";
import { getToken } from "@/utils/auth";

export const constantRoutes = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login/index")
  },
  {
    path: "/404",
    component: () => import("@/views/404")
  },
  // template 模板
  {
    path: "/template",
    component: () => import("@/views/template/index")
  },
  {
    path: "/template2",
    component: () => import("@/views/template2/index")
  },
  {
    hidden: true,
    path: "/template/add",
    component: () => import("@/views/template/add")
  },
  {
    hidden: true,
    path: "/template/detail",
    component: () => import("@/views/template/detail")
  },
  {
    path: "/",
    redirect: "dashboard",
    component: Layout,
    children: [
      {
        path: "dashboard",
        name: "dashboard",
        component: () => import("@/views/home/index"),
        meta: { title: "首页", icon: "dashboard" }
      },

    ]
  },

  {
    path: "/test",
    component: () => import("@/views/test")
  },
  // 404 page must be placed at the end !!!
  { path: "/:catchAll(.*)", redirect: "/404", hidden: true }
];
let allRouters = [];

if (getRouterList()) {
  allRouters = constantRoutes.concat(getRouterList());
} else {
  allRouters = constantRoutes;
}
const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ y: 0 }),
  routes: allRouters
});

// 路由检查
// TODO 后面需要检查 路由权限  第二期优化
// 如果当前界面有code 编号就需要过滤当前code 是否在他权限的范文之内(store.getters.perMenuList)，如果不是就不做跳转
router.beforeEach((to, from, next) => {
  //根据Token判断是否路由过滤
  if (getToken() !== null) {
    next();
  } else {
    //防止无限循环
    if (to.name === "login") {
      next();
      return;
    }
    next({
      path: "/login"
    });
  }
});

router.onError(err => {
  const pattern = /Loading chunk (\d)+ failed/g;
  const isChunkLoadFailed = err.message.match(pattern);
  if (isChunkLoadFailed) {
    let chunkBool = sessionStorage.getItem("chunkError");
    let nowTimes = Date.now();
    if (
      chunkBool === null ||
      (chunkBool && nowTimes - parseInt(chunkBool) > 60000)
    ) {
      //路由跳转报错,href手动跳转
      sessionStorage.setItem("chunkError", "reload");
      const targetPath = routers.history.pending.fullPath;
      window.location.href = window.location.origin + targetPath;
    } else if (chunkBool === "reload") {
      //手动跳转后依然报错,强制刷新
      sessionStorage.setItem("chunkError", Date.now());
      window.location.reload(true);
    }
  }
});
export { allRouters };

export default router;
