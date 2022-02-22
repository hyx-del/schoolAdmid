/*
 * @Author: tianhao
 * @Date: 2020-06-12 17:14:55
 * @LastEditors: wei.chen
 * @LastEditTime: 2021-10-11 16:51:42
 * @Descripttion:
 */

import Vuex from "vuex";
import getters from "./getters";
import user from "./modules/user";
import app from "./modules/app";
import createPersistedState from "vuex-persistedstate";

const store = new Vuex.Store({
  modules: {
    user,
    app,
  },
  getters,
  plugins: [
    createPersistedState({
      storage: window.sessionStorage
    })
  ]
});

export default store;
