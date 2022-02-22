<!--
 * @Author: 刘帝君
 * @Date: 2021-09-23 09:56:45
 * @LastEditors: 刘帝君
 * @LastEditTime: 2021-11-18 13:49:39
 * @Descripttion:
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
import { schoolList, changestatus } from "@/api/headquarters";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { registrationList } from "@/api/studentSemester";
import { getTopHeaderSchoolList } from "@/api/school";
import { semesterList } from "@/api/semester";
import { staffGetSaleStaffList } from "@/api/managerStaff";
import { reportStatusList, getListHtml } from "@/utils/enum/select";
import { url } from "@/config";
import { objToUrl } from "@/utils/tools";
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
        label: "报到状态",
        el: "select",
        list: reportStatusList,
        code: "status",
        placeholder: ""
      },
      {
        el: "select",
        code: "schoolId",
        label: "校区",
        fun: getTopHeaderSchoolList,
        funMode: "one",
        otherBack: "select_label", // label的返回值
        back: true, // 从后台返回结果
        labelCode: "name", // 指定的label名
        valueCode: "id" // 指定的value名
      },
      {
        el: "select",
        code: "salesmanId",
        label: "销售",
        fun: staffGetSaleStaffList,
        funMode: "one",
        otherBack: "select_label", // label的返回值
        back: true, // 从后台返回结果
        labelCode: "name", // 指定的label名
        valueCode: "id", // 指定的value名
        filterable: true // 可搜索
      },
      {
        el: "select",
        code: "semesterId",
        label: "学期",
        fun: semesterList,
        funMode: "table",
        otherBack: "select_label", // label的返回值
        back: true, // 从后台返回结果
        labelCode: "name", // 指定的label名
        valueCode: "id" // 指定的value名
      },
      {
        el: "date",
        label: "日期选择",
        code: "testCode",
        otherCodeArr: ["startTime", "endTime"], // 开始和结束
        dateType: "daterange",
        dataFormat: "{y}-{m}-{d} {h}:{i}:{s}"
      },
      {
        code: "keyword",
        label: "搜索",
        placeholder: "搜索学员姓名和手机号"
      }
    ];

    const config = {
      allRequired: false, // 是否全部必填
      inline: true, //行内
      colon: ":",
      inputStyle: {
        width: "220px"
      },
      buttons: [
        {
          funType: "confirm",
          type: "primary",
          name: "搜索",
          size: "small"
        },
        {
          funType: "confirm",
          type: "primary",
          name: "导出",
          size: "small"
        }
      ]
    };

    const column = reactive([
      { prop: "studentName", label: "姓名" },
      { prop: "mobile", label: "手机" },
      { prop: "schoolName", label: "学校" },
      { prop: "semesterName", label: "学期" },
      { prop: "className", label: "班级" },
      { prop: "dormName", label: "宿舍" },
      {
        prop: "statusName",
        label: "报到状态",
        html: (row, val) => (row.status == 0 ? "未报道" : val)

      },
      { prop: "earnestPaid", label: "已付定金" },
      { prop: "finalPaid", label: "已付尾款" },
      {
        prop: "squareUp",
        label: "是否结清",
        html: (row, val) => {
          return val ? "是" : "否";
        }
      },
      { prop: "shareMemberName", label: "推荐人" },
      { prop: "salesmanNames", label: "销售" },
      { prop: "createdAt", label: "创建时间" }
    ]);

    const state = reactive({
      formInitData: {},
      getList: registrationList
    });
    const button = ({ text, value }) => {
      console.log(value, "value");
      switch (text) {
        case "搜索":
          TableList.value.update({ ...value });
          break;
        case "导出":
          let par = objToUrl(value);
          window.open(
            `${url.APIUrl}/admin/school/registration/export${par}`,
            "_blank"
          );
          break;
        default:
          break;
      }
    };
    return {
      ...toRefs(state),
      itemList,
      config,
      column,
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
