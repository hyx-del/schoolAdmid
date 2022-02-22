<!--
 * @Author: 刘帝君
 * @Date: 2021-09-27 09:50:26
 * @LastEditors: 刘帝君
 * @LastEditTime: 2021-11-17 14:39:29
 * @Descripttion: 查看权益
-->
<template>
  <div>
    <div class="table">
      <Table
        ref="TableList"
        :loadData="getList"
        :column="column"
        :params="tableData"
        :showSortIndex="{ show: true, lable: '序号' }"
      />
    </div>
    <el-dialog
      v-model="dialogVisible"
      v-if="dialogVisible"
      title="报名"
      width="50%"
    >
      <formList
        :config="addFormConfig"
        :itemList="itemList"
        :formInitData="formInitData"
        @formChange="formChange"
        @buttonClick="button"
      >
        <template v-slot:slot1>
          <div>
            <el-select
              v-model="formInitDetaleInfo.semesterId"
              placeholder="请选择"
              style="width:360px"
            >
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>
        </template>
      </formList>
    </el-dialog>
  </div>
</template>

<script>
import formList from "@/components/FormList/index.vue";
import Table from "@/components/Table/index";
import { reactive, toRefs, computed, ref, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { addFormConfig } from "@/utils/config";
import {
  signupInterests,
  cancelAfterVerification,
  cancelAfterRegister
} from "@/api/coursesManagement";
import { useRoute, useRouter } from "vue-router";
import { getTopHeaderSchoolList } from "@/api/school";
import { semesterList } from "@/api/semester";
import { semesterFactionListAPIs } from "@/api/baseSet";
import store from "@/store";
// import {
//   genderList,
//   studentStatusList,
//   degreesList,
//   getListHtml
// } from "@/utils/enum/select";
export default {
  components: {
    Table,
    formList
  },
  setup() {
    const TableList = ref(null);
    const router = useRouter();
    const dialogVisible = ref(null);
    const formInitDetaleInfo = reactive({ semesterId: "" });
    const state = reactive({
      formInitData: {
        student: useRoute().query.name,
        phone: useRoute().query.mobile,
        studentId: useRoute().query.studentId
      },
      tableData: {
        registerId: useRoute().query.id
      },
      options: [],
      schoolIds: ""
    });

    const getList = computed(() => {
      return signupInterests;
    });

    const column = reactive([
      // { prop: "id", label: "序号", width: "80" },
      { prop: "categoryName", label: "派别" },
      { prop: "cost", label: "派别费用" },
      {
        prop: "status",
        label: "状态",
        html: (row, val) =>
          // getListHtml(genderList, val)
          {
            if (val == 0) return "未使用";
            else if (val == 1) return "已使用";
            else if (val == 2) return `<span style="color:red">已核销</span>`;
          }
      },
      { prop: "createdAt", label: "操作时间" },
      {
        prop: "action",
        label: "操作",
        width: "240px",
        actives: [
          {
            perCode: "a0802n",
            name: val => {
              if (val.status == 1) {
                return "查看报名学期";
              }
            },
            method: val => {
              console.log(val, "查看报名学期");
              router.push({
                path: "/studentRegistration/lists",
                query: {
                  menu: "1"
                }
              });
            }
          },
          {
            perCode: "a0802m",
            name: val => {
              if (val.status == 0) {
                return "立即报名";
              }
            },
            method: val => {
              const obj = {
                ...state.formInitData,
                mainCourseRightsId: val.id,
                semesterCategoryId: val.categoryId
              };
              state.options = [];
              formInitDetaleInfo.semesterId = "";
              state.schoolIds = "";
              state.formInitData = obj;
              dialogVisible.value = true;
              console.log(val, "val");
            }
          },
          {
            perCode: "a0802l",
            name: val => {
              if (val.status == 0) {
                return "核销";
              }
            },
            method: val => {
              ElMessageBox.confirm(`请问您是否核销当前派别?`, "确认提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              })
                .then(() => {
                  console.log("核销");
                  cancelAfterVerification({ id: val.id }).then(res => {
                    if (res.code == 200) {
                      ElMessage({
                        type: "success",
                        message: `操作成功`
                      });
                      TableList.value.update();
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
              console.log(val, "val");
            }
          }
        ]
      }
    ]);

    const itemList = [
      {
        code: "student",
        label: "学员",
        placeholder: "请输入学员",
        required: false,
        disabled: true
      },
      {
        code: "phone",
        label: "电话",
        placeholder: "请输入电话",
        required: false,
        disabled: true
      },
      {
        el: "select",
        code: "semesterCategoryId",
        label: "当前派别",
        fun: semesterFactionListAPIs,
        funMode: "one",
        otherBack: "select_label", // label的返回值
        back: true, // 从后台返回结果
        labelCode: "name", // 指定的label名
        valueCode: "id", // 指定的value名
        required: false,
        disabled: true
      },
      {
        el: "select",
        code: "schoolId",
        label: "报名学校",
        fun: getTopHeaderSchoolList,
        funMode: "one",
        otherBack: "select_label", // label的返回值
        back: true, // 从后台返回结果
        labelCode: "name", // 指定的label名
        valueCode: "id" // 指定的value名
      },
      {
        el: "slot",
        code: "semesterId",
        label: "学期",
        slotName: "slot1"
      }
    ];

    const button = val => {
      switch (val.text) {
        case "取消":
          // state.formInitData = {};
          dialogVisible.value = false;
          break;

        case "确认":
          val.value.semesterId = formInitDetaleInfo.semesterId;
          console.log(val.value, "确认");
          cancelAfterRegister({ ...val.value }).then(res => {
            const { code, data } = res;
            console.log(data, "这是数据");
            if (code == 200) {
              ElMessage.success("操作成功");
              TableList.value.update();
              dialogVisible.value = false;
            }
          });
          break;
        default:
          break;
      }
    };

    const formChange = val => {
      if (val.code == "schoolId") {
        state.schoolIds = val.value;
        console.log(state.schoolIds, "123");
      }
    };

    // 监听
    watch(
      () => state.schoolIds,
      (newValue, oldValue) => {
        formInitDetaleInfo.semesterId = "";
        if (newValue) {
          // 学期数据
          semesterList({
            current: 1,
            size: 20000,
            schoolId: newValue, //学校id
            semesterCategoryId: state.formInitData.semesterCategoryId //学期派别id
          }).then(res => {
            console.log(res.data, "学期数据");
            state.options = res.data.records;
          });
        } else {
          state.options = [];
        }
      },
      { immediate: true }
    );

    return {
      ...toRefs(state),
      getList,
      column,
      TableList,
      dialogVisible,
      addFormConfig,
      itemList,
      formChange,
      button,
      formInitDetaleInfo
    };
  }
};
</script>

<style lang="scss" scoped></style>
