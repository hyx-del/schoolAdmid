/*
 * @Author: aa
 * @Date: 2021-08-20 16:52:00
 * @LastEditors: wei.chen
 * @LastEditTime: 2021-10-14 15:20:12
 * @Descripttion:
 */

import { payChannel } from "@/utils/enum/select";

const state = {
  upLoadToken: {},
  refreshApp: Number,
  payChannel: Array
};

const mutations = {
  SET_UPLOAD_TOKEN: (state, token) => {
    state.upLoadToken = token;
  },
  setRefreshApp: (state, token) => {
    state.refreshApp = Math.random();
  },
  setPayChannel: (state, list) => {
    state.payChannel = list;
  }
};

const actions = {
  updateOSSToken({ commit }, token) {
    commit("SET_UPLOAD_TOKEN", token);
  },
  upRefreshApp({ commit }, token) {
    commit("setRefreshApp", Math.random());
  },
  setPayChannels({ commit }, list) {
    commit("setPayChannel", list);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
