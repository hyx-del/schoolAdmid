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
    <popupForm
      v-model:show="popShow"
      v-model:formInitData="popFormInitData"
      :title="popTitle"
      :itemList="popItemList"
      :formConfig="popFormConfig"
      :buttonConfirm="buttonConfirm"
      @confirm="popConfirm"
    />
  </div>
</template>

<script>
import formList from "@/components/FormList/index.vue";
import popupForm from "@/components/FormList/popupForm.vue";
import Table from "@/components/Table/index";
import { toRefs, ref, reactive, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { funList, getListHtml } from "@/utils/enum/select";
import { tabelFormConfig } from "@/utils/config";
import { staffAllStaffList } from "@/api/managerStaff";
// template
export default {
  components: {
    popupForm,
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
          state.popShow = true;
          state.showState = 1;
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
              method: row => {
                state.popShow = true;
                state.showState = 2;
                state.popFormInitData = row;
              }
            },
            {
              // 权限
              // perCode:'',
              name: "查看",
              method: row => {
                state.popShow = true;
                state.showState = 3;
                state.popFormInitData = row;
              }
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
      ],
      // 新加编辑弹窗
      popTitle: computed(() => state.showStateObj[state.showState].title),
      buttonConfirm: computed(
        () => state.showStateObj[state.showState].buttonConfirm
      ),
      popFormConfig: {
        defalt: {
          disabled: computed(() => (state.showState == 3 ? true : false))
        },
        buttons: []
      },
      showState: 1,
      showStateObj: {
        1: {
          title: "新加",
          buttonConfirm: "确认"
        },
        2: {
          title: "编辑",
          buttonConfirm: "确认"
        },
        3: {
          title: "查看",
          buttonConfirm: ""
        }
      },
      popShow: false,
      popFormInitData: {},
      popItemList: [
        {
          code: "name",
          label: "员工"
        },
        {
          code: "mobile",
          label: "手机号",
          maxlength: 11,
          checkType:''
        }
      ],
      // 确认
      popConfirm: data => {
        console.log(data);
      }
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
