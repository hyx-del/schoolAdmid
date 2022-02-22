<!--
 * @Author: aa
 * @Date: 2021-08-27 11:29:06
 * @LastEditors: 刘帝君
 * @LastEditTime: 2021-11-02 10:02:03
 * @Descripttion: 学期派别
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
  </div>
</template>

<script>
import formList from "@/components/FormList/index.vue";
import Table from "@/components/Table/index";
import { toRefs, ref, reactive, computed } from "vue";
import {
  semesterFactionListAPI,
  semesterFactionEnable,
  addStudentPositionAPI,
  semesterFactionDelete
} from "@/api/baseSet";
import { useRouter, useRoute } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import {categoryList2, enableList, enableStatus, getListHtml} from "@/utils/enum/select";

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
        el: "select",
        label: "状态",
        code: "enable",
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
          perCode: "a0608a"
        }
      ]
    };
    const state = reactive({
      formInitData: {},
      dialogFormVisible: false,
      form: {
        label: ""
      },
      column: [
        {
          prop: "name",
          label: "名称"
        },
        {
          prop: "category",
          label: "学期类别",
          html: (row, val) => getListHtml(categoryList2, val)
        },
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
          label: "创建时间"
        },

        {
          prop: "action",
          label: "操作",
          actives: [
            {
              perCode: "a0608b",
              name: "编辑",
              method: val => {
                console.log(val, "编辑");
                router.push({
                  path: "/basicsettings/semesterFactionAdd",
                  query: {
                    id: val.id
                  }
                });
              }
            },
            {
              perCode: "a0608c",
              name: "详情",
              method: val => {
                console.log(val, "详情");
                router.push({
                  path: "/basicsettings/semesterFactionDetails",
                  query: { id: val.id }
                });
              }
            },
            {
              perCode: "a0608f",
              name: "删除",
              method: val => {
                ElMessageBox.confirm(`确认删除${val.name}?`, "确认提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
                })
                  .then(() => {
                    semesterFactionDelete({ ...val }).then(res => {
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
              perCode: "a0608e",
              name: val => {
                if (val.enable == 0) {
                  return "启用";
                }
              },
              method: val => {
                semesterFactionEnable({
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
              perCode: "a0608d",
              name: val => {
                if (val.enable !== 0) {
                  return "禁用";
                }
              },
              method: val => {
                semesterFactionEnable({
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
            }
          ]
        }
      ]
    });
    const getList = computed(() => {
      return semesterFactionListAPI;
    });
    const buttonCallBack = val => {
      if (val.name == "add") {
        // 弹窗 todo
        // state.dialogFormVisible = true;
        router.push({ path: "/basicsettings/semesterFactionAdd" });
      } else if (val.name == "confirm") {
        // val.value
        if (val.value) {
          // console.log(val);
          TableList.value.update({ ...val.value });
        }
      }
    };
    const addPayType = () => {
      addStudentPositionAPI({ ...state.form }).then(res => {
        if (res.code == 200) {
          TableList.value.update();
          state.dialogFormVisible = false;
        }
      });
    };

    return {
      ...toRefs(state),
      queryList,
      config,
      addPayType,
      getList,
      buttonCallBack,
      TableList
    };
  }
};
</script>

<style lang="scss" scoped></style>
