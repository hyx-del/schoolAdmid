<!--
 * @Author: 郑晶
 * @Date: 2021-10-13 14:05:47
 * @LastEditors: 郑晶
 * @LastEditTime: 2021-11-10 16:18:56
 * @Descripttion: 学员管理-学员详情-跟进记录
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
import { studentFollowUpList } from "@/api/school";
import { practiceBaseList, studyIntentionList } from "@/utils/enum/select";
import formList from "@/components/FormList/index.vue";
import { dictType } from "@/api/dict";
import Table from "@/components/Table/index";
import { useRouter, useRoute } from "vue-router";

export default defineComponent({
  components: {
    formList,
    Table
  },
  name: "basicInfo",
  setup() {
    const followUpTable = ref(null);
    const router = useRouter();
    // 学员id
    const id = useRoute().query.id;
    const state = reactive({
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
        buttons:
          useRoute().query.isDetails === "2"
            ? [
                {
                  funType: "add",
                  name: "新 增",
                  size: "small",
                  perCode: "s0601g"
                },
                {
                  funType: "confirm",
                  type: "primary",
                  name: "查 询",
                  size: "small"
                }
              ]
            : [
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
          el: "select",
          code: "communicationModeId",
          label: "沟通方式",
          fun: dictType,
          funMode: "one",
          otherBack: "select_label", // label的返回值
          back: true, // 从后台返回结果
          query: { type: "communication" },
          required: false
        },
        {
          el: "select",
          label: "练习基础",
          code: "practiceBaseStatus",
          list: practiceBaseList
        },
        {
          el: "select",
          label: "学习意向",
          code: "studyIntentionStatus",
          list: studyIntentionList
        },
        {
          el: "select",
          code: "resourceTypeId",
          label: "资源类型",
          fun: dictType,
          funMode: "one",
          otherBack: "select_label", // label的返回值
          back: true, // 从后台返回结果
          query: { type: "resource_type" },
          required: false
        },
        {
          code: "keyword",
          label: "",
          placeholder: "搜索记录内容"
        }
      ],
      columnFollow: [
        // { prop: "id", label: "序号", width: 80 },
        { prop: "studentName", label: "姓名", width: 120 },
        { prop: "mobile", label: "手机", width: 120 },
        { prop: "genderName", label: "性别" },
        { prop: "statusName", label: "状态" },
        { prop: "remark", label: "备注", width: 200 },
        { prop: "sourceNames", label: "来源渠道", width: 120 },
        { prop: "communicationModeName", label: "沟通方式", width: 200 },
        { prop: "resourceTypeName", label: "资源类型", width: 200 },
        { prop: "studyGoalIdNames", label: "学习目的", width: 200 },
        { prop: "practiceBaseName", label: "练习基础", width: 200 },
        { prop: "consultCourseNames", label: "咨询课程", width: 200 },
        { prop: "studyIntentionName", label: "学习意向", width: 200 },
        { prop: "consultSchoolNames", label: "咨询校区", width: 200 },
        { prop: "studentPositionNames", label: "学员身份", width: 200 },
        { prop: "expectedStartTime", label: "意向学习时间", width: 200 },
        { prop: "remark", label: "记录内容", width: 200 },
        { prop: "operatorName", label: "记录人" },
        { prop: "createdAt", label: "记录时间", width: 200 }
      ]
    });
    // 页面载入后
    onMounted(() => {});
    const buttonClueRecord = val => {
      followUpTable.value.update({ ...val.value });
    };
    //表单确定按钮
    const buttonFollowUp = val => {
      switch (val.text) {
        case "新 增":
          router.push({
            path: "/usermanage/followAdd",
            query: { studentId: id }
          });
          break;
        case "查 询":
          console.log(val.value, "参数啊啊啊");
          followUpTable.value.update({ ...val.value });
          break;
        default:
          break;
      }
    };
    const getListClue = computed(() => {
      return studentFollowUpList;
    });
    return {
      ...toRefs(state),
      addFormConfig,
      buttonClueRecord,
      followUpTable,
      getListClue,
      buttonFollowUp
    };
  }
});
</script>
