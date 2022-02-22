<!--
 * @Author: aa
 * @Date: 2021-08-27 11:29:06
 * @LastEditors: 刘帝君
 * @LastEditTime: 2021-11-05 13:35:14
 * @Descripttion: 班级信息管理
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
        :params="formInitDataTable"
        :showSortIndex="{ show: true, lable: '序号' }"
      />
    </div>
    <el-dialog :title="title" v-model="dialogFormVisible" destroy-on-close>
      <el-form :model="form">
        <el-form-item label="班级名称" :label-width="120">
          <el-input
            v-model="form.name"
            autocomplete="off"
            style="width:80%"
          ></el-input>
        </el-form-item>

        <el-form-item label="学期" :label-width="120">
          <el-select
            clearable
            v-model="form.semesterId"
            placeholder="学期"
            style="width:80%"
            :disabled="title == '班级编辑'"
          >
            <el-option
              v-for="item in semesterLists"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addPayType">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import formList from "@/components/FormList/index.vue";
import Table from "@/components/Table/index";
import store from "@/store";
import { toRefs, ref, reactive, computed, watch } from "vue";
import {
  classManagementList,
  changeStateItemAPI,
  addStudentPositionAPI,
  deleteItemAPI,
  studentPositionEdit
} from "@/api/classManagement";
import { semesterList } from "@/api/semester";
import { useRouter, useRoute } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { enableList } from "@/utils/enum/select";

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
        code: "status",
        list: [
          { value: "1", label: "启用" },
          { value: "-1", label: "禁用" }
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
          name: "查 询",
          size: "small"
        },
        {
          funType: "add",
          name: "新 增",
          size: "small",
          perCode: "s0301a"
        }
      ]
    };

    const state = reactive({
      formInitData: {},
      formInitDataTable: {
        schoolId: store.getters.activeSchoolId
      },
      semesterLists: {},
      dialogFormVisible: false,
      form: {},
      title: "",
      column: [
        // { prop: "id", label: "序号", width: "80" },
        { prop: "name", label: "名称", width: 320 },
        { prop: "schoolName", label: "学校", width: 230 },
        { prop: "semesterName", label: "学期" },
        { prop: "count", label: "当前人数", width: 100 },
        {
          prop: "status",
          label: "状态",
          width: 120,
          html: (row, val) =>
            `<span style="color:${val === -1 && "red"}">${
              val === 1 ? "启用" : "禁用"
            }</span>`
        },
        {
          prop: "action",
          label: "操作",
          width: 200,
          actives: [
            {
              name: "删除",
              method: val => {
                ElMessageBox.confirm(`确认删除${val.name}?`, "确认提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
                })
                  .then(() => {
                    deleteItemAPI({ id: val.id }).then(res => {
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
              perCode: "s0301d",
              name: val => {
                if (val.status == -1) {
                  return "启用";
                }
              },
              method: val => {
                changeStateItemAPI({
                  id: val.id,
                  status: val.status == -1 ? 1 : -1
                }).then(res => {
                  const { code } = res;
                  if (code == 200) {
                    ElMessage.success("操作成功");
                    TableList.value.update({ ...state.formInitData });
                    // 刷新顶部班级
                    store.dispatch(
                      "user/getUserHaveClassList",
                      store.getters.activeSchoolId
                    );
                  }
                });
              }
            },
            {
              perCode: "s0301e",
              name: val => {
                if (val.status !== -1) {
                  return "禁用";
                }
              },
              method: val => {
                changeStateItemAPI({
                  id: val.id,
                  status: val.status == -1 ? 1 : -1
                }).then(res => {
                  const { code } = res;
                  if (code == 200) {
                    ElMessage.success("操作成功");
                    TableList.value.update({ ...state.formInitData });
                    // 刷新顶部班级
                    store.dispatch(
                      "user/getUserHaveClassList",
                      store.getters.activeSchoolId
                    );
                  }
                });
              }
            },
            {
              perCode: "s0301b",
              name: "编辑",
              method: val => {
                console.log(val, "班级编辑");
                state.title = "班级编辑";
                // 获取学期
                let _par = {};
                _par.schoolId = store.getters.activeSchoolId;
                semesterList(_par).then(res => {
                  console.log(res.data, "res.data");
                  state.semesterLists = res.data.records;
                  state.form = val;
                });
                state.dialogFormVisible = true;
              }
            }
          ]
        }
      ]
    });

    const getList = computed(() => {
      return classManagementList;
    });

    // 监听学校发生改变
    watch(
      () => store.getters.activeSchoolId,
      (val, old) => {
        TableList.value.update({ schoolId: val });
      }
    );

    // 按钮
    const buttonCallBack = val => {
      if (val.text == "新 增") {
        state.title = "班级新增";
        state.form = {};
        // 弹窗
        state.dialogFormVisible = true;
        // 获取学期
        let _par = {};
        _par.schoolId = store.getters.activeSchoolId;
        _par.size = 1000;
        semesterList(_par).then(res => {
          console.log(res.data, "res.data");
          state.semesterLists = res.data.records;
        });
      } else if (val.text == "查 询") {
        if (val.value) {
          TableList.value.update({ ...val.value });
        }
      }
    };

    const addPayType = () => {
      state.form.schoolId = store.getters.activeSchoolId;
      if (state.title !== "班级编辑") {
        addStudentPositionAPI({ ...state.form }).then(res => {
          if (res.code == 200) {
            ElMessage({
              type: "success",
              message: `新增成功`
            });
            TableList.value.update({ ...state.formInitDataTable });
            state.dialogFormVisible = false;
          }
        });
      } else {
        studentPositionEdit({ ...state.form }).then(res => {
          if (res.code == 200) {
            ElMessage({
              type: "success",
              message: `编辑成功`
            });
            TableList.value.update({ ...state.formInitDataTable });
            state.dialogFormVisible = false;
          }
        });
      }
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
