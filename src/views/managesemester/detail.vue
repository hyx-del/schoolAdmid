<!--
 * @Author: zx
 * @Date: 2021-09-02 14:05:19
 * @LastEditors: wei.chen
 * @LastEditTime: 2021-10-19 10:58:23
 * @Descripttion:
-->
<template>
  <emptyBox bottom="30">
    <detailShow :formInitData="formInitData" :itemList="itemList" />
  </emptyBox>
</template>

<script>
/*
 * add组件说明
 * 新增编辑 学期
 *
 * */
import detailShow from "@/components/FormList/detailShow";
import { toRefs, ref, reactive, computed } from "vue";
import { itemList } from "./itemList";
import { useRoute } from "vue-router";
import { semesterDetail } from "@/api/semester";
import emptyBox from "@/components/emptyBox";

export default {
  components: {
    detailShow,
    emptyBox
  },
  porps: [],
  setup() {
    const state = reactive({
      formInitData: {},
      itemList: JSON.parse(JSON.stringify(itemList)),
      // itemList: { ...itemList }
    });
    const id = useRoute().query.id;
    semesterDetail({ id }).then(({ code, data }) => {
      if (code == 200) {
        console.log(data);
        state.formInitData = data;
      }
    });
    return {
      ...toRefs(state)
    };
  }
};
</script>

<style scoped></style>
