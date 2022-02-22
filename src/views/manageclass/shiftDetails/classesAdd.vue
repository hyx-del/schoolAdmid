<!--
 * @Author: 刘帝君
 * @Date: 2021-09-29 10:54:16
 * @LastEditors: 刘帝君
 * @LastEditTime: 2021-11-18 14:28:27
 * @Descripttion:
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
        :params="tableData"
        :select="selects"
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
import { divisionAddList, divisionAdd } from "@/api/classManagement";
import { reportStatusList, getListHtml } from "@/utils/enum/select";
import { ElMessage, ElMessageBox } from "element-plus";

export default {
  components: {
    formList,
    Table
  },
  props: {
    dataObj: Object
  },
  setup(props, { emit }) {
    const dataObj = props.dataObj;
    console.log(dataObj, "父组件");
    const router = useRouter();
    const TableList = ref(null);
    const queryList = [
      {
        code: "name",
        label: "搜索",
        placeholder: "搜索学员名"
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
        },
        {
          funType: "add",
          name: "批量添加",
          size: "small",
          perCode: "s0302c"
        }
      ]
    };

    // const semester = useRoute().query;
    const state = reactive({
      formInitData: {},
      tableData: {
        semesterId: dataObj.semesterId,
        classId: dataObj.id
      },
      checkbox: [],
      column: [
        // { prop: "id", label: "序号", width: "80" },
        { prop: "name", label: "学员名" },
        { prop: "mobile", label: "手机号" },
        {
          prop: "reportStatus",
          label: "报到状态",
          html: (row, val) => getListHtml(reportStatusList, val)
        }
      ]
    });

    const getList = computed(() => {
      return divisionAddList;
    });

    const buttonCallBack = val => {
      console.log(val, "新增");
      switch (val.text) {
        case "查 询":
          console.log(val, "查 询");
          TableList.value.update({ ...val.value });
          break;
        case "批量添加":
          const arr = [];
          state.checkbox.forEach(_val => {
            arr.push(_val.id);
          });
          const _data = {
            classId: dataObj.id,
            studentIds: arr
          };

          divisionAdd(_data).then(res => {
            if (res.code == 200) {
              ElMessage({
                type: "success",
                message: `操作成功`
              });
              console.log(res.data, "批量添加回调");

              emit("callbacks", false);
            } else {
              ElMessage({
                type: "error",
                message: `操作失败`
              });
            }
          });
          break;

        default:
          break;
      }
    };

    const selects = val => {
      state.checkbox = val;
      console.log(val, "val");
    };

    return {
      ...toRefs(state),
      queryList,
      config,
      getList,
      TableList,
      buttonCallBack,
      selects
    };
  }
};
</script>

<style lang="scss" scoped></style>
