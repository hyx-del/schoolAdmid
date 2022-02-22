<template>
  <div>
    <formList
      :config="searchConfig"
      :itemList="searchList"
      :formInitData="searchData"
      @buttonClick="searchButton"
    />
    <Table
      ref="TableList"
      :loadData="getList"
      :column="column"
      :params="searchData"
      :showSortIndex="{ show: true, lable: '序号' }"
    >
    </Table>
  </div>
</template>

<script>
import formList from "@/components/FormList/index.vue";
import Table from "@/components/Table/index";
import { toRefs, ref, reactive, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { funList, getListHtml } from "@/utils/enum/select";
import { tabelFormConfig } from "@/utils/config";
import { staffAllStaffList } from "@/api/managerStaff";
// template
export default {
  components: {
    formList,
    Table
  },
  setup() {
    const router = useRouter();
    const TableList = ref(null);
    const state = reactive({
      // 搜索表单--搜索项
      searchList: [
        {
          code: "name",
          label: "员工"
        },
        {
          code: "mobile",
          label: "手机号",
          maxlength: 11
        }
      ],
      // 搜索表格--配置
      searchConfig: {
        ...tabelFormConfig,
        buttons: [
          {
            funType: "confirm",
            type: "primary",
            name: "查 询",
            size: "small"
          },
          {
            // perCode:'',
            funType: "add",
            name: "新 增",
            size: "small"
          }
        ]
      },
      // 搜索表格--数据
      searchData: {},
      // 搜索表格--按钮
      searchButton: val => {
        if (val.name == "add") {
          router.push({ path: "/template/add" });
        }
        if (val.name == "confirm" && val.valid) {
          TableList.value.update({ ...val.value });
        }
      },
      // table表单
      getList: staffAllStaffList,
      column: [
        { prop: "name", label: "姓名" },
        {
          prop: "functions",
          label: "职能",
          html: (row, val) => getListHtml(funList, val)
        },
        {
          prop: "action",
          label: "操作",
          fixed: "right",
          width: 220,
          actives: [
            {
              // 权限
              // perCode:'',
              name: "编辑",
              path: "/template/add"
            },
            {
              // 权限
              // perCode:'',
              name: "查看",
              path: "/template/detail"
            },
            {
              // 权限
              // perCode:'',
              name: "删除",
              method: row => {
                // deleteItem(row, staffRemoveStaffDelete, TableList, {
                //   params: { staffId: row.id }
                // })
              }
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
.find {
  margin-left: 10px;
  cursor: pointer;
  color: #2e8de6;
}
</style>
