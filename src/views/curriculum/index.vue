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
import {
  courseListClass,
  updateCourseStatus,
  deleteCourse
} from "@/api/school";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { deleteItem } from "@/utils/tools";
export default {
  components: {
    formList,
    Table
  },
  setup() {
    const router = useRouter();
    const TableList = ref(null);
    const itemList = [
      {
        code: "name",
        label: "",
        placeholder: "搜索课程名称或课程类型"
      },
      {
        el: "select",
        label: "状态",
        code: "status",
        list: [
          { value: "1", label: "正常" },
          { value: "-1", label: "禁用" }
        ]
      },
      {
        el: "select",
        label: "是否考核",
        code: "examine",
        list: [
          { value: "1", label: "考核" },
          { value: "0", label: "不考核" }
        ]
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
          name: "搜索",
          size: "small"
        }
        // {
        //   funType: "add",
        //   type: "primary",
        //   name: "新 增",
        //   size: "small"
        // }
      ]
    };
    const column = reactive([
      // { prop: "id",label: "序号",width: "80" },
      {
        prop: "name",
        label: "课程名称",
        width: 220,
        html: (row, name) => `<span class="a">${name}</span>`,
        click: row =>
          router.push({ path: "/curriculum/details", query: { id: row.id } })
      },
      { prop: "weights", label: "权重" },
      { prop: "type", label: "课程类型" },
      { prop: "createdAt", label: "创建时间", width: 200 },
      {
        prop: "status",
        label: "状态",
        html: (row, status) =>
          `<span style="color:${status === -1 && "red"}">${
            status === 1 ? "正常" : "禁用"
          }</span>`
      },
      {
        prop: "examine",
        label: "是否考核",
        html: (row, examine) => `<span>${examine ? "考核" : "不考核"}</span>`
      }
      // {
      //   prop: "action",
      //   label: "操作",
      //   width: 200,
      //   actives: [
      //     {
      //       name: "编辑",
      //       method: val => {
      //         router.push({
      //           path: "/curriculum/addCourse",
      //           query: { id: val.id }
      //         });
      //       }
      //     },
      //     {
      //       name: e => (e.status === 1 ? "禁用" : "启用"),
      //       method: val =>
      //         updateCourseStatus({ id: val.id, status: -val.status }).then(
      //           ({ code }) => {
      //             if (code === 200) {
      //               ElMessage.success("操作成功");
      //               TableList.value.update();
      //             }
      //           }
      //         )
      //     },
      //     {
      //       name: "删除",
      //       method: val => deleteItem(val, deleteCourse, TableList)
      //     }
      //   ]
      // }
    ]);
    const state = reactive({
      formInitData: {}
    });
    const getList = computed(() => {
      return courseListClass;
    });
    // 添加课程
    const button = val => {
      switch (val.text) {
        case "新 增":
          router.push({ path: "/curriculum/addCourse" });
          break;
        case "搜索":
          TableList.value.update({ ...val.value });
          break;
        default:
          break;
      }
    };
    return {
      ...toRefs(state),
      itemList,
      config,
      column,
      getList,
      button,
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
