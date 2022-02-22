<!--
 * @Author: aa
 * @Date: 2021-08-19 17:40:16
 * @LastEditors: aa
 * @LastEditTime: 2021-08-25 09:54:01
 * @Descripttion: 
-->
<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <div v-for="(item, index) of data" :key="index">{{ item }}</div>
    <div @click="add">{{ num }}</div>
    <el-button type="primary">主要按钮</el-button>
    <el-input v-model="input" placeholder="请输入内容"></el-input>
  </div>
</template>

<script>
// @ is an alias to /src
import { reactive, toRefs } from "vue";
export default {
  name: "Home",
  setup() {
    const state = reactive({
      data: [1, 2, 3],
      num: 1,
      list: { id: 1, name: "里斯" },
      input: ""
    });
    const add = () => {
      state.num++;
      console.log(state.list);
    };
    return {
      ...toRefs(state),
      add
    };
  }
};
</script>
