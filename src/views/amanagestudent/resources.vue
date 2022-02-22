<!--
 * @Author: 刘帝君
 * @Date: 2021-10-12 17:53:52
 * @LastEditors: 刘帝君
 * @LastEditTime: 2021-12-06 09:40:48
 * @Descripttion: 跟进资源池
-->
<template>
  <div>
    <div class="title">
      <formList
        :config="configFollow"
        :itemList="itemListFollow"
        :formInitData="formInitData"
        @buttonClick="buttonFollow"
      />
    </div>
    <div class="table">
      <Table
        ref="TableLists"
        :loadData="getList"
        :column="columnFollow"
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
import { allStudentPoolList } from "@/api/school";
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
    const state = reactive({
      formInitData: {}
    });
    // 数据
    const getList = computed(() => {
      return allStudentPoolList;
    });

    const replace = (name, index) => {
      const start = new Array(name.length).join("*");
      const end = name.slice(0, index);
      return end + start;
    };

    const TableLists = ref(null);
    const itemListFollow = [
      {
        code: "keyword",
        label: "",
        placeholder: "搜索学员姓名和手机号"
      }
    ];

    const configFollow = {
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
        }
      ]
    };

    const columnFollow = reactive([
      {
        prop: "name",
        label: "姓名"
      },
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
        label: "咨询校区",
        width: 180
      },
      {
        prop: "salesmanName",
        label: "销售",
        width: 150
      },
      {
        prop: "sourceNames",
        label: "来源渠道",
        width: 180
      },
      {
        prop: "operatorName",
        label: "注册人",
        width: 180
      },
      {
        prop: "distributeStatus",
        label: "分配状态",
        width: 180
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
        label: "资源类型",
        width: 180
      },

      {
        prop: "studyGoalNames",
        label: "学习目的",
        width: 180
      },
      {
        prop: "practiceBaseStatusName",
        label: "练习基础",
        width: 180
      },
      {
        prop: "consultCourseName",
        label: "咨询课程",
        width: 180
      },
      {
        prop: "studyIntentionStatusName",
        label: "学习意向",
        width: 180
      },

      {
        prop: "studentPositionNames",
        label: "学员身份",
        width: 180
      },

      {
        prop: "action",
        label: "操作",
        width: 200,
        actives: [
          // {
          //   perCode: "a0702b",
          //   name: "跟进",
          //   method: val => {
          //     router.push({
          //       path: "/student/stuDetaile",
          //       query: { id: val.id, tabs: "fourth", isDetails: 1 }
          //     });
          //   }
          // },
          {
            perCode: "a0702b",
            name: "跟进",
            method: val => {
              router.push({
                path: "/student/stuEditor",
                query: { id: val.id, tabs: "fourth", isDetails: 2 }
              });
              store.commit("user/setStuPermissions", [
                "a0702d",
                "a0702e",
                "a0702f",
                "a0702g"
              ]);
            }
          },
          {
            perCode: "a0702c",
            name: "详情",
            method: val => {
              router.push({
                path: "/student/stuDetaile",
                query: { id: val.id, isDetails: 1 }
              });
            }
          }
        ]
      }
    ]);

    // 搜索
    const buttonFollow = val => {
      TableLists.value.update({ ...val.value });
    };

    return {
      ...toRefs(state),
      getList,
      TableLists,
      itemListFollow,
      configFollow,
      columnFollow,
      buttonFollow
    };
  }
};
</script>

<style lang="scss" scoped></style>
