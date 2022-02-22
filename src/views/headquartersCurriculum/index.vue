<!--
 * @Author: 刘帝君
 * @Date: 2021-10-08 13:48:33
 * @LastEditors: 刘帝君
 * @LastEditTime: 2021-11-09 14:44:38
 * @Descripttion:
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
import { courseList, updateCourseStatus, deleteCourse } from "@/api/school";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { deleteItem } from "@/utils/tools";
import { tabelFormConfig } from "@/utils/config";
import {
  courseStateList,
  examineList,
  genderList,
  getListHtml
} from "@/utils/enum/select";
export default {
  components: {
    formList,
    Table
  },
  setup() {
    const router = useRouter();
    const TableList = ref(null);
    const state = reactive({
      itemList: [
        {
          code: "name",
          label: "",
          placeholder: "搜索课程名称或课程类型"
        },
        {
          el: "select",
          label: "状态",
          code: "status",
          list: courseStateList
        },
        {
          el: "select",
          label: "是否考核",
          code: "examine",
          list: examineList
        }
      ],
      config: {
        ...tabelFormConfig,
        buttons: [
          {
            funType: "confirm",
            type: "primary",
            name: "查 询",
            size: "small"
          },
          {
            funType: "add",
            type: "primary",
            name: "新 增",
            size: "small",
            perCode: "a1001a"
          }
        ]
      },
      formInitData: {},
      // 添加课程
      button: val => {
        switch (val.text) {
          case "新 增":
            router.push({ path: "/headquartersCurriculum/addCurriculum" });
            break;
          case "查 询":
            TableList.value.update({ ...val.value });
            break;
          default:
            break;
        }
      },
      getList: courseList,
      column: [
        // { prop: "id", label: "序号", width: "80" },
        {
          prop: "name",
          label: "课程名称",
          width: 220
        },
        { prop: "weights", label: "权重" },
        { prop: "type", label: "课程类型" },
        { prop: "createdAt", label: "创建时间", width: 200 },
        {
          prop: "status",
          label: "状态",
          html: (row, val) => getListHtml(courseStateList, val)
        },
        {
          prop: "examine",
          label: "是否考核",
          html: (row, val) => getListHtml(examineList, val)
        },
        {
          prop: "action",
          label: "操作",
          width: 200,
          actives: [
            {
              perCode: "a1001b",
              name: "编辑",
              path: "/headquartersCurriculum/addCurriculum"
            },
            {
              perCode: "a1001c",
              name: "详情",
              method: val => {
                router.push({
                  path: "/headquartersCurriculum/detailsCurriculum",
                  query: { id: val.id }
                });
              }
            },
            {
              perCode: "a1001e",
              name: e => (e.status === 1 ? "禁用" : ""),
              method: val =>
                updateCourseStatus({ id: val.id, status: -val.status }).then(
                  ({ code }) => {
                    if (code === 200) {
                      ElMessage.success("操作成功");
                      TableList.value.update();
                    }
                  }
                )
            },
            {
              perCode: "a1001d",
              name: e => (e.status !== 1 ? "启用" : ""),
              method: val =>
                updateCourseStatus({ id: val.id, status: -val.status }).then(
                  ({ code }) => {
                    if (code === 200) {
                      ElMessage.success("操作成功");
                      TableList.value.update();
                    }
                  }
                )
            },
            {
              perCode: "a1001f",
              name: "删除",
              method: val => deleteItem(val, deleteCourse, TableList)
            }
          ]
        }
      ]
    });
    return {
      ...toRefs(state),
      TableList
    };
  }
};
</script>

<style lang="scss" scoped>
.name {
  cursor: pointer;
  color: #2e8de6;
}
</style>
