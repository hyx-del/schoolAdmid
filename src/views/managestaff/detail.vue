<!--
 * @Author: zx
 * @Date: 2021-09-02 14:05:19
 * @LastEditors: 刘帝君
 * @LastEditTime: 2021-11-04 20:43:25
 * @Descripttion:
-->
<template>
  <div class="">
    <detailShow :formState="formState" :formInitData="formInitData" :itemList="itemList" />
  </div>
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
import { staffGetPermission, staffGetStaffInfo } from "@/api/managerStaff";

export default {
  components: {
    detailShow
  },
  porps: [],
  setup() {
    const state = reactive({
      formState: [],
      formInitData: {},
      itemList: JSON.parse(JSON.stringify(itemList))
    });
    const id = useRoute().query.id;
    staffGetStaffInfo({ id }).then(({ code, data }) => {
      if (code == 200) {
        data.displayPhotos = JSON.parse(data.displayPhotos);
        if (data.type==2) {
          state.formState=  [{code:'conversionDate',show:true}]
        }
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
