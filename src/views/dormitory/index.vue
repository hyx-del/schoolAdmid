<!--
 * @Author: aa
 * @Date: 2021-08-27 11:29:06
 * @LastEditors: zx
 * @LastEditTime: 2021-11-03 13:40:58
 * @Descripttion: 宿舍管理
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
        :showSortIndex="{ show: true, lable: '序号' }"
        :loadData="getList"
        :column="column"
        :params="formInitData"
      />
    </div>
    <!-- 新增 -->
    <el-dialog
      width="600px"
      title="宿舍新增"
      v-model="dialogFormVisible"
      destroy-on-close
    >
      <el-form :model="form" :rules="rulesList" ref="addFormRef">
        <el-form-item label="宿舍名称" :label-width="120" prop="name">
          <el-input
            v-model="form.name"
            maxlength="20"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="容纳人数" :label-width="120" prop="maxNumber">
          <el-input
            v-model="form.maxNumber"
            maxlength="3"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addDormitory">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 编辑 -->
    <el-dialog
      width="600px"
      title="编辑宿舍"
      v-model="editModal"
      destroy-on-close
    >
      <el-form :model="editForm" :rules="rulesList" ref="editFormRef">
        <el-form-item label="宿舍名称" :label-width="120" prop="name">
          <el-input
            v-model="editForm.name"
            maxlength="20"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="容纳人数" :label-width="120" prop="maxNumber">
          <el-input
            v-model="editForm.maxNumber"
            maxlength="3"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editModal = false">取 消</el-button>
          <el-button type="primary" @click="editDormitory">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import formList from "@/components/FormList/index.vue";
import Table from "@/components/Table/index";
import store from "@/store";
import { toRefs, ref, reactive, computed } from "vue";
import {
  saveDormAPI,
  getDormListAPI,
  delDormAPI,
  editDormStatusAPI,
  editSchoolDorm
} from "@/api/classManagement";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";

export default {
  components: {
    formList,
    Table
  },
  setup() {
    const router = useRouter();
    const TableList = ref(null); // this.$refs.TableList
    const addFormRef = ref(null);
    const editFormRef = ref(null);
    const queryList = [
      {
        el: "input",
        label: "名称",
        code: "name"
      },
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
    const checkNumber = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入1-100之间的正整数"));
      }

      if (isNaN(Number(value))) {
        callback(new Error("请输入1-100之间的正整数"));
      } else {
        const _val = value * 1;
        if (_val > 101 || _val < 1) {
          callback(new Error("请输入1-100之间的正整数"));
        } else {
          callback();
        }
      }
    };
    const rulesList = {
      name: [
        {
          required: true,
          message: "请输入",
          trigger: "blur"
        },
        {
          min: 2,
          max: 20,
          message: "长度在2-20之间",
          trigger: "blur"
        }
      ],
      maxNumber: [
        {
          required: true,
          validator: checkNumber,
          trigger: "blur"
        }
      ]
    };
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
          perCode: "s0501a",
          funType: "add",
          type: "primary",
          name: "添加宿舍",
          size: "small"
        }
      ]
    };
    const state = reactive({
      formInitData: { schoolId: store.getters.activeSchoolId },
      dialogFormVisible: false,
      form: {
        maxNumber: null,
        name: "",
        schoolId: store.getters.activeSchoolId
      },
      editForm: {},
      column: [
        { prop: "name", label: "名称" },
        {
          prop: "usedNumber",
          label: "已住人数",
          html: (row, val) => `${val}/${row.maxNumber}`
        },
        { prop: "maxNumber", label: "容纳人数" },
        {
          prop: "status",
          label: "状态",
          html: (row, val) =>
            `<span style="color:${val === -1 && "red"}">${
              val === 1 ? "启用" : "禁用"
            }</span>`
        },

        {
          prop: "action",
          label: "操作",
          actives: [
            {
              perCode: "s0501f",
              name: (row, val) => {
                // console.log(val,row,"==")
                return "添加学员";
              },
              method: val => {
                router.push({
                  path: "./dormitoryDetail",
                  query: { did: val.id }
                });
              }
            },
            {
              perCode: "s0501b",
              name: "编辑",
              method: row => {
                console.log(row, "数据");
                state.editForm = row;
                state.editModal = true;
              }
            },
            {
              perCode: "s0501e",
              name: (val, row) => {
                if (val.status != 1) {
                  return "启用";
                } else {
                  return "";
                }
              },
              method: val => {
                editDormStatusFun(val);
              }
            },
            {
              perCode: "s0501c",
              name: (val, row) => {
                if (val.status == 1) {
                  return "禁用";
                } else {
                  return "";
                }
              },
              method: val => {
                editDormStatusFun(val);
              }
            },
            {
              perCode: "s0501d",
              name: val => {
                if (val.status == 1) {
                  return "";
                } else {
                  return "删除";
                }
              },
              method: val => {
                ElMessageBox.confirm(`确认删除:${val.name}?`, "确认提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
                })
                  .then(() => {
                    delDormAPI({ ...val }).then(res => {
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
                  .catch(error => {});
              }
            }
          ]
        }
      ],
      editModal: false
    });

    const getList = computed(() => {
      return getDormListAPI;
    });
    const buttonCallBack = val => {
      if (val.name == "add") {
        // 弹窗
        state.dialogFormVisible = true;
      } else if (val.name == "confirm") {
        if (val.value) {
          TableList.value.update({ ...val.value });
        }
      }
    };
    // 新增
    const addDormitory = () => {
      addFormRef.value.validate(valid => {
        if (valid) {
          let _par = { ...state.form };
          _par.maxNumber = _par.maxNumber * 1;
          saveDormAPI(_par).then(res => {
            if (res.code == 200) {
              addFormRef.value.resetFields();
              ElMessage.success("操作成功");
              TableList.value.update();
              state.dialogFormVisible = false;
            }
          });
        } else {
          return false;
        }
      });
    };
    const editDormitory = () => {
      editFormRef.value.validate(valid => {
        if (valid) {
          editSchoolDorm(state.editForm).then(({ code }) => {
            if (code === 200) {
              ElMessage.success("操作成功");
              TableList.value.update();
              state.editModal = false;
            }
          });
        } else {
          return false;
        }
      });
    };

    const editDormStatusFun = val => {
      editDormStatusAPI({
        id: val.id,
        status: val.status == 1 ? -1 : 1
      }).then(res => {
        const { code } = res;
        if (code == 200) {
          ElMessage.success("操作成功");
          TableList.value.update({ ...state.formInitData });
        }
      });
    };

    return {
      ...toRefs(state),
      queryList,
      config,
      addDormitory,
      getList,
      buttonCallBack,
      TableList,
      addFormRef,
      rulesList,
      editDormitory,
      editFormRef
    };
  }
};
</script>

<style lang="scss" scoped></style>
