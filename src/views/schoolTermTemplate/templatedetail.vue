<!--
 * @Author: aa
 * @Date: 2021-08-31 13:09:20
 * @LastEditors: 刘帝君
 * @LastEditTime: 2021-10-25 17:23:22
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
import { toRefs, ref, reactive } from "vue";
import formShow from "@/components/FormList/detailShow";
import { templatedetail } from "@/api/headquarters";
import { useRoute } from "vue-router";
import { semesterFactionListAPIs } from "@/api/baseSet";
export default {
  components: { formShow },
  setup() {
    const itemList = [
      {
        code: "name",
        label: "模板名称"
      },
      {
        label: "类别",
        code: "category",
        list: [
          { value: "1", label: "常规任务" },
          { value: "2", label: "工作坊" },
          { value: "3", label: "名师培训" }
        ]
      },
      {
        code: "semesterCategoryName",
        label: "学期派别"
      },
      {
        el: "img",
        code: "picture",
        label: "封面图"
      },
      {
        el: "img",
        code: "posterPicture",
        label: "海报分享图"
      },
      {
        el: "img",
        code: "wxPicture",
        label: "微信分享图",
        size: 1024,
        limit: 1
      },
      {
        code: "contact",
        type: "phone",
        label: "联系电话"
      },
      {
        code: "number",
        label: "报名名额"
      },
      {
        code: "tuition",
        label: "报名费"
      },
      {
        el: "radio",
        code: "isContainQuarterage",
        label: "是否提供住宿",
        allSelectCode: "radio_label",
        deleteArr: [
          [1, "tips"],
          [2, ""]
        ],
        list: [
          {
            label: "是",
            value: 1
          },
          {
            label: "否",
            value: -1
          }
        ]
      },
      {
        el: "radio",
        code: "registerMode",
        label: "报名方式",
        allSelectCode: "radio_label",
        list: [
          {
            label: "定金",
            value: 10
          },
          {
            label: "全款",
            value: 20
          }
        ]
      },
      {
        code: "deposit",
        label: "押金",
        required: false
      },
      {
        el: "editer",
        code: "introduction",
        label: "学期介绍"
      }
    ];
    const id = useRoute().query.id;
    const state = reactive({
      formInitData: {}
    });
    templatedetail({ id }).then(res => {
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
