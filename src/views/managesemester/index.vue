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
        :showSortIndex="{ show: true, lable: '序号' }"
      >
      </Table>
    </div>
  </div>
</template>

<script>
// managesemester 学期信息管理
import formList from "@/components/FormList/index.vue";
import Table from "@/components/Table/index";
import { toRefs, ref, reactive, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { tabelFormConfig, tabelFormConfig2 } from "../../utils/config";
import {
  categoryList,
  signUpList,
  stateList,
  categoryList2,
  onlineList,
  getListHtml,
  registerModeList
} from "@/utils/enum/select";
import {
  schoolSemesterDelete,
  semesterListBySchoolId,
  semesterStatusPut
} from "@/api/semester";
import { deleteItem, tableStatues } from "@/utils/tools";
import store from "@/store";
import { ElMessage, ElMessageBox } from "element-plus";

let online = [
  { value: "1", label: "上线", perCode: "s0101e" },
  { value: "-1", label: "下线", perCode: "s0101g" },
  { value: "0", label: "未发布", perCode: "s0101f" }
];
export default {
  components: {
    formList,
    Table
  },
  setup() {
    const router = useRouter();
    // 获取表格ref
    const TableList = ref(null);
    const state = reactive({
      // 头部搜索栏
      itemList: [
        {
          code: "name",
          label: "名称"
        },
        {
          el: "select",
          label: "类别",
          code: "category",
          list: categoryList
        },
        {
          el: "select",
          code: "registerMode",
          label: "报名方式",
          list: registerModeList
        },
        {
          el: "select",
          code: "status",
          label: "状态",
          list: onlineList
        },
        {
          el: "date",
          code: "register",
          label: "报名时间",
          otherCodeArr: ["registerStartAt", "registerEndAt"],
          dateType: "daterange"
        },
        {
          el: "date",
          code: "peixun",
          label: "培训时间",
          otherCodeArr: ["startDate", "endDate"],
          dateType: "daterange"
        }
      ],
      formInitData: {},
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
            perCode: "s0101a",
            funType: "add",
            name: "新 增",
            size: "small"
          }
        ]
      },
      button: val => {
        if (val.name == "add") {
          router.push({ path: "/semester/add" });
        }
        if (val.name == "confirm") {
          TableList.value.update({ ...val.value });
        }
      },
      // 表格
      getList: semesterListBySchoolId,
      column: [
        // { prop: "id", label: "序号", width: "80" },
        { prop: "name", label: "名称" },
        { prop: "register", label: "已报名" },
        {
          prop: "registerMode",
          label: "报名方式",
          html: (row, val) => getListHtml(registerModeList, val)
        },
        {
          prop: "category",
          label: "学期类别",
          html: (row, val) => getListHtml(categoryList2, val)
        },
        {
          prop: "status",
          label: "状态",
          width: 120,
          html: (row, val) => getListHtml(onlineList, val)
        },
        { prop: "createdAt", label: "创建时间" },
        {
          prop: "action",
          label: "操作",
          width: 300,
          actives: [
            {
              perCode: "s0101c",
              name: "详情",
              method: val => {
                router.push({
                  path: "/semester/detail",
                  query: { id: val.id }
                });
              }
            },
            {
              perCode: "s0101b",
              name: "编辑",
              method: val => {
                router.push({ path: "/semester/add", query: { id: val.id } });
              }
            },
            ...tableStatues(online, semesterStatusPut, TableList, {
              key: "status",
              del: {
                fun: schoolSemesterDelete,
                perCode: "s0101d"
              }
            })
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
