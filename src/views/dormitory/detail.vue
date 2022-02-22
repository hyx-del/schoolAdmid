<!--
 * @Author: aa
 * @Date: 2021-08-27 11:29:06
 * @LastEditors: zx
 * @LastEditTime: 2021-11-18 17:49:16
 * @Descripttion: 宿舍管理详情
-->
<template>
  <el-row :gutter="20">
    <el-col :span="12">
      <div class="title">
        <H3>待分宿舍学员列表</H3>
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
          :select="leftSelects"
        />
      </div>
    </el-col>
    <el-col :span="12">
      <H3
        >{{ dormitoryInfo.name || "--" }} 宿舍 ({{
          dormitoryInfo.usedNumber
        }}/{{ dormitoryInfo.maxNumber }})
      </H3>
      <el-button
        type="primary"
        icon="el-icon-delete"
        size="small"
        style="margin-bottom:30px"
        @click="removeStudentByBatch"
        >批量删除</el-button
      >
      <div class="table">
        <Table
          ref="TableDormitoryList"
          :showSortIndex="{ show: true, lable: '序号' }"
          :loadData="getDormitoryList"
          :column="columnDormitory"
          :params="formInitDormitoryData"
          :select="rightSelects"
        />
      </div>
    </el-col>
  </el-row>
</template>

<script>
import formList from "@/components/FormList/index.vue";
import Table from "@/components/Table/index";
import store from "@/store";
import { toRefs, ref, reactive, computed } from "vue";
import {
  delDormAPI,
  addStudentToDormAPI,
  removeStudentFromDormAPI,
  getDormDetailById
} from "@/api/classManagement";
import {
  getStudentListBybydormidAPI,
  getStudentListNoDormBySchoolIdAPI
} from "@/api/school";

import { useRouter, useRoute } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { enableList } from "@/utils/enum/select";

export default {
  components: {
    formList,
    Table
  },
  setup() {
    let leftSelectedStudents = [];
    let rightSelectedStudents = [];
    const router = useRouter();
    const params = useRoute().query;
    const TableList = ref(null);
    const TableDormitoryList = ref(null);

    const queryList = [
      {
        el: "input",
        label: "学员名称",
        code: "name"
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
          funType: "addStudent",
          type: "primary",
          name: "批量添加",
          size: "small"
        }
      ]
    };
    const leftSelects = items => {
      console.log(items, "val");
      leftSelectedStudents = [...items];
    };
    const rightSelects = items => {
      console.log(items, "val");
      rightSelectedStudents = [...items];
    };

    const state = reactive({
      formInitData: { schoolId: store.getters.activeSchoolId },
      formInitDormitoryData: { dormId: params.did, size: 100 }, //  每个宿舍最多100 人这里就不用分页查询
      dormitoryInfo: {},
      column: [
        { prop: "name", label: "学员名称" },
        { prop: "semesterName", label: "学期" },
        { prop: "mobile", label: "手机号码" },
        {
          prop: "action",
          label: "操作",
          actives: [
            {
              name: "新 增",
              method: val => {
                ElMessageBox.confirm(`确认添加:${val.name}?`, "确认提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
                })
                  .then(() => {
                    addStudentToDormitory([val]);
                  })
                  .catch(error => {});
              }
            }
          ]
        }
      ],
      columnDormitory: [
        { prop: "name", label: "学员名称" },
        // { prop: "semesterName",label: "学期" },
        { prop: "mobile", label: "手机号码" },
        {
          prop: "action",
          label: "操作",
          actives: [
            {
              name: "删除",
              method: val => {
                ElMessageBox.confirm(`确认删除:${val.name}?`, "确认提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
                })
                  .then(() => {
                    removeStudentFromDormitory([val]);
                  })
                  .catch(error => {});
              }
            }
          ]
        }
      ]
    });

    const getList = computed(() => {
      return getStudentListNoDormBySchoolIdAPI;
    });
    const getDormitoryList = computed(() => {
      return getStudentListBybydormidAPI;
    });
    const buttonCallBack = val => {
      if (val.name == "addStudent") {
        debugger;
        addStudentToDormitory([...leftSelectedStudents]);
      } else if (val.name == "confirm") {
        if (val.value) {
          TableList.value.update({ ...val.value });
        }
      }
    };
    const getDormInfo = () => {
      getDormDetailById({ id: params.did }).then(res => {
        if (res.code == 200) {
          state.dormitoryInfo = res.data;
        }
      });
    };
    const removeStudentByBatch = () => {
      removeStudentFromDormitory([...rightSelectedStudents]);
    };
    // 往宿舍里面添加学生
    const addStudentToDormitory = students => {
      // 批量添加宿舍学生
      if (students.length == 0) {
        return;
      }
      let _par = {
        dormId: params.did,
        studentIds: []
      };
      students.forEach(item => {
        _par.studentIds.push(item.id);
      });
      addStudentToDormAPI(_par).then(res => {
        if (res.code == 200) {
          ElMessage.success("操作成功");
          getDormInfo();
          leftSelectedStudents = [];
          TableList.value.update({ ...state.formInitData });
          TableDormitoryList.value.update({ ...state.formInitDormitoryData });
        } else {
          ElMessage.error("操作失败");
        }
      });
    };

    // 从宿舍里面移除学生
    const removeStudentFromDormitory = students => {
      // debugger;
      // 批量添加宿舍学生
      if (students.length == 0) {
        return;
      }
      let _par = {
        dormId: params.did,
        studentIds: []
      };
      students.forEach(item => {
        _par.studentIds.push(item.id);
      });
      removeStudentFromDormAPI(_par).then(res => {
        if (res.code == 200) {
          ElMessage.success("操作成功");
          rightSelectedStudents = [];
          getDormInfo();
          TableList.value.update({ ...state.formInitData });
          TableDormitoryList.value.update({ ...state.formInitDormitoryData });
        } else {
          ElMessage.error("操作失败");
        }
      });
    };

    // 数据初始化
    getDormInfo();

    return {
      ...toRefs(state),
      queryList,
      config,
      getList,
      getDormitoryList,
      buttonCallBack,
      TableList,
      TableDormitoryList,
      leftSelects,
      rightSelects,
      removeStudentByBatch
    };
  }
};
</script>

<style lang="scss" scoped></style>
