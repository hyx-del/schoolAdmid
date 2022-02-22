<!--
 * @Author: 郑晶
 * @Date: 2021-10-13 14:05:47
 * @LastEditors: zx
 * @LastEditTime: 2021-11-04 13:45:18
 * @Descripttion: 学员管理-学员详情-报名记录
-->
<template>
  <div>
    <formList
      :config="tabelFormConfig"
      :itemList="itemListFollowUp"
      :formInitData="formInitDatas"
      @buttonClick="buttonFollowUp"
    >
    </formList>
    <Table
      ref="followUpTable"
      :loadData="getListClue"
      :column="columnFollow"
      :params="formInitDatas"
      :showSortIndex="{ show: true, lable: '序号' }"
    />
  </div>
</template>

<script>
import {
  defineComponent,
  onMounted,
  reactive,
  toRefs,
  computed,
  ref
} from "vue";
import { addFormConfig } from "../../../utils/config";
import { registrationRecord } from "@/api/school";
import formList from "@/components/FormList/index.vue";
import Table from "@/components/Table/index";
import { useRouter, useRoute } from "vue-router";
import { staffGetSaleStaffList } from "@/api/managerStaff";

export default defineComponent({
  components: {
    formList,
    Table
  },
  name: "basicInfo",
  setup() {
    const followUpTable = ref(null);
    // 学员id
    const id = useRoute().query.id;
    const state = reactive({
      //选项卡默认
      activeName: "first",
      formInitDatas: {
        studentId: id
      },
      tabelFormConfig: {
        allRequired: false, // 是否全部必填
        inline: true, //行内
        colon: "",
        inputStyle: {
          width: "230px"
        },
        buttons: [
          {
            funType: "confirm",
            type: "primary",
            name: "查 询",
            size: "small"
          }
        ]
      },
      itemListFollowUp: [
        {
          code: "keyword",
          label: "",
          placeholder: "搜索校区和学区"
        },
        {
          el: "select",
          code: "salesManId",
          label: "销售",
          fun: staffGetSaleStaffList,
          funMode: "one",
          otherBack: "select_label", // label的返回值
          back: true, // 从后台返回结果
          labelCode: "name", // 指定的label名
          valueCode: "id", // 指定的value名
          required: false,
          filterable: true // 可搜索
        }
      ],
      columnFollow: [
        // { prop: "id", label: "序号", width: 80 },
        { prop: "schoolName", label: "校区", width: 120 },
        { prop: "semesterName", label: "学期", width: 250 },
        { prop: "salesManName", label: "销售", width: 120 },
        { prop: "statusName", label: "报道状态", width: 120 },
        // {
        //   prop: "graduationCertificate",
        //   label: "毕业证",
        //   width: 120,
        //   img: true
        // },
        { prop: "desc", label: "备注", width: 120 }
      ]
    });
    // 页面载入后
    onMounted(() => {});
    //表单确定按钮
    const buttonFollowUp = val => {
      switch (val.text) {
        case "查 询":
          followUpTable.value.update({ ...val.value });
          break;
        default:
          break;
      }
    };
    const getListClue = computed(() => {
      return registrationRecord;
    });
    return {
      ...toRefs(state),
      addFormConfig,
      followUpTable,
      getListClue,
      buttonFollowUp
    };
  }
});
</script>
