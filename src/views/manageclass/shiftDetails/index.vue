<!--
 * @Author: 刘帝君
 * @Date: 2021-09-29 10:18:18
 * @LastEditors: jiu yin zhen jing
 * @LastEditTime: 2021-11-04 10:30:01
 * @Descripttion:
-->
<template>
  <div>
    <div class="details">详情</div>
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
        :params="tableData"
        :select="selects"
        :showSortIndex="{ show: true, lable: '序号' }"
      />
    </div>

    <!-- <el-pagination
      v-model:currentPage="currentPage3"
      :page-size="100"
      layout="prev, pager, next, jumper"
      :total="1000"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination> -->

    <el-dialog v-model="classesAdds" title="新 增" width="70%">
      <classes-add
        :dataObj="data"
        @callbacks="callbacks"
        v-if="classesAdds"
      ></classes-add>
    </el-dialog>
  </div>
</template>

<script>
import formList from "@/components/FormList/index.vue";
import Table from "@/components/Table/index";
import classesAdd from "./classesAdd";
import { toRefs, ref, reactive, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { divisionDetails, divisionDelete } from "@/api/classManagement";

export default {
  components: {
    formList,
    Table,
    classesAdd
  },
  setup() {
    const router = useRouter();
    const TableList = ref(null);
    const classesAdds = ref(false);
    const queryList = [
      {
        code: "name",
        label: "搜索",
        placeholder: "搜索学员名"
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
          type: "primary",
          name: "新增",
          size: "small",
          perCode: "s0302c"
        },
        {
          funType: "add",
          type: "primary",
          name: "批量删除",
          size: "small",
          perCode: "s0302d"
        }
      ]
    };
    const data = {
      id: useRoute().query.id,
      semesterId: useRoute().query.semesterId
    };
    const state = reactive({
      formInitData: {},
      checkbox: [],
      tableData: {
        classId: data.id,
        semesterId: data.semesterId
      },
      column: [
        // { prop: "id", label: "序号", width: "80" },
        { prop: "name", label: "学员名" },
        { prop: "mobile", label: "手机号" },
        { prop: "time", label: "操作人" },
        { prop: "time", label: "修改时间" },
        {
          prop: "action",
          label: "操作",
          actives: [
            {
              perCode: "s0302d",
              name: "删除",
              method: val => {
                ElMessageBox.confirm(`确认删除${val.name}?`, "确认提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
                })
                  .then(() => {
                    console.log(val, "删除");
                    let _data = {
                      classId: data.id,
                      studentIds: [val.id]
                    };
                    divisionDelete(_data).then(res => {
                      if (res.code == 200) {
                        ElMessage({
                          type: "success",
                          message: `操作成功`
                        });
                        TableList.value.update({ ...state.tableData });
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
            }
          ]
        }
      ]
    });

    const getList = computed(() => {
      return divisionDetails;
    });

    const buttonCallBack = val => {
      console.log(val, "val");
      switch (val.text) {
        case "新增":
          classesAdds.value = true;
          break;
        case "查 询":
          const dataObj = {
            ...val.value,
            ...state.tableData
          };
          TableList.value.update({ ...dataObj });
          break;
        case "批量删除":
          ElMessageBox.confirm(`确认删除这些数据?`, "确认提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              const arr = [];
              state.checkbox.forEach(_val => {
                arr.push(_val.id);
              });

              let _data = {
                classId: state.tableData.classId,
                studentIds: arr
              };
              divisionDelete(_data).then(res => {
                if (res.code == 200) {
                  ElMessage({
                    type: "success",
                    message: `操作成功`
                  });
                  TableList.value.update({ ...state.tableData });
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
          break;

        default:
          break;
      }
    };

    const selects = val => {
      state.checkbox = val;
      console.log(val, "多选");
    };

    const callbacks = val => {
      classesAdds.value = false;
      TableList.value.update({ ...state.tableData });
      console.log(val, "回调");
    };

    // const handleSizeChange = val => {
    //   console.log(`${val} items per page`);
    // };
    // const handleCurrentChange = val => {
    //   console.log(`current page: ${val}`);
    // };

    return {
      ...toRefs(state),
      queryList,
      //   currentPage3: ref(5),
      //   handleSizeChange,
      //   handleCurrentChange,
      classesAdds,
      config,
      getList,
      TableList,
      buttonCallBack,
      selects,
      callbacks,
      data
    };
  }
};
</script>

<style lang="scss" scoped>
.details {
  font-size: 20px;
  font-weight: bold;
  margin: 10px 0;
}
</style>
