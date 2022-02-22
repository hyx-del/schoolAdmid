<!--
 * @Author: aa
 * @Date: 2021-08-27 13:41:42
 * @LastEditors: jiu yin zhen jing
 * @LastEditTime: 2021-11-04 10:33:35
 * @Descripttion: 成绩单
-->
<template>
  <div>
    <div class="title">
      <formList
        :config="config"
        :itemList="queryList"
        :formInitData="formInitData"
        @buttonClick="buttonCallBack"
      />
    </div>
    <div class="table">
      <Table
        ref="TableList"
        :loadData="getList"
        :column="column"
        :params="formInitData"
        :showSortIndex="{ show: true, lable: '序号' }"
      />
    </div>
  </div>
</template>

<script>
import formList from "@/components/FormList/index.vue";
import Table from "@/components/Table/index";
import { toRefs, ref, reactive, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { getStudentPositionListAPI, deleteItemAPI } from "@/api/baseSet";
export default {
  components: {
    formList,
    Table
  },
  setup() {
    const router = useRouter();
    const TableList = ref(null);

    const queryList = [
      {
        code: "keyword",
        label: "搜索",
        placeholder: "搜索学期和班级"
      }
    ];

    const config = {
      allRequired: false, // 是否全部必填
      inline: true, //行内
      colon: "",
      inputStyle: {
        width: "200px"
      },
      buttons: [
        {
          funType: "confirm",
          type: "primary",
          name: "查 询",
          size: "small"
        }
      ]
    };

    const state = reactive({
      formInitData: {},
      column: [
        //{ prop: "id",label: "序号",width: "80" },
        { prop: "label", label: "学期" },
        { prop: "label", label: "班级" },
        { prop: "label", label: "学员名" },
        { prop: "label", label: "综合得分" },
        { prop: "label", label: "操作人" },
        { prop: "label", label: "成绩审核状态" }
      ]
    });

    const getList = computed(() => {
      return getStudentPositionListAPI;
    });

    const buttonCallBack = val => {
      switch (val.text) {
        case "新增":
          console.log(val, "新增");
          router.push({ path: "/manageclass/classesAdd" });
          break;

        default:
          break;
      }
    };

    return {
      ...toRefs(state),
      queryList,
      config,
      getList,
      buttonCallBack
    };
  }
};
</script>

<style lang="scss" scoped></style>
