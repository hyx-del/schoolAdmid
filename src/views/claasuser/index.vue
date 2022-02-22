<!--
 * @Author: aa
 * @Date: 2021-08-27 13:45:00
 * @LastEditors: 刘帝君
 * @LastEditTime: 2021-12-14 11:25:57
 * @Descripttion: 班级-学员管理
-->
<template>
  <div>
    <div class="title">
      <formList
        :config="config"
        :itemList="itemList"
        :formInitData="formInitData"
        @buttonClick="button"
      />
    </div>
    <div class="table">
      <Table
        ref="TableList"
        :loadData="getList"
        :column="column"
        :select="columnSelect"
        :params="formInitData"
        :showSortIndex="{ show: true, lable: '序号' }"
      />
    </div>
  </div>
</template>

<script>
import { toRefs, reactive, computed, ref } from "vue";
import formList from "@/components/FormList/index.vue";
import Table from "@/components/Table/index";
import { studentList, studentGraduation } from "@/api/school";
import { useRouter } from "vue-router";
import { genderList, getListHtml } from "@/utils/enum/select";
import { ElMessage } from "element-plus";

export default {
  components: {
    formList,
    Table
  },
  setup() {
    const router = useRouter();
    const TableList = ref(null);
    const state = reactive({
      formInitData: {},
      columnSelect: val => {
        state.columnSelectArr = [...val];
      },
      columnSelectArr: []
    });
    // 表单配置
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
          name: "搜索",
          size: "small"
        },
        {
          funType: "batch",
          type: "primary",
          name: "批量毕业",
          size: "small",
          perCode: "c0102a"
        }
      ]
    };
    const itemList = [
      {
        code: "keyword",
        label: "",
        placeholder: "搜索学员姓名和手机号"
      }
    ];
    const getList = computed(() => {
      return studentList;
    });
    // 搜索
    const button = val => {
      if (val.name === "confirm") {
        TableList.value.update({ ...val.value });
      } else if (val.name === "batch") {
        if (state.columnSelectArr && state.columnSelectArr.length) {
          studentGraduationFun(state.columnSelectArr.map(e => e.id));
          TableList.value.clearSelect();
        } else {
          ElMessage.error("请先勾选学员");
        }
      }
    };
    // 表格配置
    const column = reactive([
      // { prop: "id", label: "序号", width: "80" },
      {
        prop: "name",
        label: "姓名"
      },
      {
        prop: "mobile",
        label: "手机",
        width: 150,
        html: (row, val) => replace(val, 3)
      },
      {
        prop: "gender",
        label: "性别",
        html: (row, val) => getListHtml(genderList, val)
      },
      {
        prop: "statusName",
        label: "状态"
      },
      {
        prop: "degreeName",
        label: "注册等级"
      },
      {
        prop: "genre",
        label: "注册派别"
      },
      {
        prop: "company",
        label: "工作单位"
      },
      {
        prop: "weights",
        label: "权重"
      },
      {
        prop: "remark",
        label: "备注"
      },
      {
        prop: "action",
        label: "操作",
        width: 200,
        actives: [
          {
            name: "详情",
            method: val => {
              router.push({
                path: "/student/stuDetaile",
                query: { id: val.id, isDetails: 1 }
              });
            }
          },
          {
            perCode: "c0102a",
            name: row => (row.status !== 30 ? "毕业" : ""),
            method: row => {
              console.log(row, "毕业");
              studentGraduationFun([+row.id]);
            }
          }
        ]
      }
    ]);
    const replace = (name, index) => {
      const start = new Array(name.length).join("*");
      const end = name.slice(0, index);
      return end + start;
    };
    // 毕业
    const studentGraduationFun = arr => {
      studentGraduation({ studentIds: JSON.parse(JSON.stringify(arr)) }).then(
        ({ code }) => {
          if (code === 200) {
            ElMessage.success("操作成功");
            TableList.value.update();
          }
        }
      );
    };
    return {
      ...toRefs(state),
      config,
      getList,
      button,
      itemList,
      column,
      studentGraduationFun,
      TableList
    };
  }
};
</script>

<style lang="scss" scoped></style>
