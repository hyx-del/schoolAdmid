<!--
 * @Author: 刘帝君
 * @Date: 2021-09-23 10:09:51
 * @LastEditors: 刘帝君
 * @LastEditTime: 2021-11-24 17:51:31
 * @Descripttion: 优惠券
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
    <el-dialog v-model="dialogVisible" :title="title" width="40%">
      <formList
        :config="addFormConfig"
        :itemList="itemListDialog"
        :formInitData="formInitDataDialog"
        @buttonClick="buttonDialog"
      >
        <template v-slot:afterSlot2>
          <span> 元</span>
        </template>
      </formList>
    </el-dialog>

    <el-dialog v-model="dialogVisibles" title="详情" width="40%">
      <formList
        :config="configs"
        :itemList="itemListDialogs"
        :formInitData="formInitDataDialog"
        @buttonClick="buttonDialogs"
      >
        <template v-slot:afterSlot2>
          <span> 元</span>
        </template>
      </formList>
    </el-dialog>
  </div>
</template>

<script>
import formList from "@/components/FormList/index.vue";
import Table from "@/components/Table/index";
import { toRefs, ref, reactive, computed } from "vue";
import {
  couponManagementList,
  couponManagementEnable,
  couponManagementDelete,
  couponManagementAdd,
  couponManagementUpdata,
  couponManagementSingle
} from "@/api/discount";
import { addFormConfig } from "@/utils/config";
import { ElMessage, ElMessageBox } from "element-plus";

export default {
  components: {
    formList,
    Table
  },
  setup() {
    const dialogVisible = ref(false);
    const dialogVisibles = ref(false);
    const TableList = ref(null);
    const state = reactive({
      formInitData: {},
      formInitDataDialog: {},
      title: "",
      used: null,
      form: {
        discountName: "",
        discountRatio: ""
      }
    });
    // 表单按钮
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
          funType: "add",
          name: "添加",
          size: "small",
          perCode: "a0901d"
        }
      ]
    };
    // 表单状态
    const itemList = [
      {
        el: "select",
        label: "状态",
        code: "enable",
        list: [
          { value: "0", label: "禁用" },
          { value: "1", label: "启用" }
        ]
      }
    ];
    // 表单点击
    const button = val => {
      switch (val.text) {
        case "添加":
          state.title = "新增";
          state.formInitDataDialog = {
            name: "",
            money: ""
          };
          dialogVisible.value = true;
          break;
        case "搜索":
          TableList.value.update({ ...val.value });
          break;
        default:
          break;
      }
    };
    // 表格数据
    const getList = computed(() => {
      return couponManagementList;
    });
    // 表格表头
    const column = reactive([
      // { prop: "id", label: "序号", width: "80" },
      { prop: "name", label: "名称" },
      {
        prop: "enable",
        label: "状态",
        html: (row, val) =>
          `<span style="color:${val === 0 && "red"}">${
            val === 1 ? "启用" : "禁用"
          }</span>`
      },
      {
        prop: "createdAt",
        label: "创建日期"
      },
      {
        prop: "action",
        label: "操作",
        width: 200,
        actives: [
          {
            perCode: "a0901a",
            name: "编辑",
            method: val => {
              state.title = "编辑";
              state.formInitDataDialog = JSON.parse(JSON.stringify(val));
              dialogVisible.value = true;
            }
          },
          {
            perCode: "a0901b",
            name: "详情",
            method: val => {
              state.formInitDataDialog = JSON.parse(JSON.stringify(val));
              dialogVisibles.value = true;
            }
          },
          {
            perCode: "a0901e",
            name: val => {
              if (val.enable == 0) {
                return "启用";
              }
            },
            method: val => {
              couponManagementEnable({
                id: val.id,
                enable: val.enable == 0 ? 1 : 0
              }).then(res => {
                const { code } = res;
                if (code == 200) {
                  ElMessage.success("操作成功");
                  TableList.value.update({ ...state.formInitData });
                }
              });
            }
          },
          {
            perCode: "a0901f",
            name: val => {
              if (val.enable !== 0) {
                return "禁用";
              }
            },
            method: val => {
              couponManagementEnable({
                id: val.id,
                enable: val.enable == 0 ? 1 : 0
              }).then(res => {
                const { code } = res;
                if (code == 200) {
                  ElMessage.success("操作成功");
                  TableList.value.update({ ...state.formInitData });
                }
              });
            }
          },
          {
            perCode: "a0901c",
            name: "删除",
            method: val => {
              couponManagementSingle({ id: val.id }).then(res => {
                state.used = res.data.used;
              });

              ElMessageBox.confirm(`确认删除${val.name}?`, "确认提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              })
                .then(() => {
                  if (state.used == 1) {
                    ElMessage.success("已引用不可删除！");
                  } else {
                    couponManagementDelete({ id: val.id }).then(res => {
                      if (res.code == 200) {
                        ElMessage({
                          type: "success",
                          message: `操作成功`
                        });
                        TableList.value.update({ ...state.formInitData });
                      } else {
                        ElMessage({
                          type: "error",
                          message: `操作失败`
                        });
                      }
                    });
                  }
                })
                .catch(error => {
                  console.log(error);
                });
            }
          }
        ]
      }
    ]);
    // 表单详情
    const configs = {
      allRequired: false, // 是否全部必填
      inline: false, //行内
      colon: "",
      inputStyle: {
        width: "360px"
      },
      buttons: [
        {
          funType: "add",
          type: "primary",
          name: "取消",
          size: "small"
        }
      ]
    };
    // 表单状态
    const itemListDialogs = [
      {
        code: "name",
        label: "优惠券名称",
        placeholder: "请输入优惠券名称",
        disabled: true
      },
      {
        code: "money",
        label: "抵扣金额",
        placeholder: "请输入金额",
        suffix: "元",
        disabled: true
      }
    ];
    // 表单点击
    const buttonDialogs = val => {
      switch (val.text) {
        case "取消":
          dialogVisibles.value = false;
          break;
        default:
          break;
      }
    };
    const dataDialogs = dataDialog(dialogVisible, TableList, state);
    return {
      ...toRefs(state),
      TableList,
      config,
      configs,
      button,
      column,
      getList,
      itemList,
      itemListDialogs,
      buttonDialogs,
      dialogVisible,
      dialogVisibles,
      ...dataDialogs,
      addFormConfig
    };
  }
};

// 表单
const dataDialog = (dialogVisible, TableList, state) => {
  // 表单状态
  const itemListDialog = [
    {
      code: "name",
      label: "优惠券名称",
      placeholder: "请输入优惠券名称"
    },
    {
      code: "money",
      label: "抵扣金额",
      placeholder: "请输入金额",
      suffix: "元"
    }
  ];
  // 表单点击
  const buttonDialog = val => {
    switch (val.text) {
      case "取消":
        dialogVisible.value = false;
        break;
      case "确认":
        if (state.title == "新增") {
          couponManagementAdd({ ...val.value }).then(res => {
            const { code } = res;
            if (code == 200) {
              ElMessage.success("操作成功");
              dialogVisible.value = false;
              TableList.value.update();
            }
          });
        } else {
          couponManagementUpdata({ ...val.value }).then(res => {
            const { code } = res;
            if (code == 200) {
              ElMessage.success("操作成功");
              dialogVisible.value = false;
              TableList.value.update();
            }
          });
        }
        break;
      default:
        break;
    }
  };

  return {
    itemListDialog,
    buttonDialog
  };
};
</script>

<style lang="scss" scoped></style>
