<!--
 * @Author: aa
 * @Date: 2021-08-27 11:29:06
 * @LastEditors: 刘帝君
 * @LastEditTime: 2021-11-04 16:25:19
 * @Descripttion: 注册派别
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
      />
    </div>
    <popupForm
      v-model:show="dialogFormVisible"
      v-model:formInitData="form"
      :title="dialogTitle"
      :itemList="[{ label: '名称', code: 'label' }]"
      :fun="popFun"
      :tabelRef="TableList"
    />
  </div>
</template>

<script>
import formList from "@/components/FormList/index.vue";
import popupForm from "@/components/FormList/popupForm.vue";
import Table from "@/components/Table/index";
import { toRefs, ref, reactive, computed } from "vue";
import {
  getRegCliqueListAPI,
  changeStateItemAPI,
  addRegCliqueAPI,
  editRegCliqueAPI,
  deleteItemAPI
} from "@/api/baseSet";
import { useRouter, useRoute } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { enableList, enableStatus } from "@/utils/enum/select";

export default {
  components: {
    formList,
    popupForm,
    Table
  },
  setup() {
    const router = useRouter();
    const TableList = ref(null); // this.$refs.TableList

    const queryList = [
      {
        el: "select",
        label: "状态",
        code: "status",
        list: [...enableList]
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
          name: "新 增",
          size: "small",
          perCode: "a0601a"
        }
      ]
    };
    const state = reactive({
      dialogTitle: "添加注册派别",
      formInitData: {},
      dialogFormVisible: false,
      form: {
        label: ""
      },
      popFun: computed(() =>
        state.dialogTitle == "添加注册派别" ? addRegCliqueAPI : editRegCliqueAPI
      )
    });
    const column = [
      { prop: "label", label: "名称" },
      {
        prop: "status",
        label: "状态",
        html: (row, val) => {
          if (enableStatus[val]) {
            return `<span style='color:${
              enableStatus[val].color
            }'>${enableStatus[val].label || ""}</span>`;
          } else {
            ("");
          }
        }
      },
      {
        prop: "createTime",
        label: "创建时间"
      },

      {
        prop: "action",
        label: "操作",
        actives: [
          {
            perCode: "a0601b",
            name: val => {
              return "编辑";
            },
            method: (val, row) => {
              state.dialogTitle = "编辑注册派别";
              state.form = JSON.parse(JSON.stringify(val));
              state.dialogFormVisible = true;
            }
          },
          {
            perCode: "a0601e",
            name: "删除",
            method: val => {
              ElMessageBox.confirm(`确认删除${val.label}?`, "确认提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              })
                .then(() => {
                  deleteItemAPI({ ...val }).then(res => {
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
                })
                .catch(error => {
                  console.log(error);
                });
            }
          },
          {
            perCode: "a0601d",
            name: val => {
              if (val.status == 0) {
                return "启用";
              }
            },
            method: val => {
              changeStateItemAPI({
                id: val.id,
                status: val.status == 0 ? 1 : 0
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
            perCode: "a0601c",
            name: val => {
              if (val.status !== 0) {
                return "禁用";
              }
            },
            method: val => {
              changeStateItemAPI({
                id: val.id,
                status: val.status == 0 ? 1 : 0
              }).then(res => {
                const { code } = res;
                if (code == 200) {
                  ElMessage.success("操作成功");
                  TableList.value.update({ ...state.formInitData });
                }
              });
            }
          }
        ]
      }
    ];
    const getList = computed(() => {
      return getRegCliqueListAPI;
    });
    const buttonCallBack = val => {
      if (val.name == "add") {
        // 弹窗 todo
        state.dialogTitle = "添加注册派别";
        state.dialogFormVisible = true;
      } else if (val.name == "confirm") {
        if (val.value) {
          TableList.value.update({ ...val.value });
        }
      }
    };

    return {
      ...toRefs(state),
      queryList,
      config,
      column,
      getList,
      buttonCallBack,
      TableList
    };
  }
};
</script>

<style lang="scss" scoped></style>
