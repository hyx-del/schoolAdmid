<!--
 * @Author: jiu yin
 * @Date: 2021-09-03 10:57:48
 * @LastEditTime: 2021-11-04 10:31:29
 * @LastEditors: jiu yin zhen jing
 * @Description: 666
 * @FilePath: \school_admin\src\views\managesignup\transfer\index.vue
 *  “jiu”
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
  </div>
</template>

<script>
import formList from "@/components/FormList/index.vue";
import Table from "@/components/Table/index";
import { toRefs, ref, reactive, computed } from "vue";
import { getTransferSchoolListAPI } from "@/api/studentSemester";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { tabelFormConfig } from "@/utils/config";
import { ContainList, getListHtml } from "@/utils/enum/select";
import { semesterListBySchoolId } from "@/api/semester";
export default {
  components: {
    formList,
    Table
  },
  setup() {
    const router = useRouter();
    const TableList = ref(null);
    const itemList = [
      {
        label: "学员名称",
        el: "input",
        code: "studentName",
        placeholder: "学员名称"
      },
      {
        label: "学员电话",
        el: "input",
        code: "mobile",
        placeholder: "学员电话"
      },
      {
        el: "select",
        code: "semesterName",
        label: "学期",
        back: true, // 从后台返回结果
        labelCode: "name", // 指定的label名
        valueCode: "id", // 指定的value名
        fun: semesterListBySchoolId,
        query: { size: 1000 },
        // multiple:true,
        required: false
      }
    ];
    const config = {
      allRequired: false,
      inline: true, //行内
      colon: ":",
      inputStyle: {
        width: "240px"
      },
      buttons: [
        {
          funType: "confirm",
          type: "primary",
          name: "查 询",
          size: "small"
        }
      ]
    };
    const column = reactive([
      // { prop: "id",label: "序号",width: "80" },
      { prop: "studentName", label: "学员" },
      { prop: "mobile", label: "手机号" },
      { prop: "oldSchoolName", label: "原学校" },
      { prop: "oldSemesterName", label: "原学期" },
      { prop: "schoolName", label: "转入学校" },
      { prop: "semesterName", label: "转入学期" },
      { prop: "operatorName", label: "操作人" },
      { prop: "createdAt", label: "创建时间" }
      // { prop: "tuition",label: "学费" },
      // { prop: "email",label: "学费余款" },
      // { prop: "isQuarterage",label: "是否住宿",html: (row,val) => getListHtml(ContainList,val) },
      // { prop: "quarterage",label: "住宿费用" },
      // { prop: "earnestPaid",label: "已付定金" },
      // { prop: "depositPaid",label: "已付押金" },
      // { prop: "reason",label: "转学原因" },
    ]);
    const state = reactive({
      formInitData: {}
    });

    const getList = computed(() => {
      return getTransferSchoolListAPI;
    });
    const button = val => {
      // console.log(val);
      if (val.name == "confirm") {
        TableList.value.update({ ...val.value });
      }
    };
    return {
      ...toRefs(state),
      itemList,
      config,
      column,
      getList,
      button,
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
</style>
