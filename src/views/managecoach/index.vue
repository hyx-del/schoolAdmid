<!--
 * @Author: aa
 * @Date: 2021-08-27 11:29:06
 * @LastEditors: 刘帝君
 * @LastEditTime: 2021-11-01 16:09:16
 * @Descripttion: 教练管理
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
        :showSortIndex="{ show: true, lable: '序号' }"
        :loadData="getTableData"
        :column="column"
        :params="formInitData"
      />
    </div>
  </div>
</template>

<script>
import formList from "@/components/FormList/index.vue";
import Table from "@/components/Table/index";
import { toRefs, ref, reactive, computed } from "vue";
import { getCoachLevelListAPI } from "@/api/coach";
import { useRouter, useRoute } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { genderList, showGender } from "@/utils/enum/select";

export default {
  components: {
    formList,
    Table
  },
  setup() {
    const router = useRouter();
    const TableList = ref(null); // this.$refs.TableList
    const queryList = [
      {
        el: "input",
        label: "名称",
        code: "name"
      },
      {
        el: "input",
        label: "电话",
        code: "mobile"
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
      form: {
        label: ""
      },
      column: [
        { prop: "name", label: "姓名" },
        { prop: "mobile", label: "手机" },
        {
          prop: "gender",
          label: "性别",
          html: (row, val) => {
            if (showGender[val]) {
              return `<span >${showGender[val].label || ""}</span>`;
            } else {
              ("");
            }
          }
        },
        { prop: "entryTime", label: "入职时间" },
        { prop: "weights", label: "权重" },
        {
          prop: "action",
          label: "操作",
          width: 100,
          actives: [
            {
              perCode: "a0401a",
              name: "详情",
              method: val => {
                router.push({
                  path: "/coach/coachDetail",
                  query: { id: val.id }
                });
              }
            }
          ]
        }
      ]
    });

    const getTableData = computed(() => {
      return getCoachLevelListAPI;
    });
    const buttonCallBack = val => {
      console.log(val, "val");
      TableList.value.update({ ...val.value });
    };
    const gotoDetail = val => {
      router.push({ path: "/coach/coachDetail", query: { id: val.id } });
    };

    return {
      ...toRefs(state),
      queryList,
      config,
      getTableData,
      buttonCallBack,
      TableList,
      gotoDetail
    };
  }
};
</script>

<style lang="scss" scoped></style>
