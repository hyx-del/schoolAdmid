<!--
 * @Author: aa
 * @Date: 2021-08-27 13:39:06
 * @LastEditors: 刘帝君
 * @LastEditTime: 2021-12-02 13:17:41
 * @Descripttion: 总部-学员管理
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
import { studentList } from "@/api/school";
import { staffGetSaleStaffList } from "@/api/managerStaff";
import { useRouter } from "vue-router";
import {
  genderList,
  studentStatusList,
  degreesList,
  getListHtml
} from "@/utils/enum/select";
import store from "@/store";
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
        code: "keyword",
        label: "",
        placeholder: "搜索学员姓名和手机号"
      },
      {
        el: "select",
        label: "状态",
        code: "status",
        list: studentStatusList
      },
      {
        el: "select",
        label: "性别",
        code: "gender",
        list: genderList
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
        label: "注册等级",
        code: "degree",
        list: degreesList
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
          name: "搜索",
          size: "small"
        },
        {
          funType: "add",
          name: "新 增",
          size: "small",
          perCode: "a0701a"
        }
      ]
    };
    const column = reactive([
      { prop: "name", label: "姓名" },
      {
        prop: "mobile",
        label: "手机",
        width: 150,
        html: (row, val) => replace(val, 3)
      },
      {
        prop: "gender",
        label: "性别",
        html: (row, val) => getListHtml(genderList, val)
      },
      {
        prop: "status",
        label: "状态",
        html: (row, val) => getListHtml(studentStatusList, val)
      },
      {
        prop: "consultSchoolNames",
        label: "咨询校区"
      },
      {
        prop: "salesmanName",
        label: "销售"
      },
      {
        prop: "sourceNames",
        label: "来源渠道"
      },
      {
        prop: "operatorName",
        label: "注册人"
      },
      {
        prop: "distributeStatus",
        label: "分配状态"
      },
      {
        prop: "degreeName",
        label: "注册等级"
      },
      {
        prop: "genre",
        label: "注册派别",
        width: 150
      },
      {
        prop: "company",
        label: "工作单位",
        width: 150
      },

      {
        prop: "weights",
        label: "权重"
      },
      {
        prop: "remark",
        label: "备注",
        width: 150
      },
      {
        prop: "createdAt",
        label: "注册时间",
        width: 180
      },
      {
        prop: "recordTime",
        label: "操作时间",
        width: 180
      },
      {
        prop: "updatedAt",
        label: "线索更新时间",
        width: 180
      },
      {
        prop: "resourceStatus",
        label: "资源状态"
      },
      {
        prop: "followTime",
        label: "跟进时间",
        width: 180
      },
      {
        prop: "resourceTypeName",
        label: "资源类型"
      },

      {
        prop: "studyGoalNames",
        label: "学习目的"
      },
      {
        prop: "practiceBaseStatusName",
        label: "练习基础"
      },
      {
        prop: "consultCourseNames",
        label: "咨询课程"
      },
      {
        prop: "studyIntentionNames",
        label: "学习意向"
      },

      {
        prop: "studentPositionNames",
        label: "学员身份"
      },

      {
        prop: "action",
        label: "操作",
        width: 220,
        actives: [
          {
            perCode: "a0701d",
            name: "编辑",
            method: val => {
              router.push({
                path: "/student/stuEditor",
                query: { id: val.id, isDetails: 2 }
              });
            }
          },
          {
            perCode: "a0701c",
            name: "详情",
            method: val => {
              router.push({
                path: "/student/stuDetaile",
                query: { id: val.id, isDetails: 1 }
              });
            }
          },
          {
            perCode: "a0701b",
            name: "查看跟进记录",
            method: val => {
              router.push({
                path: "/student/stuDetaile",
                query: { id: val.id, tabs: "fourth", isDetails: 1 }
              });
            }
          }
        ]
      }
    ]);
    const getList = computed(() => {
      return studentList;
    });
    const state = reactive({
      formInitData: {}
    });
    // 添加和搜索
    const button = val => {
      switch (val.text) {
        case "新 增":
          router.push({ path: "/student/stuAdd" });
          break;
        case "搜索":
          TableList.value.update({ ...val.value });
          break;
        default:
          break;
      }
    };
    const replace = (name, index) => {
      const start = new Array(name.length).join("*");
      const end = name.slice(0, index);
      return end + start;
    };

    return {
      ...toRefs(state),
      itemList,
      config,
      column,
      replace,
      getList,
      button,
      TableList
    };
  }
};
</script>

<style lang="scss" scoped></style>
