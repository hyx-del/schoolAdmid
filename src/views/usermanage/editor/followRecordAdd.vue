<!--
 * @Author: 刘帝君
 * @Date: 2021-09-10 13:14:40
 * @LastEditors: 刘帝君
 * @LastEditTime: 2021-12-03 15:20:48
 * @Descripttion: 
-->
<template>
  <div>
    <h2>新增跟进记录</h2>
    <div>基本信息</div>
    <el-divider></el-divider>
    <formList
      :config="addFormConfig"
      :itemList="itemList"
      :formInitData="formInitData"
      @buttonClick="button"
    >
      <template v-slot:slot1>
        <div>跟进信息</div>
        <el-divider></el-divider>
      </template>
    </formList>
  </div>
</template>

<script>
import { toRefs, reactive, onMounted } from "vue";
import { addFormConfig } from "../../../utils/config";
import {
  getSourceList,
  getTopHeaderSchoolList,
  addStudentFollow,
  studentDetail,
  studentFollowUpList
} from "@/api/school";
import { useRoute, useRouter } from "vue-router";
import { dictType } from "@/api/dict";
import formList from "@/components/FormList/index.vue";
import { ElMessage } from "element-plus";
import {
  genderList,
  practiceBaseList,
  studyIntentionList
} from "@/utils/enum/select";

export default {
  components: {
    formList
  },
  setup() {
    const router = useRouter();
    const state = reactive({
      formInitData: {},
      id: useRoute().query.studentId,
      itemList: [
        {
          code: "name",
          maxlength: 60,
          label: "姓名",
          disabled: true
        },
        {
          code: "mobile",
          type: "phone",
          maxlength: 11,
          label: "电话",
          disabled: true
        },
        {
          el: "radio",
          code: "gender",
          label: "性别",
          list: genderList,
          disabled: true
        },
        {
          code: "wechatId",
          maxlength: 60,
          label: "微信号",
          required: false,
          disabled: true
        },
        {
          el: "area",
          code: "mergerRegion",
          label: "地址",
          areaCode: "province,provinceId,city,cityId,area,areaId",
          placeholder: " ",
          disabled: true
        },
        {
          el: "select",
          code: "sourceIds",
          label: "来源渠道",
          fun: getSourceList,
          funMode: "one",
          otherBack: "select_label", // label的返回值
          back: true, // 从后台返回结果
          labelCode: "name", // 指定的label名
          valueCode: "id", // 指定的value名
          multiple: true,
          backType: "ArrayStringNumber",
          disabled: true
        },
        {
          el: "itemSlot", //元素名字是slot
          slotName: "slot1" // 插槽的名字，不能重复
        },
        {
          el: "select",
          code: "studyGoalIds",
          label: "学习目的",
          fun: dictType,
          funMode: "one",
          otherBack: "select_label", // label的返回值
          back: true, // 从后台返回结果
          query: { type: "study_goal" },
          multiple: true,
          required: false,
          backType: "ArrayStringNumber"
        },
        {
          el: "select",
          code: "consultSchoolIds",
          label: "咨询校区",
          fun: getTopHeaderSchoolList,
          funMode: "one",
          otherBack: "select_label", // label的返回值
          back: true, // 从后台返回结果
          labelCode: "name", // 指定的label名
          valueCode: "id", // 指定的value名
          multiple: true,
          required: false,
          backType: "ArrayStringNumber"
        },
        {
          el: "select",
          code: "communicationModeId",
          label: "沟通方式",
          fun: dictType,
          funMode: "one",
          otherBack: "select_label", // label的返回值
          back: true, // 从后台返回结果
          query: { type: "communication" }
        },
        {
          el: "select",
          code: "practiceBaseStatus",
          label: "练习基础",
          list: practiceBaseList,
          required: false
        },
        {
          el: "select",
          code: "consultCourseIds",
          label: "咨询课程",
          fun: dictType,
          funMode: "one",
          otherBack: "select_label", // label的返回值
          back: true, // 从后台返回结果
          query: { type: "consulting_course" },
          multiple: true,
          required: false,
          backType: "ArrayStringNumber"
        },
        {
          el: "select",
          code: "studyIntentionStatus",
          label: "学习意向",
          list: studyIntentionList,
          required: false
        },
        {
          el: "select",
          code: "studentPositionIds",
          label: "学员身份",
          fun: dictType,
          funMode: "one",
          otherBack: "select_label", // label的返回值
          back: true, // 从后台返回结果
          query: { type: "student_position" },
          multiple: true,
          required: false,
          backType: "ArrayStringNumber"
        },
        {
          el: "select",
          code: "resourceTypeId",
          label: "资源类型",
          fun: dictType,
          funMode: "one",
          otherBack: "select_label", // label的返回值
          back: true, // 从后台返回结果
          query: { type: "resource_type" }
        },
        {
          code: "remark",
          el: "textArea",
          maxlength: 255,
          label: "备注"
        },
        {
          el: "date",
          code: "expectedStartTime",
          label: "意向开始时间",
          endCode: "expectedEndTime",
          timeError: "开始时间要小于结束时间",
          required: false
        },
        {
          el: "date",
          code: "expectedEndTime",
          label: "意向结束时间",
          timeError: "结束时间要大于结束时间",
          starCode: "expectedStartTime",
          required: false
        }
      ]
    });

    // 页面载入后
    onMounted(() => {
      // 回显
      // studentFollowUpList({ studentId: state.id }).then(({ code, data }) => {
      //   console.log(data, "data");
      //   if (code == 200) {
      //     if (data.records.length !== 0) {
      //       data.records[0].name = data.records[0].studentName;
      //       state.formInitData = {
      //         ...data.records[0]
      //       };
      //     } else {
      studentDetail({ id: state.id }).then(({ code, data }) => {
        console.log(data, "基本信息");
        if (code == 200) {
          state.formInitData = data;
        }
      });
      //     }
      //   }
      // });
    });

    const button = val => {
      switch (val.text) {
        case "确认":
          addStudentFollow({
            ...val.value,
            studentId: state.id,
            operatorId: ""
          }).then(({ code }) => {
            ElMessage({
              message: `操作${code === 200 ? "成功" : "失败"}`,
              duration: 1000,
              type: "success",
              onClose: () => {
                code === 200 && router.back();
              }
            });
          });
          break;
        case "取消":
          router.back();
          break;
        default:
          break;
      }
    };
    return {
      ...toRefs(state),
      addFormConfig,
      button
    };
  }
};
</script>

<style lang="scss" scoped></style>
