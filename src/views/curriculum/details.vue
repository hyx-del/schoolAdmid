<!--
 * @Author: 郑晶
 * @Date: 2021-09-02 15:22:12
 * @LastEditors: 刘帝君
 * @LastEditTime: 2021-11-17 17:01:06
 * @Descripttion: 
-->
<template>
  <div>
    <formShow
      ref="formShow"
      :formInitData="formInitData"
      :itemList="itemList"
    />
  </div>
</template>

<script>
import { toRefs, reactive } from "vue";
import formShow from "@/components/FormList/detailShow";
import { courseDetail } from "@/api/school";
import { useRoute } from "vue-router";
export default {
  components: { formShow },
  setup() {
    const itemList = [
      {
        code: "name",
        maxlength: 60,
        label: "课程名称"
      },
      {
        code: "type",
        label: "课程类型"
      },
      {
        el: "img",
        code: "picture",
        label: "课程图片",
        size: 2048,
        limit: 1
      },
      {
        el: "radio",
        code: "examine",
        label: "是否考核",
        list: [
          {
            value: "1",
            label: "是"
          },
          {
            value: "2",
            label: "否"
          }
        ]
      },
      {
        code: "duration",
        type: "number",
        lessCode: 1,
        label: "时长"
      },
      {
        code: "weights",
        label: "权重",
        type: "number",
        lessCode: 0
      },
      {
        el: "editer",
        code: "remark",
        label: "课程介绍"
      }
    ];
    const id = useRoute().query.id;
    const state = reactive({
      formInitData: {}
    });
    courseDetail({ id }).then(res => {
      const { code, data } = res;
      if (code == 200) {
        state.formInitData = data;
      }
    });
    return {
      itemList,
      id,
      ...toRefs(state)
    };
  }
};
</script>

<style lang="scss" scoped></style>
