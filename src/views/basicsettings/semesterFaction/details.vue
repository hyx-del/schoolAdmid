<!--
 * @Author: 刘帝君
 * @Date: 2021-10-18 15:25:21
 * @LastEditors: 刘帝君
 * @LastEditTime: 2021-10-21 15:04:39
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
import { toRefs, ref, reactive, onMounted } from "vue";
import formShow from "@/components/FormList/detailShow";
import { useRoute } from "vue-router";
import { semesterFactionDetails } from "@/api/baseSet";

export default {
  components: { formShow },
  setup() {
    const id = useRoute().query.id;
    const state = reactive({
      itemList: [
        {
          code: "name",
          label: "派别名称"
        },
        {
          el: "img",
          code: "coverUrl",
          label: "封面图"
        },
        {
          el: "img",
          code: "posterUrl",
          label: "海报分享图"
        },
        {
          el: "img",
          code: "wxIconUrl",
          label: "微信分享图"
        },
        {
          code: "mainCourseEnable",
          label: "是否用于全面课程"
        }
      ],
      formInitData: {}
    });

    onMounted(() => {
      semesterFactionDetails({ id }).then(res => {
        const { code, data } = res;
        if (code == 200) {
          data.mainCourseEnable = data.mainCourseEnable == 0 ? "否" : "是";
          state.formInitData = data;
          console.log(data, "data");
        }
      });
    });

    return {
      ...toRefs(state)
    };
  }
};
</script>

<style lang="scss" scoped></style>
